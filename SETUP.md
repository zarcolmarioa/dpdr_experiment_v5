# Setup and deployment

Everything here assumes Ubuntu and a terminal. Commands are given in full.

---

## 0. Prerequisites

Check `git` is installed:

```bash
git --version
```

If not:

```bash
sudo apt update && sudo apt install git
```

Check you can reach GitHub over SSH:

```bash
ssh -T git@github.com
```

A message beginning `Hi <username>! You've successfully authenticated` means
you are set. If you get `Permission denied (publickey)`, create a key and add
it to GitHub:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
```

Copy the printed line into GitHub → Settings → SSH and GPG keys → New SSH key.

---

## 1. Get the repository

The repository already exists on GitHub and already contains the frozen
v5c_180 package (~230 MB, see §5) — and the earlier v5b_180, no longer
used, of about the same size — so the first clone takes a little while:

```bash
git clone git@github.com:<username>/<repo-name>.git
cd <repo-name>
```

Work on a branch and merge to `main` only after testing: GitHub Pages
serves `main` (§2), so whatever is on `main` is what participants get.

---

## 2. Enable GitHub Pages

On GitHub: **Settings → Pages → Source → Deploy from a branch**, branch
`main`, folder `/ (root)`, then **Save**.

After a minute or two the site is live at:

```
https://<username>.github.io/<repo-name>/
```

Check it is serving:

```bash
curl -I https://<username>.github.io/<repo-name>/
```

`HTTP/2 200` means it is up. `404` means Pages has not finished deploying, or
the branch or folder is wrong.

---

## 3. DataPipe

The values are already in `config.js`:

```js
datapipe: {
  experiment_id: 'VoYGtg5yKGr2',  // TEST experiment — replace before data collection
  zenodo_record: '[Zenodo record — to complete]',
}
```

DataPipe stores each uploaded file on **Zenodo** (the mechanism is the same
as it was with OSF). **Both experiment IDs in `config.js` (responses and
contact details) are the test experiments**, kept so the code can be tested
end to end; their data mix with older test sessions. Before data collection,
create new DataPipe experiments for v5c, connect each to its Zenodo record,
and put the new IDs in `config.js` (`README.md`, "Before data collection").

**Before every test round, on the DataPipe dashboard:**

1. Set **Enable data collection** to ON. This is the single most common
   reason an upload fails silently. The experiment reports the failure on
   the completion screen, but only when `CONFIG.debug` is `true`.
2. Leave **Enable base64 data collection** OFF (that is for binary uploads).
3. Leave **Enable condition assignment** OFF (we do our own assignment).
4. Leave **Enable session limit** OFF until recruitment starts. Then set it
   to your target as a guard against runaway sessions.
5. Under **Validation**, keep **Allow CSV** checked. The required field
   `trial_type` is supplied automatically by jsPsych on every row, so it is
   satisfied without any work on our side.

### A name collision worth knowing about

jsPsych writes its own `trial_type` column containing the *plugin* name,
and overwrites any other value we give that column. The lists also have a
`trial_type` column, containing the *design* label (`sat_only`, `conflict`,
`consistency`, `catch`). Two different things, same name.

The experiment writes the list's label as **`list_trial_type`**, next to
the list's **`pair_type`** (the type of the image pair). The lists are
never modified. When analysing, use `list_trial_type` / `pair_type`, and
ignore `trial_type` — it only tells you which plugin drew the screen.

---

## 4. Run a test session

Open, replacing the values with your own:

```
https://<username>.github.io/<repo-name>/?pid=Z_21121989&group=participant&slot=1
```

`Z_21121989` is the superuser ID. Every row it produces carries
`is_test = true`, so test sessions can always be filtered out. The `group`
and `slot` parameters are **required**: without either the study shows
"This link is incomplete" and does not start. Repeat with
`group=control`, and with a few slots (each slot gives a different episode
order, set mapping and list order — `assignment.json`).

The session runs in this order (both groups):

1. consent → 2. full screen and window check → 3. ID screen →
4. set-up screen and brightness → 5. gamma matching → 6. episode selection →
7. block 1 (reinstatement, 3 practice trials, 200 trials) → 8. 1-minute
rest → 9. block 2 (as block 1) → 10. word ratings → 11. CDS items →
12. save → 13. completion screen.

With `CONFIG.debug` on, the completion screen states whether the upload
succeeded and shows the raw DataPipe response.

Then confirm the file arrived on Zenodo (via the DataPipe experiment). The
DataPipe dashboard session counter should also increment.

For quick checks of one block, use `dev.html` instead (choose a group and
a slot first): every preset except "Upload test" saves locally. Its
"Shortened session" preset runs every step with each block cut to its
first 12 trials.

### If the upload fails

| Symptom | Cause |
|---|---|
| Completion screen says FAILURE | "Enable data collection" is off |
| No upload attempted | the page is not on `*.github.io` (`platform: 'auto'`), or `platform` is set to `'local'` |
| Console: `jsPsychPipe is not defined` | unpkg blocked or offline |
| File arrives but is empty | check the console for an error thrown before the save node |

### Testing without uploading

Serve the folder over HTTP on your computer (`python3 -m http.server 8000`,
then open `http://localhost:8000/?pid=Z_21121989&group=participant&slot=1`). With
`platform: 'auto'` this is `local`: the CSV downloads to your Downloads
folder and nothing is sent anywhere — except the separate contact file, if
you type a name or email (see `DATA_DICTIONARY.md` §15). Useful for checking
the output columns without adding junk to the data store. Or use
`dev.html` → "Full session (local)".

