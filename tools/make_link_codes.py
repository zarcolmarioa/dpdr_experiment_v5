#!/usr/bin/env python3
"""Make the opaque link codes (dpdr-link-codes-v1).

Each participant link will carry one random code instead of pid, group,
slot and idate. A link is (phase, group, slot):

  phase  test | pilot | main
  group  participant | control
  slot   1, 2, 3, ... counted separately within each phase and group.
         Slot n keeps its meaning: row ((n - 1) mod 64) + 1 of the group's
         table in data/sets/v5c_180/assignment.json.

This script writes three files (see SETUP.md, "Link codes"):

  <private-dir>/link_codes_private.csv   PRIVATE: the codes, and columns
                                          you fill in by hand. Never commit.
  <private-dir>/link_codes_manifest.txt  PRIVATE: counts, and the checksum
                                          of the public file.
  <public-out>                           PUBLIC: for the experiment (a later
                                          change). No codes, nothing about
                                          people; each entry is encrypted
                                          with a key derived from its code.

Usage (Python 3.8+, standard library only):

  first run    python3 tools/make_link_codes.py --private-dir DIR --public-out FILE
               [--test N] [--pilot N] [--main N]     (defaults 8, 16, 64 per group)
  add codes    python3 tools/make_link_codes.py --private-dir DIR --public-out FILE
               --extend [--test N] [--pilot N] [--main N]   (N more per group)
  check        python3 tools/make_link_codes.py --private-dir DIR --public-out FILE --verify

Codes are printed only with --show (the codes made by that run).
The experiment does not use the codes yet.
"""

import argparse
import base64
import csv
import hashlib
import hmac
import io
import json
import os
import re
import secrets
import shutil
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

FORMAT = 'dpdr-link-codes-v1'
ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'   # no 0, O, 1, I, L
CODE_LEN = 12
PHASES = ('test', 'pilot', 'main')
GROUPS = ('participant', 'control')
DEFAULT_COUNTS = {'test': 8, 'pilot': 16, 'main': 64}

PRIVATE_NAME = 'link_codes_private.csv'
MANIFEST_NAME = 'link_codes_manifest.txt'
BACKUP_DIR = 'backups'
COLUMNS = ['link_id', 'phase', 'group', 'slot', 'code', 'created_utc',
           'pid', 'idate', 'tester', 'sent_date', 'notes']
SCRIPT_COLUMNS = COLUMNS[:6]          # written by the script, never edited
HAND_COLUMNS = COLUMNS[6:]            # yours: the script never changes them

# --- The entry scheme (all of it is available in the browser's Web Crypto:
# SHA-256 and HMAC-SHA256). See SETUP.md, "Link codes".
PLAIN_LEN = 128                       # plaintext padded with spaces to this
TAG_LEN = 32                          # HMAC-SHA256
ENC_LABEL = FORMAT.encode('ascii') + b' encryption key'
MAC_LABEL = FORMAT.encode('ascii') + b' integrity key'
AAD_PREFIX = FORMAT.encode('ascii') + b'\x00'

HASH_TEXT = 'sha256 of the upper-case code, UTF-8, lower-case hex'
INPUT_TEXT = ('remove surrounding spaces and upper-case the code before use '
              '(codes are accepted case-insensitively); codes are 12 characters '
              'from ' + ALPHABET)
ENTRY_TEXT = ('base64 of 160 bytes: 128 bytes of ciphertext, then a 32-byte '
              'HMAC-SHA256 tag; see SETUP.md, Link codes')

# Codes reserved for the published test vectors (tools/
# link_codes_test_vectors.json): never generated for a real table.
TEST_VECTOR_LINKS = [
    ('  TESTVECTRA23 ', 'test', 'participant', 1),
    ('testvectrb45', 'main', 'control', 64),
    ('TESTVECTRC67', 'pilot', 'participant', 16),
    ('TestVectrD89', 'main', 'participant', 65),
]
RESERVED_CODES = {c.strip().upper() for c, _, _, _ in TEST_VECTOR_LINKS}

