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
4. brightness → 5. gamma matching → 6. episode selection →
7. block 1 (reinstatement, 3 practice trials, 200 trials) → 8. 1-minute
rest → 9. block 2 (as block 1) → 10. word ratings → 11. state items →
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
warnings (consent, state items, `[TO COMPLETE after pilot]`) remain until
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