---

## 5. The stimulus package (frozen)

The v5c package is already committed and in use:

```
data/sets/v5c_180/   README.txt, design.json, assignment.json, lists/ (8 lists),
                     practice/ (block1, block2: 3 trials each), items.csv
                     (406 items), preload.json (617 images), manifest.csv,
                     stimuli/ (632 images: 617 shown + 15 only on catch rows,
                     42 scenes), and a CSV copy of every JSON
```

It was verified against the package's checksums when it was committed (661
files). The earlier package `data/sets/v5b_180/` is still there, unused; it
will be removed in a separate change, and is left untouched until then. **Never edit, add, remove, re-encode, resize or rename
anything in this folder.** The experiment reads it as it is; the validator
refuses to start if its counts or structure differ from `design.json`.
Read its `README.txt` for the design.

To re-check it (for example before launch, on the deployed commit):

```bash
node tools/check_package.js
```

This runs the same checks as the browser (`src/validate.js`: every list
against `design.json`, the catch targets, the practice settings and files,
`preload.json` against the images shown, the excluded scenes, the
assignment table, the texts in both languages, the settings `index.html`
would use) and also checks that every image the package names is on disk,
that every file in `stimuli/` matches its SHA-256 in `manifest.csv`, and
that `items.csv` holds every item. It prints the image count (v5c_180: 617
shown + 15 only on catch rows = 632, 42 scenes). `node tools/check_package.js
<set>` checks another package. The practice now comes only from the
package, so the older v5b_180, whose design.json has no
`practice_feedback_trials`, no longer passes; that is expected.
It prints `PASS` or `FAIL` and exits 1 on any error. The placeholder
warnings (consent, `[TO COMPLETE after pilot]`) remain until
the approved wording is pasted in.

**One caution.** Git keeps every version of every file permanently, and PNGs
do not delta-compress. That is one more reason never to touch the package
files: any change adds its full size to history permanently.

Do **not** use Git LFS. GitHub Pages does not serve LFS files — it serves the
pointer instead, so every image would fail to load while the site itself
deploys normally. That is a difficult failure to diagnose.

---

## 6. Participant links

Each participant gets their own link, carrying their ID, their group, a
**slot** and, for participants, the date of their interview:

```
https://<username>.github.io/<repo-name>/?pid=R_9rJJWk01c767jE8&group=participant&slot=1&idate=2026-11-03
https://<username>.github.io/<repo-name>/?pid=R_4EWNe48BIB50mVI&group=control&slot=1
```