ISO_RE = re.compile(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$')
CODE_RE = re.compile('^[' + ALPHABET + ']{' + str(CODE_LEN) + '}$')
# Codes Excel or Numbers would turn into a number (all digits, or digits
# with one E, read as scientific notation): never generated.
NUMBER_LIKE_RE = re.compile(r'^[0-9]+(E[0-9]+)?$')


class Problem(Exception):
    """A refusal or a failed check: printed, exit status 1 (2 for usage)."""


# ---------------------------------------------------------------------------
# Codes and entries
# ---------------------------------------------------------------------------

def normalise(code):
    return code.strip().upper()


def lookup_key(code):
    """The public key of a code's entry: sha256 of the upper-case code."""
    return hashlib.sha256(normalise(code).encode('utf-8')).hexdigest()


def _hmac(key, msg):
    return hmac.new(key, msg, hashlib.sha256).digest()


def derive_keys(code):
    """(encryption key, integrity key), 32 bytes each, from the code."""
    c = normalise(code).encode('utf-8')
    return _hmac(c, ENC_LABEL), _hmac(c, MAC_LABEL)


def keystream(enc_key, n):
    out = b''
    i = 0
    while len(out) < n:
        out += _hmac(enc_key, i.to_bytes(4, 'big'))
        i += 1
    return out[:n]


def link_id(phase, group, slot):
    return '%s_%s_%03d' % (phase, group, slot)


def plaintext(phase, group, slot):
    """Canonical JSON of the entry, ASCII, padded with spaces to 128 bytes."""
    body = json.dumps({'group': group, 'link_id': link_id(phase, group, slot),
                       'phase': phase, 'slot': slot},
                      sort_keys=True, separators=(',', ':'), ensure_ascii=True)
    raw = body.encode('ascii')
    if len(raw) > PLAIN_LEN:
        raise Problem('Entry too long for the format: %s' % body)
    return raw + b' ' * (PLAIN_LEN - len(raw))


def encrypt_entry(code, phase, group, slot):
    enc_key, mac_key = derive_keys(code)
    pt = plaintext(phase, group, slot)
    ct = bytes(a ^ b for a, b in zip(pt, keystream(enc_key, PLAIN_LEN)))
    tag = _hmac(mac_key, AAD_PREFIX + bytes.fromhex(lookup_key(code)) + ct)
    return base64.b64encode(ct + tag).decode('ascii')


def decrypt_entry(code, entry):
    """The entry as a dict, or Problem if it fails the integrity check or
    is not a well-formed entry."""
    try:
        raw = base64.b64decode(entry.encode('ascii'), validate=True)
    except (ValueError, UnicodeEncodeError):
        raise Problem('not valid base64')
    if len(raw) != PLAIN_LEN + TAG_LEN:
        raise Problem('wrong length (%d bytes)' % len(raw))
    ct, tag = raw[:PLAIN_LEN], raw[PLAIN_LEN:]
    enc_key, mac_key = derive_keys(code)
    want = _hmac(mac_key, AAD_PREFIX + bytes.fromhex(lookup_key(code)) + ct)
    if not hmac.compare_digest(tag, want):
        raise Problem('fails the integrity check')
    pt = bytes(a ^ b for a, b in zip(ct, keystream(enc_key, PLAIN_LEN)))
    try:
        d = json.loads(pt.decode('ascii'))
    except ValueError:
        raise Problem('does not decrypt to JSON')
    if (not isinstance(d, dict) or sorted(d) != ['group', 'link_id', 'phase', 'slot']
            or d['phase'] not in PHASES or d['group'] not in GROUPS
            or not isinstance(d['slot'], int) or isinstance(d['slot'], bool) or d['slot'] < 1
            or d['link_id'] != link_id(d['phase'], d['group'], d['slot'])
            or pt != plaintext(d['phase'], d['group'], d['slot'])):
        raise Problem('decrypts to an entry that is not well formed')
    return d


def new_code(taken):
    while True:
        c = ''.join(secrets.choice(ALPHABET) for _ in range(CODE_LEN))
        if c in taken or c in RESERVED_CODES or NUMBER_LIKE_RE.match(c):
            continue
        return c


# ---------------------------------------------------------------------------
# Files
# ---------------------------------------------------------------------------

def now_utc():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def sha256_file(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def atomic_write(path, data, mode=None):
    path = Path(path)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix='.' + path.name + '.')
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        if mode is not None:
            os.chmod(tmp, mode)
        os.replace(tmp, str(path))
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def parse_slot(s):
    """'17' or '17.0' (as a spreadsheet may save it) -> 17."""
    s = (s or '').strip()
    m = re.match(r'^(\d+)(?:\.0+)?$', s)
    if not m or int(m.group(1)) < 1:
        raise ValueError(s)
    return int(m.group(1))


def read_private(path):
    """(header, rows): rows are dicts of the cells as read (strings),
    plus '_line' (the line in the file) and '_slot' (the slot number)."""
    data = Path(path).read_bytes()
    if data.startswith(b'\xef\xbb\xbf'):
        data = data[3:]
    try:
        text = data.decode('utf-8')
    except UnicodeDecodeError:
        raise Problem('%s is not UTF-8. If you saved it from Excel, save it '
                      'again as "CSV UTF-8 (Comma delimited)"; from Numbers, '
                      'export as CSV with Unicode (UTF-8) encoding.' % path)
    reader = csv.reader(io.StringIO(text, newline=''))
    try:
        header = next(reader)
    except StopIteration:
        raise Problem('%s is empty.' % path)
    header = [h.strip() for h in header]
    if 'link_id' not in header and any(';' in h for h in header):
        raise Problem('%s seems to use semicolons between columns. Save it '
                      'with commas (Excel: "CSV UTF-8 (Comma delimited)").' % path)
    missing = [c for c in COLUMNS if c not in header]
    if missing:
        raise Problem('%s lacks the column(s) %s.' % (path, ', '.join(missing)))
    if len(set(header)) != len(header):
        raise Problem('%s has a column name twice.' % path)
    rows = []
    for n, cells in enumerate(reader, start=2):
        if not any(c.strip() for c in cells):
            continue                     # empty lines a spreadsheet may add
        cells = cells + [''] * (len(header) - len(cells))
        if len(cells) > len(header) and any(c.strip() for c in cells[len(header):]):
            raise Problem('%s, line %d: more cells than columns.' % (path, n))
        row = dict(zip(header, cells))
        row['_line'] = n
        rows.append(row)
    return header, rows


def write_private(path, header, rows):
    buf = io.StringIO(newline='')
    w = csv.writer(buf, lineterminator='\r\n')
    w.writerow(header)
    for r in rows:
        w.writerow([r.get(h, '') for h in header])
    # With a BOM, so that Excel shows non-ASCII text (names) correctly.
    atomic_write(path, b'\xef\xbb\xbf' + buf.getvalue().encode('utf-8'), 0o600)


def public_bytes(rows):
    """The public file, from the table alone (so it is reproducible)."""
    codes = {}
    for r in rows:
        codes[lookup_key(r['code'])] = encrypt_entry(r['code'], r['phase'], r['group'], r['_slot'])
    doc = {
        'format': FORMAT,
        'hash': HASH_TEXT,
        'input': INPUT_TEXT,
        'entry': ENTRY_TEXT,
        'created_utc': max(r['created_utc'] for r in rows),
        'codes': codes,
    }
    return (json.dumps(doc, sort_keys=True, indent=1, ensure_ascii=True) + '\n').encode('ascii')


def counts_of(rows):
    out = {}
    for p in PHASES:
        for g in GROUPS:
            slots = sorted(r['_slot'] for r in rows if r['phase'] == p and r['group'] == g)
            out[(p, g)] = slots
    return out


def manifest_text(rows, public_path, public_sha):
    lines = [
        'dpdr link codes: manifest (PRIVATE, keep with %s)' % PRIVATE_NAME,
        'format: ' + FORMAT,
        'updated_utc: ' + now_utc(),
        'private_table: ' + PRIVATE_NAME,
        'public_file: ' + str(public_path),
        'public_sha256: ' + public_sha,
        'codes_total: %d' % len(rows),
        '',
        'phase  group        codes  slots',
    ]
    for (p, g), slots in counts_of(rows).items():
        rng = ('%d-%d' % (slots[0], slots[-1])) if slots else '-'
        lines.append('%-6s %-12s %5d  %s' % (p, g, len(slots), rng))
    return '\n'.join(lines) + '\n'


def manifest_sha(path):
    for line in Path(path).read_text(encoding='utf-8-sig').splitlines():
        if line.startswith('public_sha256:'):
            return line.split(':', 1)[1].strip()
    return None


# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

def check_table(rows, problems):
    """Checks of the private table on its own; sets r['_slot']."""
    seen_codes, seen_ids = {}, {}
    for r in rows:
        where = 'private table, line %d' % r['_line']
        for c in SCRIPT_COLUMNS:
            r[c] = r[c].strip()
        try:
            r['_slot'] = parse_slot(r['slot'])
        except ValueError:
            problems.append('%s: slot %r is not a whole number of 1 or more' % (where, r['slot']))
            r['_slot'] = None
        if r['phase'] not in PHASES:
            problems.append('%s: phase %r is not one of %s' % (where, r['phase'], ', '.join(PHASES)))
        if r['group'] not in GROUPS:
            problems.append('%s: group %r is not one of %s' % (where, r['group'], ', '.join(GROUPS)))
        if r['_slot'] and r['phase'] in PHASES and r['group'] in GROUPS:
            want = link_id(r['phase'], r['group'], r['_slot'])
            if r['link_id'] != want:
                problems.append('%s: link_id %r does not match phase, group and slot (%s)'
                                % (where, r['link_id'], want))
        if not CODE_RE.match(r['code']):
            problems.append('%s (%s): the code is not 12 characters from the code alphabet'
                            % (where, r['link_id']))
        if not ISO_RE.match(r['created_utc']):
            problems.append('%s (%s): created_utc %r is not in the form 2026-11-24T05:06:07Z '
                            '(a spreadsheet may have changed it)' % (where, r['link_id'], r['created_utc']))
        if r['code'] in seen_codes:
            problems.append('%s: the same code as line %d' % (where, seen_codes[r['code']]))
        seen_codes.setdefault(r['code'], r['_line'])
        if r['link_id'] in seen_ids:
            problems.append('%s: link_id %s also on line %d' % (where, r['link_id'], seen_ids[r['link_id']]))
        seen_ids.setdefault(r['link_id'], r['_line'])
    if not problems:
        for (p, g), slots in counts_of(rows).items():
            if slots != list(range(1, len(slots) + 1)):
                missing = sorted(set(range(1, max(slots) + 1)) - set(slots))
                problems.append('private table: %s %s slots are not 1 to %d without gaps (missing %s)'
                                % (p, g, len(slots), ', '.join(map(str, missing)) or 'none'))


def verify(private_dir, public_out):
    """List of problems (empty when everything agrees) and the table."""
    problems = []
    table = private_dir / PRIVATE_NAME
    manifest = private_dir / MANIFEST_NAME
    for f, what in ((table, 'private table'), (public_out, 'public file'), (manifest, 'manifest')):
        if not f.exists():
            problems.append('%s not found: %s' % (what, f))
    if problems:
        return problems, None
    header, rows = read_private(table)
    if not rows:
        return ['the private table has no rows'], (header, rows)
    check_table(rows, problems)
    try:
        pub = json.loads(public_out.read_text(encoding='utf-8'))
    except ValueError as e:
        return problems + ['public file is not valid JSON (%s)' % e], (header, rows)
    for k, v in (('format', FORMAT), ('hash', HASH_TEXT), ('input', INPUT_TEXT), ('entry', ENTRY_TEXT)):
        if pub.get(k) != v:
            problems.append('public file: "%s" is not %r' % (k, v))
    codes = pub.get('codes')
    if not isinstance(codes, dict):
        return problems + ['public file: no "codes" object'], (header, rows)
    found = set()
    for r in rows:
        if not CODE_RE.match(r['code']):
            continue
        k = lookup_key(r['code'])
        if k not in codes:
            problems.append('%s: its code has no entry in the public file' % r['link_id'])
            continue
        found.add(k)
        try:
            d = decrypt_entry(r['code'], codes[k])
        except Problem as e:
            problems.append('%s: its public entry %s' % (r['link_id'], e))
            continue
        if (d['link_id'], d['phase'], d['group'], d['slot']) != (r['link_id'], r['phase'], r['group'], r['_slot']):
            problems.append('%s: its public entry says %s' % (r['link_id'], d['link_id']))
    extra = [k for k in codes if k not in found]
    if extra:
        problems.append('public file: %d entr%s with no row in the private table'
                        % (len(extra), 'y' if len(extra) == 1 else 'ies'))
    if not problems and public_bytes(rows) != public_out.read_bytes():
        problems.append('public file: not exactly what the private table gives '
                        '(edited, or created_utc differs)')
    want = manifest_sha(manifest)
    have = sha256_file(public_out)
    if want != have:
        problems.append('public file: its sha256 %s does not match the manifest (%s)' % (have, want))
    return problems, (header, rows)


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def repo_root():
    return Path(__file__).resolve().parent.parent


def inside(path, root):
    # Also compared ignoring case: macOS folders usually are.
    if path == root or root in path.parents:
        return True
    p, r = str(path).lower(), str(root).lower()
    return p == r or p.startswith(r.rstrip(os.sep) + os.sep)


def make_rows(existing, counts, created):
    taken = {r['code'] for r in existing}
    start = {k: len(v) for k, v in counts_of(existing).items()} if existing else {}
    new = []
    for p in PHASES:
        for g in GROUPS:
            first = start.get((p, g), 0) + 1
            for slot in range(first, first + counts[p]):
                code = new_code(taken)
                taken.add(code)
                new.append({'link_id': link_id(p, g, slot), 'phase': p, 'group': g,
                            'slot': str(slot), 'code': code, 'created_utc': created,
                            'pid': '', 'idate': '', 'tester': '', 'sent_date': '', 'notes': '',
                            '_slot': slot})
    return new


def write_all(private_dir, public_out, header, rows):
    data = public_bytes(rows)
    sha = hashlib.sha256(data).hexdigest()
    # The private table first (it holds the new codes), then the public
    # file and the manifest that describe it.
    write_private(private_dir / PRIVATE_NAME, header, rows)
    atomic_write(public_out, data, 0o644)
    atomic_write(private_dir / MANIFEST_NAME,
                 manifest_text(rows, public_out, sha).encode('utf-8'), 0o600)
    return sha


def summary(rows):
    c = counts_of(rows)
    parts = []
    for p in PHASES:
        parts.append('%s %d+%d' % (p, len(c[(p, 'participant')]), len(c[(p, 'control')])))
    return '%d codes (participant+control: %s)' % (len(rows), ', '.join(parts))


def cmd_create(args, private_dir, public_out):
    table = private_dir / PRIVATE_NAME
    if table.exists():
        raise Problem('%s already exists. The codes are frozen: the script never '
                      'makes them again. To add codes, use --extend; to check, '
                      'use --verify.' % table)
    counts = {p: (DEFAULT_COUNTS[p] if getattr(args, p) is None else getattr(args, p)) for p in PHASES}
    if not sum(counts.values()):
        raise Problem('Nothing to make: every count is 0.')
    if not private_dir.exists():
        private_dir.mkdir(parents=True, mode=0o700)
    rows = make_rows([], counts, now_utc())
    sha = write_all(private_dir, public_out, list(COLUMNS), rows)
    print('Made ' + summary(rows) + '.')
    report_paths(private_dir, public_out, sha)
    if args.show:
        show(rows)


def cmd_extend(args, private_dir, public_out):
    table = private_dir / PRIVATE_NAME
    if not table.exists():
        raise Problem('%s does not exist: nothing to extend. Run once without '
                      '--extend to make the first codes.' % table)
    counts = {p: (getattr(args, p) or 0) for p in PHASES}
    if not sum(counts.values()):
        raise Problem('Nothing to add: give --test N, --pilot N and/or --main N '
                      '(N more codes per group).')
    problems, tr = verify(private_dir, public_out)
    if problems:
        raise Problem('Not extending: the files do not agree as they are.\n  '
                      + '\n  '.join(problems)
                      + '\nNothing was changed. Restore the files (for example from '
                      + str(private_dir / BACKUP_DIR) + ') and run --verify.')
    header, rows = tr
    backup = private_dir / BACKUP_DIR
    backup.mkdir(mode=0o700, exist_ok=True)
    stamp = now_utc().replace(':', '').replace('-', '')
    for name in (PRIVATE_NAME, MANIFEST_NAME):
        dst = backup / ('%s.%s' % (stamp, name))
        shutil.copy2(str(private_dir / name), str(dst))
        os.chmod(str(dst), 0o600)
    shutil.copy2(str(public_out), str(backup / ('%s.%s' % (stamp, public_out.name))))
    new = make_rows(rows, counts, now_utc())
    all_rows = rows + new                   # existing rows exactly as read
    sha = write_all(private_dir, public_out, header, all_rows)
    print('Added %d codes; now %s.' % (len(new), summary(all_rows)))
    print('Copies of the files before this run: %s' % backup)
    report_paths(private_dir, public_out, sha)
    if args.show:
        show(new)


def cmd_verify(args, private_dir, public_out):
    problems, tr = verify(private_dir, public_out)
    if problems:
        print('FAIL: %d problem%s' % (len(problems), '' if len(problems) == 1 else 's'))
        for p in problems:
            print('  - ' + p)
        raise SystemExit(1)
    rows = tr[1]
    print('PASS: ' + summary(rows) + '.')
    print('Every code has its entry in the public file, with the same link_id, '
          'phase, group and slot; no duplicates, no extra entries; the public '
          'file matches the table and the manifest (sha256 %s).' % sha256_file(public_out))
    if args.show:
        show(rows)


def report_paths(private_dir, public_out, sha):
    print('Private table: %s' % (private_dir / PRIVATE_NAME))
    print('Manifest:      %s' % (private_dir / MANIFEST_NAME))
    print('Public file:   %s (sha256 %s)' % (public_out, sha))


def show(rows):
    print('')
    print('link_id                    code')
    for r in rows:
        print('%-26s %s' % (r['link_id'], r['code']))


def test_vectors():
    """The published test vectors (codes reserved, never generated)."""
    vec = []
    for given, p, g, s in TEST_VECTOR_LINKS:
        enc_key, mac_key = derive_keys(given)
        entry = encrypt_entry(given, p, g, s)
        raw = base64.b64decode(entry)
        vec.append({
            'input': given,
            'code': normalise(given),
            'lookup_key': lookup_key(given),
            'encryption_key_hex': enc_key.hex(),
            'integrity_key_hex': mac_key.hex(),
            'plaintext': plaintext(p, g, s).decode('ascii'),
            'ciphertext_hex': raw[:PLAIN_LEN].hex(),
            'tag_hex': raw[PLAIN_LEN:].hex(),
            'entry': entry,
            'decrypted': decrypt_entry(given, entry),
        })
    a, b = vec[0], vec[1]
    flip = bytearray(base64.b64decode(a['entry']))
    flip[0] ^= 0x01
    tag_flip = bytearray(base64.b64decode(a['entry']))
    tag_flip[-1] ^= 0x80
    wrong = a['code'][:-1] + ('4' if a['code'][-1] != '4' else '5')
    must_fail = [
        {'why': 'one bit of the ciphertext changed', 'input': a['input'],
         'entry': base64.b64encode(bytes(flip)).decode('ascii')},
        {'why': 'one bit of the tag changed', 'input': a['input'],
         'entry': base64.b64encode(bytes(tag_flip)).decode('ascii')},
        {'why': "another code's entry (entries swapped)", 'input': a['input'], 'entry': b['entry']},
        {'why': 'a different code (last character changed)', 'input': wrong, 'entry': a['entry']},
        {'why': 'entry cut short', 'input': a['input'], 'entry': a['entry'][:-4]},
    ]
    for m in must_fail:
        try:
            decrypt_entry(m['input'], m['entry'])
        except Problem:
            continue
        raise AssertionError('a must-fail vector decrypts: ' + m['why'])
    return {
        'format': FORMAT,
        'about': ('Test vectors for the link code entries (see SETUP.md, Link codes). '
                  'The codes here are reserved: the script never generates them, so '
                  'they are in no real table. "input" is what is typed; "code" is it '
                  'with surrounding spaces removed and upper-cased. Keys and '
                  'ciphertext are lower-case hex; "plaintext" is the 128 decrypted '
                  'bytes (ASCII, padded with spaces). Every "must_fail" entry has '
                  'to fail the integrity check (or be rejected as malformed).'),
        'vectors': vec,
        'must_fail': must_fail,
    }


def main(argv=None):
    ap = argparse.ArgumentParser(
        description='Make, extend or verify the link codes (see SETUP.md, "Link codes").')
    ap.add_argument('--private-dir', help='folder for the PRIVATE table and manifest '
                    '(outside this repository)')
    ap.add_argument('--public-out', help='path of the PUBLIC JSON file')
    ap.add_argument('--test', type=int, help='test codes per group (first run: default 8)')
    ap.add_argument('--pilot', type=int, help='pilot codes per group (first run: default 16)')
    ap.add_argument('--main', type=int, help='main codes per group (first run: default 64)')
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument('--extend', action='store_true', help='add codes to an existing table')
    mode.add_argument('--verify', action='store_true', help='check the files; write nothing')
    mode.add_argument('--make-test-vectors', metavar='FILE',
                      help='write the test vectors (tools/link_codes_test_vectors.json)')
    ap.add_argument('--show', action='store_true',
                    help='print the codes (made by this run; with --verify, all)')
    args = ap.parse_args(argv)

    try:
        if args.make_test_vectors:
            data = json.dumps(test_vectors(), indent=1, ensure_ascii=False) + '\n'
            atomic_write(Path(args.make_test_vectors).expanduser(), data.encode('utf-8'))
            print('Wrote %s' % args.make_test_vectors)
            return 0
        if not args.private_dir or not args.public_out:
            ap.error('--private-dir and --public-out are both required')
        for p in PHASES:
            v = getattr(args, p)
            if v is not None and not 0 <= v <= 9999:
                ap.error('--%s must be between 0 and 9999' % p)
        if args.verify and any(getattr(args, p) is not None for p in PHASES):
            ap.error('--verify takes no counts')
        private_dir = Path(args.private_dir).expanduser().resolve()
        public_out = Path(args.public_out).expanduser().resolve()
        root = repo_root()
        if inside(private_dir, root):
            raise Problem('Refusing: --private-dir %s is inside this repository (%s). '
                          'The private table must never be where it could be '
                          'committed. Choose a folder outside it.' % (private_dir, root))
        if public_out.is_dir():
            raise Problem('--public-out %s is a folder; give a file name.' % public_out)
        if public_out.parent == private_dir and public_out.name in (PRIVATE_NAME, MANIFEST_NAME):
            raise Problem('--public-out must not be the private table or the manifest.')
        if (not args.verify and not public_out.parent.exists()
                and public_out.parent != private_dir):
            raise Problem('The folder for --public-out does not exist: %s' % public_out.parent)
        if args.verify:
            cmd_verify(args, private_dir, public_out)
        elif args.extend:
            cmd_extend(args, private_dir, public_out)
        else:
            cmd_create(args, private_dir, public_out)
        return 0
    except Problem as e:
        print('ERROR: %s' % e, file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
