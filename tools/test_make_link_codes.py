#!/usr/bin/env python3
"""Self-test of tools/make_link_codes.py (standard library only).

  python3 tools/test_make_link_codes.py

Everything runs in a temporary folder outside this repository: first run,
refusal to overwrite, extend with hand-typed columns preserved, a table
saved with a BOM (and as Excel saves it), verify passing, verify failing
after deliberate edits, the test vectors, and the safety checks.
"""

import base64
import csv
import hashlib
import importlib.util
import io
import json
import os
import re
import shutil
import stat
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.dont_write_bytecode = True      # leave no __pycache__ in tools/
HERE = Path(__file__).resolve().parent
SCRIPT = HERE / 'make_link_codes.py'
VECTORS = HERE / 'link_codes_test_vectors.json'
spec = importlib.util.spec_from_file_location('make_link_codes', str(SCRIPT))
mlc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mlc)


def run(*args):
    p = subprocess.run([sys.executable, str(SCRIPT)] + [str(a) for a in args],
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    return p.returncode, p.stdout + p.stderr


def read_rows(path):
    text = Path(path).read_bytes().decode('utf-8-sig')
    return list(csv.DictReader(io.StringIO(text, newline='')))


def write_rows(path, rows, header, bom=True, newline='\r\n'):
    buf = io.StringIO(newline='')
    w = csv.writer(buf, lineterminator=newline)
    w.writerow(header)
    for r in rows:
        w.writerow([r.get(h, '') for h in header])
    Path(path).write_bytes((b'\xef\xbb\xbf' if bom else b'') + buf.getvalue().encode('utf-8'))


class LinkCodes(unittest.TestCase):

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix='link_codes_test_'))
        self.priv = self.tmp / 'private' / 'link_codes'
        self.pub = self.priv / 'codes_public.json'
        self.table = self.priv / 'link_codes_private.csv'
        self.manifest = self.priv / 'link_codes_manifest.txt'

    def tearDown(self):
        shutil.rmtree(str(self.tmp))

    def args(self, *extra):
        return ['--private-dir', self.priv, '--public-out', self.pub] + list(extra)

    def first_run(self, *extra):
        rc, out = run(*self.args(*extra))
        self.assertEqual(rc, 0, out)
        return out

    def verify_ok(self):
        rc, out = run(*self.args('--verify'))
        self.assertEqual(rc, 0, out)
        self.assertIn('PASS', out)
        return out

    def verify_fails(self, *expect):
        rc, out = run(*self.args('--verify'))
        self.assertEqual(rc, 1, out)
        self.assertIn('FAIL', out)
        for e in expect:
            self.assertIn(e, out)
        return out

    # -- first run ----------------------------------------------------------

    def test_first_run(self):
        out = self.first_run()
        rows = read_rows(self.table)
        self.assertEqual(len(rows), 2 * (8 + 16 + 64))
        self.assertEqual(list(rows[0]), mlc.COLUMNS)
        self.assertTrue(self.table.read_bytes().startswith(b'\xef\xbb\xbf'))
        for p, n in (('test', 8), ('pilot', 16), ('main', 64)):
            for g in ('participant', 'control'):
                got = [r for r in rows if r['phase'] == p and r['group'] == g]
                self.assertEqual([int(r['slot']) for r in got], list(range(1, n + 1)))
                for r in got:
                    self.assertEqual(r['link_id'], '%s_%s_%03d' % (p, g, int(r['slot'])))
        codes = [r['code'] for r in rows]
        self.assertEqual(len(set(codes)), len(codes))
        for r in rows:
            self.assertRegex(r['code'], '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$')
            self.assertRegex(r['created_utc'], r'^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$')
            for h in mlc.HAND_COLUMNS:
                self.assertEqual(r[h], '')
            self.assertNotIn(r['code'], out)             # never printed without --show
        pub_text = self.pub.read_text()
        pub = json.loads(pub_text)
        self.assertEqual(pub['format'], 'dpdr-link-codes-v1')
        self.assertEqual(pub['hash'], 'sha256 of the upper-case code, UTF-8, lower-case hex')
        self.assertEqual(pub['created_utc'], max(r['created_utc'] for r in rows))
        self.assertEqual(len(pub['codes']), len(rows))
        for r in rows:
            k = hashlib.sha256(r['code'].encode('utf-8')).hexdigest()
            self.assertIn(k, pub['codes'])
            d = mlc.decrypt_entry(r['code'].lower(), pub['codes'][k])
            self.assertEqual((d['link_id'], d['phase'], d['group'], d['slot']),
                             (r['link_id'], r['phase'], r['group'], int(r['slot'])))
        # Nothing readable in the public file: no codes, no link_ids,
        # no group or phase names outside the descriptions.
        for r in rows:
            self.assertNotIn(r['code'], pub_text)
        body = json.dumps(pub['codes'])
        for word in ('participant', 'control', 'test_', 'pilot', 'main_', 'link_id'):
            self.assertNotIn(word, body)
        # Every entry has the same length (nothing leaks through its size).
        self.assertEqual({len(v) for v in pub['codes'].values()}, {216})
        # The manifest has the public file's checksum and the counts.
        man = self.manifest.read_text()
        self.assertIn('public_sha256: ' + hashlib.sha256(self.pub.read_bytes()).hexdigest(), man)
        self.assertRegex(man, r'main\s+participant\s+64\s+1-64')
        # Private files readable only by the owner.
        self.assertEqual(stat.S_IMODE(self.table.stat().st_mode), 0o600)
        self.assertEqual(stat.S_IMODE(self.manifest.stat().st_mode), 0o600)
        self.assertEqual(stat.S_IMODE(self.priv.stat().st_mode) & 0o077, 0)
        self.verify_ok()

    def test_counts_and_show(self):
        rc, out = run(*self.args('--test', 2, '--pilot', 0, '--main', 3, '--show'))
        self.assertEqual(rc, 0, out)
        rows = read_rows(self.table)
        self.assertEqual(len(rows), 10)
        for r in rows:
            self.assertIn('%s %s' % (r['link_id'], r['code']), re.sub(' +', ' ', out))

    def test_public_file_reproducible(self):
        self.first_run('--test', 3, '--pilot', 1, '--main', 2)
        first = self.pub.read_bytes()
        _, rows = mlc.read_private(self.table)
        mlc.check_table(rows, [])
        self.assertEqual(mlc.public_bytes(rows), first)

    # -- freezing -----------------------------------------------------------

    def test_refuses_to_overwrite(self):
        self.first_run()
        before = {p: p.read_bytes() for p in (self.table, self.pub, self.manifest)}
        for extra in ([], ['--main', '10'], ['--test', '0', '--pilot', '0', '--main', '1']):
            rc, out = run(*self.args(*extra))
            self.assertEqual(rc, 1, out)
            self.assertIn('already exists', out)
        for p, b in before.items():
            self.assertEqual(p.read_bytes(), b)

    def test_extend_keeps_hand_typed_columns(self):
        self.first_run()
        rows = read_rows(self.table)
        header = list(rows[0]) + ['my_extra_column']
        typed = {
            'test_participant_001': {'tester': '沢田 慕', 'sent_date': '2026/11/24',
                                     'notes': 'line one\nline two, with a comma and "quotes"'},
            'main_participant_017': {'pid': 'R_9rJJWk01c767jE8', 'idate': '2026-11-03',
                                     'sent_date': '24/11/2026', 'my_extra_column': 'kept'},
            'main_control_064': {'pid': 'R_4EWNe48BIB50mVI', 'notes': '  leading spaces kept'},
        }
        for r in rows:
            r.update(typed.get(r['link_id'], {}))
        write_rows(self.table, rows, header)
        self.verify_ok()
        rc, out = run(*self.args('--extend', '--test', 4, '--main', 20))
        self.assertEqual(rc, 0, out)
        self.assertIn('Added 48 codes', out)
        after = read_rows(self.table)
        self.assertEqual(list(after[0]), header)
        cells = lambda rs: [[r.get(h, '') for h in header] for r in rs]
        self.assertEqual(cells(after[:len(rows)]), cells(rows))   # every old row and column unchanged
        self.assertEqual(after[0]['tester'], '沢田 慕')
        self.assertEqual(after[0]['notes'], 'line one\nline two, with a comma and "quotes"')
        self.assertEqual([r['my_extra_column'] for r in after if r['link_id'] == 'main_participant_017'], ['kept'])
        new = after[len(rows):]
        self.assertEqual(len(new), 48)
        for g in ('participant', 'control'):
            self.assertEqual([int(r['slot']) for r in new if r['phase'] == 'test' and r['group'] == g],
                             [9, 10, 11, 12])
            self.assertEqual([int(r['slot']) for r in new if r['phase'] == 'main' and r['group'] == g],
                             list(range(65, 85)))
        self.assertFalse([r for r in new if r['phase'] == 'pilot'])
        self.assertTrue(all(r['created_utc'] >= rows[0]['created_utc'] for r in new))
        pub = json.loads(self.pub.read_text())
        self.assertEqual(len(pub['codes']), len(after))
        self.assertEqual(pub['created_utc'], new[0]['created_utc'])
        backups = list((self.priv / 'backups').iterdir())
        self.assertEqual(len(backups), 3)
        out = self.verify_ok()
        self.assertIn('224 codes', out)
        for r in new:
            self.assertNotIn(r['code'], out)

    def test_extend_needs_counts_and_a_table(self):
        rc, out = run(*self.args('--extend', '--test', 4))
        self.assertEqual(rc, 1, out)
        self.assertIn('does not exist', out)
        self.first_run()
        rc, out = run(*self.args('--extend'))
        self.assertEqual(rc, 1, out)
        self.assertIn('Nothing to add', out)

    def test_extend_refuses_when_files_disagree(self):
        self.first_run()
        rows = read_rows(self.table)
        write_rows(self.table, rows[:5] + rows[6:], list(rows[0]))    # a row deleted
        before = {p: p.read_bytes() for p in (self.table, self.pub, self.manifest)}
        rc, out = run(*self.args('--extend', '--main', 5))
        self.assertEqual(rc, 1, out)
        self.assertIn('Not extending', out)
        for p, b in before.items():
            self.assertEqual(p.read_bytes(), b)

    # -- spreadsheets -------------------------------------------------------

    def test_table_with_and_without_bom(self):
        self.first_run('--test', 2, '--pilot', 2, '--main', 2)
        rows = read_rows(self.table)
        for bom in (True, False):
            for nl in ('\r\n', '\n'):
                write_rows(self.table, rows, list(rows[0]), bom=bom, newline=nl)
                self.verify_ok()

    def test_table_as_a_spreadsheet_saves_it(self):
        self.first_run('--test', 2, '--pilot', 2, '--main', 2)
        rows = read_rows(self.table)
        for r in rows:
            r['slot'] = r['slot'] + '.0'                 # a number saved as 17.0
        rows[0]['tester'] = 'Imai'
        write_rows(self.table, rows, list(rows[0]))
        with open(str(self.table), 'ab') as f:
            f.write(b',,,,,,,,,,\r\n,,,,,,,,,,\r\n')     # empty rows at the end
        self.verify_ok()
        rc, out = run(*self.args('--extend', '--pilot', 1))
        self.assertEqual(rc, 0, out)
        after = read_rows(self.table)
        self.assertEqual(after[0]['slot'], '1.0')         # kept as it was saved
        self.assertEqual(after[0]['tester'], 'Imai')
        self.assertEqual([r['slot'] for r in after if r['phase'] == 'pilot' and r['group'] == 'control'],
                         ['1.0', '2.0', '3'])
        self.verify_ok()

    def test_not_utf8_or_semicolons(self):
        self.first_run('--test', 1, '--pilot', 0, '--main', 0)
        text = self.table.read_bytes().decode('utf-8-sig')
        self.table.write_bytes(text.replace(',,,,,', ',,é,,,', 1).encode('latin-1'))
        rc, out = run(*self.args('--verify'))
        self.assertEqual(rc, 1, out)
        self.assertIn('not UTF-8', out)
        self.table.write_bytes(text.replace(',', ';').encode('utf-8'))
        rc, out = run(*self.args('--verify'))
        self.assertEqual(rc, 1, out)
        self.assertIn('semicolons', out)

    def test_no_number_like_codes(self):
        for c in ('234567892345', '2345E6789234', '22E2'):
            self.assertTrue(mlc.NUMBER_LIKE_RE.match(c))
        for c in ('E23456789234', '23456789234E', 'ABCDEFGHJKMN', '2E3E45678923'):
            self.assertFalse(mlc.NUMBER_LIKE_RE.match(c))

    # -- verify failing -----------------------------------------------------

    def edit_table(self, fn):
        rows = read_rows(self.table)
        fn(rows)
        write_rows(self.table, rows, list(rows[0]))

    def test_verify_fails_after_edits(self):
        self.first_run('--test', 3, '--pilot', 3, '--main', 3)
        good = {p: p.read_bytes() for p in (self.table, self.pub, self.manifest)}

        def restore():
            for p, b in good.items():
                p.write_bytes(b)
            self.verify_ok()

        def change_code(rows):
            c = rows[2]['code']
            rows[2]['code'] = c[:-1] + ('A' if c[-1] != 'A' else 'B')
        self.edit_table(change_code)
        self.verify_fails('has no entry in the public file', 'with no row in the private table')
        restore()

        self.edit_table(lambda rows: rows[3].update(group='control' if rows[3]['group'] == 'participant' else 'participant'))
        self.verify_fails('link_id')
        restore()

        self.edit_table(lambda rows: rows.__setitem__(1, dict(rows[1], code=rows[0]['code'])))
        self.verify_fails('the same code as line 2')
        restore()

        self.edit_table(lambda rows: rows.pop(4))
        self.verify_fails('without gaps', 'with no row in the private table')
        restore()

        self.edit_table(lambda rows: rows[0].update(created_utc='2026/11/24 5:17'))
        self.verify_fails('created_utc')
        restore()

        # The public file: one character of an entry changed.
        pub = json.loads(self.pub.read_text())
        k = sorted(pub['codes'])[0]
        v = pub['codes'][k]
        pub['codes'][k] = ('B' if v[0] != 'B' else 'C') + v[1:]
        self.pub.write_text(json.dumps(pub, sort_keys=True, indent=1) + '\n')
        self.verify_fails('fails the integrity check', 'does not match the manifest')
        restore()

        # Two entries swapped.
        pub = json.loads(self.pub.read_text())
        a, b = sorted(pub['codes'])[:2]
        pub['codes'][a], pub['codes'][b] = pub['codes'][b], pub['codes'][a]
        self.pub.write_text(json.dumps(pub, sort_keys=True, indent=1) + '\n')
        self.verify_fails('fails the integrity check')
        restore()

        # An extra entry, and an entry removed.
        pub = json.loads(self.pub.read_text())
        pub['codes']['0' * 64] = pub['codes'][a]
        self.pub.write_text(json.dumps(pub, sort_keys=True, indent=1) + '\n')
        self.verify_fails('1 entry with no row in the private table')
        restore()
        pub = json.loads(self.pub.read_text())
        del pub['codes'][a]
        self.pub.write_text(json.dumps(pub, sort_keys=True, indent=1) + '\n')
        self.verify_fails('has no entry in the public file')
        restore()

        # The public file re-saved with other formatting: same content,
        # but no longer what the manifest describes.
        self.pub.write_text(json.dumps(json.loads(self.pub.read_text()), indent=2))
        self.verify_fails('does not match the manifest')
        restore()

        # The manifest edited.
        self.manifest.write_text(self.manifest.read_text().replace('public_sha256: ', 'public_sha256: 0'))
        self.verify_fails('does not match the manifest')
        restore()

        # A file missing.
        self.manifest.unlink()
        self.verify_fails('manifest not found')
        restore()

    # -- the entry scheme and the test vectors --------------------------------

    def test_vectors_file_matches_the_script(self):
        on_disk = json.loads(VECTORS.read_text(encoding='utf-8'))
        self.assertEqual(on_disk, mlc.test_vectors())
        for v in on_disk['vectors']:
            self.assertEqual(mlc.decrypt_entry(v['input'], v['entry']), v['decrypted'])
            self.assertEqual(len(v['plaintext']), 128)
            self.assertEqual(base64.b64decode(v['entry']).hex(), v['ciphertext_hex'] + v['tag_hex'])
        for m in on_disk['must_fail']:
            with self.assertRaises(mlc.Problem):
                mlc.decrypt_entry(m['input'], m['entry'])

    def test_vector_codes_never_generated(self):
        taken = set()
        orig = mlc.secrets.choice
        seq = iter('TESTVECTRA23' + 'TESTVECTRB45' + '23456789E234' + 'ABCDEFGHJKMN')
        mlc.secrets.choice = lambda alphabet: next(seq)
        try:
            self.assertEqual(mlc.new_code(taken), 'ABCDEFGHJKMN')
        finally:
            mlc.secrets.choice = orig

    def test_wrong_code_fails(self):
        e = mlc.encrypt_entry('ABCDEFGHJKMN', 'main', 'control', 3)
        self.assertEqual(mlc.decrypt_entry(' abcdefghjkmn ', e)['link_id'], 'main_control_003')
        with self.assertRaises(mlc.Problem):
            mlc.decrypt_entry('ABCDEFGHJKMP', e)

    # -- safety -------------------------------------------------------------

    def test_refuses_private_dir_inside_repository(self):
        repo = HERE.parent
        for d in (repo, repo / 'private', repo / 'tools' / 'x', Path(str(repo).upper()) / 'x'):
            rc, out = run('--private-dir', d, '--public-out', self.tmp / 'p.json')
            self.assertEqual(rc, 1, out)
            self.assertIn('inside this repository', out)
            self.assertFalse((repo / 'private').exists())
        self.assertFalse(list(repo.rglob('link_codes_private.csv')))

    def test_arguments_required(self):
        rc, out = run('--private-dir', self.priv)
        self.assertEqual(rc, 2, out)
        rc, out = run('--public-out', self.pub)
        self.assertEqual(rc, 2, out)

    def test_gitignore(self):
        lines = (HERE.parent / '.gitignore').read_text().split()
        self.assertIn('link_codes_private.csv', lines)
        self.assertIn('link_codes_manifest.txt', lines)


if __name__ == '__main__':
    unittest.main(verbosity=2)