| parameter | required | value |
|---|---|---|
| `pid` | recommended. Without it (and with `allow_manual_id` on) the participant must type a valid ID **or** give a name and email address | the participant ID, case-sensitive |
| `group` | **yes** | `participant` or `control`, exactly. Without it the study does not start |
| `slot` | **yes** | a whole number, 1 or more. Slot n uses row ((n − 1) mod 64) + 1 of the group's table in `data/sets/v5c_180/assignment.json`. **Hand slots out in sequence per group, starting at 1, and never reuse one.** Without a valid slot the study does not start |
| `idate` | no | the interview date, `YYYY-MM-DD`. Added by the researcher who schedules the interviews; never asked on screen. An invalid date is recorded empty |
| `lang` | no | `ja` for Japanese; English otherwise |

Join parameters with `&`. The query string never reaches the server. It
sits in the address bar and is read by JavaScript, which is why this works
on static hosting with no backend. `README.md` has a short Python function
that builds the links from a table.

Put the ID in the email body as well as the link:

> Here is your link: https://.../?pid=R_9rJJWk01c767jE8&group=participant&slot=1&idate=2026-11-03
>
> If the link does not work, please reply to this email.

A link without `group` or `slot` does not start, so any fallback link must
carry both (and its own, unused slot). A link with the group and slot but no
ID (`https://.../?group=participant&slot=5`) does start: the participant then types their ID, or — if they do not have
it — gives their name and email address instead (a unique `NOID_DRCHAIN26_…`
ID is generated, and the contact file is what links the session to them).
Giving all three is best, and the screen says so.

The IDs are **case-sensitive**. `R_4EWNe48BIB50mVI` and `R_4ewne48bib50mvi`
are different identifiers, and the experiment will reject the wrong case.
Before sending, open one participant link and one control link yourself and
check the episode screens show the right wording (controls must never see
the word "interview").

### Link codes

**The experiment does not use the codes yet.** A later change will make it
read them. Until then, links stay as described above.

Each link will carry one random code (`?code=…`) in place of `pid`, `group`,
`slot` and `idate`. Participants then cannot change their condition by
editing the link, and the link does not show their group.

`tools/make_link_codes.py` (Python 3.8+, standard library only) makes one
code per link. A link is a phase (`test`, `pilot`, `main`), a group and a
slot. Slots are numbered from 1 separately within each phase and group, and
slot n keeps its meaning (row ((n − 1) mod 64) + 1 of the group's table).
Test and pilot codes therefore reuse the first rows of the table, so that
testers see different counterbalancing orders.

Codes are 12 characters from `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (no 0, O, 1,
I or L), with no separators. They are drawn with Python's `secrets` module
and are all different. No code consists only of digits, or of digits with a
single E, because Excel and Numbers would turn such a code into a number.
Codes will be accepted case-insensitively.

#### What stays private and what is committed

| file | where | contents |
|---|---|---|
| `link_codes_private.csv` | `--private-dir`, **never committed** | `link_id, phase, group, slot, code, created_utc, pid, idate, tester, sent_date, notes` |
| `link_codes_manifest.txt` | `--private-dir`, never committed | counts per phase and group; the sha256 checksum of the public file |
| `backups/` | `--private-dir` | the three files as they were before each `--extend` |
| the public JSON | `--public-out`; committed **later**, when the experiment reads it | one encrypted entry per code. No codes, no participant IDs, no names, nothing about people |

- **Where the private folder may be:** the script refuses to put it inside
  this repository. `.gitignore` also lists both private file names, as a
  second safeguard. The folder is created readable only by you (700), and
  the table and manifest are 600.
- **`link_id`:** readable, with no code in it, for example
  `main_participant_017` or `test_control_003`.
- **Columns you fill in:** `pid`, `idate`, `tester` (the lab member a test
  code was given to), `sent_date` and `notes` start empty. The script never
  changes them. You may also add columns of your own; they are kept as they
  are.
- **Codes on screen:** codes are never printed unless you add `--show`. With
  `--show`, the script prints the codes made by that run (with `--verify`,
  all of them).

#### Commands

Run them from your clone of this repository. The paths are examples; use
the same two paths every time.

First run (8 test, 16 pilot and 64 main codes per group, 176 in all):

```bash
python3 tools/make_link_codes.py \
    --private-dir ~/dpdr_private/link_codes \
    --public-out  ~/dpdr_private/link_codes/codes_public.json
```

Other counts: add `--test N`, `--pilot N` and/or `--main N` (per group).

If the private table already exists, the script refuses to run. **Codes are
never made again or changed.** To add codes, use `--extend` with the number
of **additional** codes per group. A count you leave out adds none, and
slot numbers continue where they stopped:

```bash
# 4 more test codes per group (test slots 9 to 12)
python3 tools/make_link_codes.py \
    --private-dir ~/dpdr_private/link_codes \
    --public-out  ~/dpdr_private/link_codes/codes_public.json \
    --extend --test 4

# 20 more main slots per group (main slots 65 to 84)
python3 tools/make_link_codes.py \
    --private-dir ~/dpdr_private/link_codes \
    --public-out  ~/dpdr_private/link_codes/codes_public.json \
    --extend --main 20
```

What `--extend` does:

1. **Checks first.** It runs the same checks as `--verify`. If anything
   disagrees (for example, a row deleted in a spreadsheet), it changes
   nothing and says what is wrong.
2. **Keeps a copy.** The three files as they were go into
   `<private-dir>/backups/`.
3. **Adds the new rows** at the end of the table. Every existing row and
   every column you filled in stays as it was.
4. **Rewrites** the public file from the whole table, and updates the
   manifest.

Check, writing nothing:

```bash
python3 tools/make_link_codes.py \
    --private-dir ~/dpdr_private/link_codes \
    --public-out  ~/dpdr_private/link_codes/codes_public.json \
    --verify
```

It prints `PASS` or `FAIL` with a list of problems, and exits 1 on any
problem. It checks that:

- every private row's code is well formed and has an entry in the public
  file, which decrypts to the same `link_id`, phase, group and slot;
- no code or `link_id` appears twice;
- the slots run from 1 with no gaps;
- the public file has no extra entries;
- the public file is exactly what the table gives (it is rebuilt from the
  table and compared byte for byte);
- its sha256 matches the manifest.

Once the public file is in the repository, give that copy's path as
`--public-out` to check it.

#### Editing the table in Excel or Numbers

The table is UTF-8 with a byte order mark, so that Excel on the Mac shows
Japanese names correctly. You can fill in the empty columns and save:

- **Excel:** save as **CSV UTF-8 (Comma delimited)**. Plain "CSV" is not
  UTF-8 and is refused, with a message.
- **Numbers:** export to CSV with **Unicode (UTF-8)** encoding.

The table may come back with or without the byte order mark, with either
kind of line ending, and with empty rows at the end. A slot may be saved as
`17.0`. All of this is fine.

- **Codes:** they are read as text and cannot be turned into numbers.
- **`created_utc`:** it is written as `2026-11-24T05:06:07Z`. If a
  spreadsheet rewrites it in another form, `--verify` names the row; restore
  that cell from `backups/` or from an earlier copy.
- **Never edit** `link_id`, `phase`, `group`, `slot` or `code`, and never
  delete or reorder rows by hand. Sorting is harmless, though, since rows
  are matched by their code.

#### The public file and how an entry is encrypted

```
{
 "codes": { "<lookup key>": "<entry>", ... },
 "created_utc": "<the latest created_utc in the table>",
 "entry": "base64 of 160 bytes: ...",
 "format": "dpdr-link-codes-v1",
 "hash": "sha256 of the upper-case code, UTF-8, lower-case hex",
 "input": "remove surrounding spaces and upper-case the code before use ..."
}
```

Keys are sorted, with one space of indentation and a final newline, so the
same table always gives exactly the same file. Each entry can be read only
with its code. Without a code, the file shows only how many codes there
are: not their phases or groups, and not their link IDs.

All of the scheme uses only **SHA-256** and **HMAC-SHA256**, both in the
browser's Web Crypto API (`crypto.subtle.digest`, `sign` and `verify`). No
library is needed. With `C` the code's bytes:

| step | definition |
|---|---|
| code `C` | the typed code with surrounding spaces removed, upper-cased, as UTF-8 bytes (12 ASCII bytes) |
| lookup key `L` | `SHA-256(C)`, 32 bytes; its lower-case hex is the key in `codes` |
| encryption key `KE` | `HMAC-SHA256(key = C, message = "dpdr-link-codes-v1 encryption key")` (ASCII), 32 bytes |
| integrity key `KM` | `HMAC-SHA256(key = C, message = "dpdr-link-codes-v1 integrity key")` (ASCII), 32 bytes |
| plaintext `P` | 128 bytes: the JSON `{"group":…,"link_id":…,"phase":…,"slot":…}`, with keys sorted, no spaces and ASCII only, padded at the end with spaces (0x20) to 128 bytes, so every entry has the same size |
| keystream `S` | `HMAC-SHA256(KE, 0x00000000) ‖ HMAC-SHA256(KE, 0x00000001) ‖ HMAC-SHA256(KE, 0x00000002) ‖ HMAC-SHA256(KE, 0x00000003)`: a 4-byte big-endian counter, 128 bytes in all |
| ciphertext `X` | `P XOR S`, 128 bytes |
| tag `T` | `HMAC-SHA256(KM, "dpdr-link-codes-v1" ‖ 0x00 ‖ L ‖ X)`, 32 bytes (`L` as its 32 raw bytes) |
| entry | standard base64 (with `=` padding) of `X ‖ T`: 160 bytes, 216 characters |

**No nonce or IV.** Each code has its own keys, and each code encrypts
exactly one message, which never changes. Encryption is deterministic,
which is what makes the file reproducible.

**Decrypting.** Normalise the code and compute `L`, then look up `hex(L)`
in `codes`. If there is no entry, the code is unknown.

1. Base64-decode the entry. It must be exactly 160 bytes.
2. Split it into `X` (the first 128 bytes) and `T` (the last 32).
3. Recompute the tag from `KM`, `L` and `X`, and compare it with `T` in
   constant time (`crypto.subtle.verify`). **If they differ, reject the
   code:** never use an entry that fails this check.
4. Only then compute `P = X XOR S` and parse it as JSON (the trailing
   spaces are valid JSON whitespace).

The tag covers `L`, so an entry moved to another code's key fails too.
`tools/make_link_codes.py` also rejects a decrypted entry whose `link_id`
does not match its phase, group and slot.

A browser implementation, checked against the test vectors in Node's Web
Crypto and in Chromium:

```js
const subtle = crypto.subtle, enc = new TextEncoder();
const FORMAT = 'dpdr-link-codes-v1';
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const hmacKey = (raw, use) => subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, [use]);
const hmac = async (raw, msg) => new Uint8Array(await subtle.sign('HMAC', await hmacKey(raw, 'sign'), msg));

// The entry for a typed code, or null (unknown code, or the entry fails the
// integrity check). atob() throws on a malformed entry: treat that as null.
async function openLinkCode(input, publicFile) {
  const code = enc.encode(input.trim().toUpperCase());
  const lookup = new Uint8Array(await subtle.digest('SHA-256', code));
  const entry = publicFile.codes[hex(lookup)];
  if (!entry) return null;                                   // unknown code
  const raw = Uint8Array.from(atob(entry), (c) => c.charCodeAt(0));
  if (raw.length !== 160) return null;
  const ct = raw.slice(0, 128), tag = raw.slice(128);
  const encKey = await hmac(code, enc.encode(FORMAT + ' encryption key'));
  const macKey = await hmac(code, enc.encode(FORMAT + ' integrity key'));
  const signed = new Uint8Array([...enc.encode(FORMAT), 0, ...lookup, ...ct]);
  if (!(await subtle.verify('HMAC', await hmacKey(macKey, 'verify'), tag, signed))) return null;
  const pt = new Uint8Array(128);
  for (let i = 0; i < 4; i++) {
    const ks = await hmac(encKey, new Uint8Array([0, 0, 0, i]));
    for (let j = 0; j < 32; j++) pt[32 * i + j] = ct[32 * i + j] ^ ks[j];
  }
  return JSON.parse(new TextDecoder('ascii').decode(pt));   // {group, link_id, phase, slot}
}
```

`crypto.subtle` exists only on secure pages: https, which covers GitHub
Pages and Pavlovia, or `localhost`.

**Test vectors:** `tools/link_codes_test_vectors.json`. Its codes
(`TESTVECTRA23`, `TESTVECTRB45`, `TESTVECTRC67`, `TESTVECTRD89`) are
reserved: the script never generates them, so they are in no real table.
Two of the inputs are lower case or have surrounding spaces, to test the
normalisation.

- **Each vector:** the input, the normalised code, `L`, `KE`, `KM`, `P`,
  `X`, `T`, the entry, and the decrypted object.
- **`must_fail`:** five entries that must be rejected. They are a flipped
  ciphertext bit, a flipped tag bit, another code's entry, a code differing
  in one character, and an entry cut short.

To regenerate the vectors, run
`python3 tools/make_link_codes.py --make-test-vectors tools/link_codes_test_vectors.json`.
The self-test checks that the file matches the script.

**A note on strength.** A 12-character code has about 59 bits of
randomness. Someone with the public file could, in principle, test
guessed codes against it offline. Finding any valid code among a few
hundred would take days of dedicated GPU time, far beyond what anyone
would spend to change condition.

#### Self-test

```bash
python3 tools/test_make_link_codes.py
```

It runs everything in a temporary folder outside the repository and prints
`OK` at the end:

- **Your runs:** first run, refusal to overwrite, and `--extend` with
  hand-typed columns (including Japanese text, line breaks, commas and an
  extra column) kept as they were.
- **Spreadsheet files:** tables saved with and without a byte order mark,
  and as a spreadsheet saves them.
- **`--verify`:** passing, and failing after a dozen deliberate edits.
- **The scheme:** the test vectors.
- **Safety:** the refusal inside the repository.

---

## 7. Pavlovia

The same files run on GitHub Pages and on Pavlovia. With `platform: 'auto'`
(the default in `config.js`) the experiment sees where it is served from
and saves accordingly:

| Served from | `platform` | Responses saved to | Name and email (if given) |
|---|---|---|---|
| `*.github.io` | `github` | DataPipe → Zenodo | separate file, separate DataPipe experiment → Zenodo, straight away |
| `run.pavlovia.org` | `pavlovia` | the Pavlovia project's `data/` folder | in the response file (`contact_name`, `contact_email`), at the end |
| your computer | `local` | downloaded CSV | separate DataPipe file, as on GitHub |

The name/email rule is `participant.contact_storage: 'auto'`. On Pavlovia
the consent and ID screens use their `*_results_file` wording, which says
the name and email are stored with the responses (see
`text/*/instructions.js`; replace `consent.body_results_file` with the
approved wording too). Nothing is sent to DataPipe from Pavlovia.

Libraries: `libraries: 'bundled'` (default) loads our copy of jsPsych
7.1.2, its plugins and jQuery 2.2.0 from `vendor/` — byte-identical to the
official releases. `libraries: 'pavlovia'` loads the copy Pavlovia serves
itself under `lib/vendors/` instead, as in the earlier Pavlovia experiment;
it exists only on Pavlovia (anywhere else `vendor/` is used). The Pavlovia
plugin `jspsych-7-pavlovia-2021.12.js` is always our copy, in the top
folder. Every row records `platform`, `libraries` and `contact_storage`.

### Two folders, never mixed

Pavlovia stores each result file **as a commit in the project's GitLab
repository** (`data/` folder). The GitHub repository is public. So:

- **Folder A** — this GitHub repository. You edit and commit here.
- **Folder B** — a separate clone of the Pavlovia project. You never edit
  it by hand, never add GitHub as a remote, and never copy anything from
  it back into A. Results stay in B (and on Pavlovia).

`tools/sync_to_pavlovia.sh` copies a committed version of A into B.

### First time

1. On pavlovia.org: **Dashboard → Experiments → New** (or create the
   project on gitlab.pavlovia.org). Set its visibility to **Private**.
   Its default branch is `master`.
2. Clone it next to (not inside) folder A. Pavlovia's GitLab asks for your
   Pavlovia user name and password (or an access token):

   ```bash
   mkdir -p ~/pavlovia && cd ~/pavlovia
   git clone https://gitlab.pavlovia.org/<user>/<project>.git
   ```

3. From folder A, copy the committed experiment across, then commit and
   push in folder B (the script prints the two commands):

   ```bash
   cd ~/<path-to>/dpdr_experiment            # folder A
   tools/sync_to_pavlovia.sh ~/pavlovia/<project>
   cd ~/pavlovia/<project>
   git commit -m "Deploy <commit>"
   git push
   ```

   The sync copies every package committed in `data/sets/`: v5c_180 (in
   use) and, until it is removed here, v5b_180. A first push after this
   change adds ~230 MB (the v5c images). If it fails part-way, run
   `git config http.postBuffer 524288000` in folder B and push again. A
   Pavlovia project that held the v4 experiment loses `data/sets/v4/` in
   this sync (it no longer exists here); the results in `data/` are kept.

4. On the Pavlovia experiment page: keep the saving format **CSV** (if
   the page offers a choice), leave **Save incomplete results OFF** (an
   abandoned session must leave nothing behind — the consent text says
   so), and assign credits or a licence. Pavlovia opens `index.html`.

### Piloting, then Running

- **Piloting**: open the experiment with the **Pilot** button. Each pilot
  run counts as a session, but the CSV is **downloaded to your computer**,
  not stored on Pavlovia. With `debug: true` the last screen says
  "PILOTING — file downloaded to this computer".
- **Running**: results go to the project's `data/` folder, one file per
  session, named

  ```
  <project>_<participant_id>_v5c_180_<Japan-time stamp>_SESSION_<date>.csv
  ```

  The middle part is the same as the GitHub file name
  (`<participant_id>_v5c_180_<Japan-time stamp>`). Download them from the
  experiment page (**Download results**) or with `git pull` in folder B.

The Pavlovia session is opened only after the consent screen and the window
check, so a participant who declines or whose window is too small never
opens one (and never sees the browser's "leave this page?" warning).

### Links

```
https://run.pavlovia.org/<user>/<project>/?pid=R_xxxxxxxxxxxxxxx&group=participant&slot=1&idate=2026-11-03
https://run.pavlovia.org/<user>/<project>/?pid=R_xxxxxxxxxxxxxxx&group=control&slot=1
```

The same parameters as on GitHub (§6). `dev.html` works there too:
`https://run.pavlovia.org/<user>/<project>/dev.html?group=participant&slot=1`; its
"Upload test" saves to Pavlovia.

### Updating

Commit in folder A, then run `tools/sync_to_pavlovia.sh` and push from B
again. The script pulls B first (Pavlovia's result commits), never touches
`data/*.csv`, `config.json` or `lib/`, and writes `DEPLOYED_COMMIT.txt`
— the commit that is live — for the launch checklist. To deploy another
branch: `tools/sync_to_pavlovia.sh ~/pavlovia/<project> v5c-switch`.

### If saving fails on Pavlovia

| Symptom (debug box on the last screen) | Cause |
|---|---|
| Pavlovia session: NOT opened | experiment not activated (no `config.json`), set to Inactive, or no credits/licence |
| Saving to Pavlovia FAILED | as above, or the network dropped at the end; the participant gets the download-and-email screen |
| PILOTING — file downloaded | you used the Pilot button, or the experiment is not Running |
| Page blank, console `initJsPsych is not defined` | `libraries: 'pavlovia'` but Pavlovia did not serve `lib/vendors/`; use `'bundled'` |

---

## 8. Checklist before recruiting

The launch checklist is in `README.md` ("Launch checklist — do not recruit
unless every item passes"). It is a list of hard gates: do not send a single
invitation while any item fails. In addition, for deployment:

- [ ] A test session per group with `Z_21121989` arrives on Zenodo through
      the (new, v5c) DataPipe experiment
- [ ] All images load (no grey boxes, no console 404s; `failed_images` is
      `[]` on both `preload` rows)
- [ ] Participant links generated with the correct IDs, groups, slots (in
      sequence per group, none reused) and interview dates
- [ ] A full session run start to finish on a small laptop screen (and the
      window check tried on a window that is too small: it must stop)
