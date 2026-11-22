# Output data: what a full session saves

What a session CSV from the derealization experiment contains, in the order
the participant produces it, and how to get from the raw file to an
analysable table.

Experiment: two-alternative forced choice between two edits of the same
photograph (local contrast and/or colour saturation), in **two blocks**
about two different episodes, plus episode questions, word ratings and
state items. Stimulus package **v5c_180** (frozen; v5b_180 before it). On GitHub
Pages uploaded via DataPipe (experiment `VoYGtg5yKGr2`, a **test**
experiment until data collection — see README.md) to Zenodo
(`[Zenodo record — to complete]`); on Pavlovia stored in the private
Pavlovia project's `data/` folder.

---

## 1. One file per session

Each completed session uploads one CSV, named:

```
<participant_id>_<stimulus_set>_<session start, Japan time>.csv
e.g. R_9rJJWk01c767jE8_v5c_180_2026-11-30T14-10-40.csv
```

The stamp is the **start of the session** (when the consent screen
appeared) in **Japan time** (UTC+9, whatever time zone the participant's
computer uses), written `YYYY-MM-DDTHH-MM-SS`. It is **the same stamp as in
that session's contact file** (`contact_<participant_id>_<stamp>.csv`, §15),
and in the file a participant downloads if the upload fails, so the files
of one session can be matched by name. It equals `session_start_time`
(which is in UTC) plus 9 hours.

Times **inside** the file are UTC (ISO 8601, ending in `Z`).

**On Pavlovia** (`platform = pavlovia`) the file is stored in the Pavlovia
project's `data/` folder, and Pavlovia adds the project name in front and
its own date at the end:

```
<project>_<participant_id>_v5c_180_<session start, Japan time>_SESSION_<date>.csv
```

The middle part is the GitHub file name without `.csv`. Pavlovia's date at
the end is the time of saving on the participant's computer clock — use the
stamp in the middle (or `session_start_time`), not that. A pilot run
(Pavlovia's **Pilot** button) is not stored on Pavlovia: the same file is
downloaded to the computer that ran it.

A full session produces **1253 rows** (1254 on Pavlovia, one or two more
if ID entry needed a retry) and about **170 columns** (174 for participants,
168 for controls). The columns differ slightly between the
groups: the episode answers are `ep_derealization_*` and `ep_ordinary_*`
for participants, `ep_ordinary_*` only for controls (§6).

**Nothing is saved until the very end.** The upload happens after the last
screen. A participant who closes the tab before then leaves no file. Two
early exits also leave no file, by design:

- **"I do not agree"** on the consent screen ends the session at once;
- the **window check** stops a session whose full-screen window cannot show
  the trial layout whole. It runs before the ID screen, so not even a
  name or email has been uploaded.

A link without a valid `?group=` or `?slot=` never starts (an
"incomplete link" screen), so it leaves no file either.

If the upload itself fails (network problem, "Enable data collection"
switched off on DataPipe, or Pavlovia not Running / out of credits), the
final screen offers the participant a button to download the CSV and email
it to you, so that session is not lost.

Name and email, if given, are **not** in this file on GitHub Pages
(`contact_storage = datapipe`). They go to a separate file in a separate
DataPipe experiment, uploaded as soon as they are entered — see §15. **On
Pavlovia** (`contact_storage = results_file`) they **are** in this file, as
`contact_name` and `contact_email` on the `participant_id` row only, and
there is no separate file; the file stays in the private Pavlovia project.
Remove those two columns before sharing Pavlovia data.

**`null` in the file.** jsPsych writes a missing value as the literal text
`null`. `pandas.read_csv` treats it as missing by default; other tools may
not.

---

## 2. The single most important thing

**One row is one SCREEN, not one experimental trial.**

jsPsych writes a row for every screen it shows: fixations, blanks,
instructions, calibration, breaks, the image download steps. Only 406 of
the rows are image-pair trials (2 × (3 practice + 200 main)), and **360**
of those (180 per block) are analysed.

Always filter first:

```python
import pandas as pd
d = pd.read_csv(path)
trials   = d[d.block == 'pairs']                         # 406 rows
main     = trials[trials.phase == 'main']                # 400 rows (200 per block)
analysed = main[main.analysed == True]                   # 360 rows (180 per block)
```

Never analyse the raw file without filtering. Averaging `rt` across all
rows, for example, mixes in fixation crosses and instruction pages.

---

## 3. What happens in a session, and what each step writes

The session order is **the same for both groups**. What differs is which
two episodes the blocks are about (`group`, and `b1_episode` /
`b2_episode`, §5). Steps are listed in the order the participant sees
them. The `block` column is how you find each step's rows; rows of a block
of trials also carry `block_position` (1 or 2).

| # | step | `block` | rows | what it saves |
|---|---|---|---|---|
| — | session stamps | *(empty)* | 1 | experiment, `group`, `slot`, the assignment row, `interview_date`, display (§5) |
| 1 | Consent | `consent` | 1 | `consent_given` (also stamped on every row). Declining ends the session; no file |
| 2 | Full screen | `fullscreen` | 1 | — |
| 3 | Window check | `window_check` | 1 | `viewport_*_fs`, `viewport_ok`, `images_fit` (session-level). A window that is too small stops the session here (`screen_stop`, never saved) |
| — | Pavlovia session opened | `pavlovia_init` | 1 | **Pavlovia only.** Nothing recorded |
| 4 | Size check | `size_check` | 0 | **developer screen, off for participants** (dev preset only) |
| 5 | Participant details (ID + optional name and email) | `participant_id` | 1 | the ID, how it arrived, and **whether** a name / email was given (§5); on Pavlovia also `contact_name`, `contact_email` |
| — | ID stamp, background download start | *(empty)* | 2 | — |
| 6 | Brightness (+ viewing-conditions note) | `calibration_brightness` | 1 | `brightness_confirmed` (session-level) |
| 7 | Gamma match | *(empty)* | 3 | `gamma_*` (session-level, §5) |
| 8 | Episode selection | `episode` | 2 | one row per screen, with `episode`; the answers as `ep_*` columns on every row (§6) |
| 9 | **Block 1** | `preload`, `block_start`, `reinstate`, `practice_intro`, `pairs`, `fixation`, `practice_feedback`, `blank`, `practice_end`, `catch_lockout`, `break`, `block_end` | 617 | **the data** (§7). 3 practice + 200 main `pairs` rows |
| 10 | Rest | `rest` | 1 | `rest_ms`, `rest_extra_ms`; `rest_start`, `rest_end` session-level |
| 11 | **Block 2** | as block 1 | 617 | as block 1 |
| 12 | Word ratings | `word_instructions`, `word_ratings` | 1 + 1 | the ten ratings (§9); `rating_foggy`, `rating_faded` session-level |
| 13 | State items | `state` | 1 | `state_q02` … `state_q29` (§10) |
| 14 | Save | *(empty)* | 2 | end-of-session stamps (§5); the upload or download step |

Within a block, in order:

| `block` | rows | what it is |
|---|---|---|
| `preload` | 0–1 | waits for any of the block's images that the background download has not fetched yet (`success`, `failed_images`) |
| `block_start` | 1 | stamps `block<p>_start` |
| `reinstate` | 1 | names the block's episode and shows the participant's own words (§6) |
| `practice_intro` | 1 | the task (block 1); before block 2, that the question has changed and the new question |
| `pairs` + `fixation` + `practice_feedback` + `blank` | 3 × 4 | the 3 practice trials, each followed by its feedback screen (the chosen image outlined) |
| `practice_end` | 1 | |
| `pairs`, `fixation`, `blank`, `catch_lockout` | 200 + 195 + 195 + 5 | the 200 main trials, in the list's order. Catch trials have no fixation or blank: a `catch_lockout` row (750 ms, keys disabled), then the `pairs` row with the response |
| `break` | 4 | after main trials 40, 80, 120 and 160 of the block (design.json `timing.breaks_after_trial`) |
| `block_end` | 1 | stamps `block<p>_end` and `catch_fail_b<p>` |

Each step has its own switch in `config.js` (`CONFIG.blocks`,
`CONFIG.calibration`). A step switched off writes no rows.

Rows with an empty `block` are internal steps: recording session
properties, starting the background image download, and the gamma screens.
Everything they measure is copied into the session-level columns, so you
never need those rows directly.

---

## 4. Three columns about the trial type

| column | written by | contains |
|---|---|---|
| `trial_type` | jsPsych, automatically | the **plugin** name: `html-keyboard-response`, `call-function`, `fullscreen`, … jsPsych overwrites any other value, so the list's own `trial_type` cannot be stored under this name |
| `list_trial_type` | this experiment | the list's `trial_type`: `sat_only`, `fog_only`, `together`, `conflict`, `consistency`, `catch`, or `practice` |
| `pair_type` | this experiment | the list's `pair_type`: the type of the **image pair** (`sat_only`, `fog_only`, `together`, `conflict`). It equals `list_trial_type` on analysed rows; on a consistency row it is the type of the repeated pair, on a catch row the type of the (unshown) pair, on a practice row the practice pair's type |

`trial_type` exists because DataPipe's validation requires it. It tells you
nothing about the design. **Use `list_trial_type` to select trials, and
`pair_type` for the pair.** (In the v4 files, `pair_type` held what is now
`list_trial_type`.)

---

## 5. Session-level columns

These repeat identically on every row, so read them from any row with
`.iloc[0]`.

### Identity, link and exclusion flags

| column | example | notes |
|---|---|---|
| `participant_id` | `R_9rJJWk01c767jE8` | links to the CDS-29 record. Case-sensitive. **`NOID_DRCHAIN26_…`** (prefix + 8 random characters) when the participant gave a name and email but no ID — see below |
| `group` | `participant` / `control` | from `?group=` in the link. A link without a valid group does not start, so this is never empty in a saved file |
| `slot` | `37` | from `?slot=` in the link: a whole number, 1 or more. A link without a valid slot does not start |
| `interview_date` | `2026-11-03` | from `?idate=YYYY-MM-DD` in the link. **Empty** if the link had none, or an invalid date |
| `consent_given` | `True` | always `True` in a saved file (declining saves nothing). Empty only for dev sessions run with the consent screen off |
| `is_test` | `False` | `True` when a test ID was used: `Z_21121989` (yours) or `CHAIN_2026` (colleagues) |
| `is_dev` | `False` | `True` when the session started from `dev.html`, or was shortened |
| `shortened` | `False` | `True` when a dev run cut each block to its first `shortened_to` trials (`CONFIG.limits`, dev.html only). Such a session is never valid data |
| `shortened_to`, `shortened_practice_to` | empty | the limits of a shortened run; empty otherwise |
| `positions_run` | `1,2` | which block positions ran. Always `1,2` outside dev.html |
| `id_source` | `url` / `typed` / `no_id` | on the `participant_id` row only. `url` = came from the link unchanged; `no_id` = no ID given, name and email instead |
| `id_entered`, `id_valid` | | on the `participant_id` row only |
| `contact_name_given`, `contact_email_given` | `True` / `False` | whether the participant filled in the optional field |
| `contact_saved` | `True` / `False` / empty | whether DataPipe received the separate contact file. Empty if nothing was given, and always empty on Pavlovia (no separate file) |
| `contact_name`, `contact_email` | as typed | **Pavlovia only** (`contact_storage = results_file`), on the `participant_id` row only; empty if not given. Absent from GitHub files |

**Exclude any session where `is_test`, `is_dev` or `shortened` is `True`.**

**Sessions without an ID.** When the link carried no valid ID, the
participant had to give either an ID or both a name and an email address.
Those who gave only a name and email have `participant_id` =
`NOID_DRCHAIN26_` + 8 random characters (unique per session) and
`id_source = no_id`. They are real sessions (`is_test = False`). The same
`participant_id` is in the contact file (§15), which is the **only** way
to tell who they are — so check `contact_saved` on these sessions. On
Pavlovia the name and email are in the same file instead (`contact_name`,
`contact_email`). To find them: `d.participant_id.str.startswith('NOID_')`.

### The assignment

Slot n uses row ((n − 1) mod 64) + 1 of the group's table in the
package's `assignment.json`: slots 1–64 use rows 1–64, slot 65 row 1,
slot 130 row 2, and so on.

| column | example | meaning |
|---|---|---|
| `assignment_row` | `37` | the row of the group's table used (1–64) |
| `assign_block_order` | `0` / `1` | 0 = the group's first-listed episode first (participants: derealization; controls: ordinary), 1 = second-listed first |
| `assign_set_mapping` | `0` / `1` | 0 = set A with the group's first-listed episode, 1 = set B with it |
| `assign_order` | `1`–`4` | the order index, the same in both blocks |
| `b1_episode`, `b2_episode` | `derealization` | the episode of block position 1 / 2: `derealization`, `ordinary` or `expectation` |
| `b1_set`, `b2_set` | `A` / `B` | the item set of each block |
| `b1_list`, `b2_list` | `A_o4` | the list file (`lists/<list>.json`) |
| `b1_practice`, `b2_practice` | `practice/block1.json` | the practice file; it follows the block position, not the episode |
| `practice_trials_b1`, `practice_trials_b2` | `3`, `3` | practice trials run before each block, from the package's design.json (`practice_by_block`) |
| `practice_feedback_b1`, `practice_feedback_b2` | `True`, `True` | whether those practice trials had feedback, from design.json (`practice_feedback_by_block_position`; `practice_feedback_trials` = 3 of them) |
| `stimulus_set` | `v5c_180` | the package |
| `design_version` | `v5c` | `design.json`'s version |

### Block, rest and catch summary

| column | meaning |
|---|---|
| `block1_start`, `block2_start` | UTC. The block began: after its image-download gate, as its reinstatement screen appeared |
| `block1_end`, `block2_end` | UTC. After the answer to the block's last main trial |
| `rest_start`, `rest_end` | UTC. The rest screen appeared / Continue was pressed. At least 60 s apart |
| `catch_fail_b1`, `catch_fail_b2` | catch trials of that block answered with a key other than the target, 0–5. Empty if the block did not run |
| `catch_fail_total` | the sum. **Exclusion rule (applied in the analysis): 3 or more** (design.json `catch.exclude_at_or_above`, over the session) |

### Experiment

| column | example |
|---|---|
| `experiment_name` | `derealization_v5c` |
| `experiment_version` | `1.0.0-v5c` |
| `platform` | `github` / `pavlovia` / `local` — where the session actually ran (with `platform: 'auto'`, worked out from the address) |
| `contact_storage` | `datapipe` (separate contact file, §15) / `results_file` (name and email in this file, Pavlovia) |
| `libraries` | `bundled` (our `vendor/` copy of jsPsych 7.1.2 + jQuery 2.2.0) / `pavlovia` (Pavlovia's own `lib/vendors/` copy) |
| `language` | `en` / `ja` |
| `session_start_time` | UTC, ISO 8601. When the consent screen appeared. The file names carry this moment in Japan time |
| `session_end_time` | UTC. When the save step started (after the last screen, before the upload) |
| `session_duration_s` | whole seconds from `session_start_time` to `session_end_time` |
| `task_start_time` | UTC. Onset of the first image trial (block 1's first practice trial) |
| `task_end_time` | UTC. When the last trial of block 2 was answered |
| `task_duration_s` | whole seconds from `task_start_time` to `task_end_time`: both blocks with their practice, breaks, the reinstatement screens and the rest |

### Display

| column | meaning |
|---|---|
| `screen_width`, `screen_height` | the physical screen, in device pixels |
| `viewport_width`, `viewport_height` | usable area **before** full screen |
| `viewport_width_fs`, `viewport_height_fs` | usable area **in** full screen — the one that matters |
| `viewport_width_end`, `viewport_height_end` | usable area at the end. Differs from `_fs` if they left full screen |
| `device_pixel_ratio` | 1 on a standard display, 2 on Retina/HiDPI |
| `viewport_ok` | whether the full-screen area met the *recommended* minimum (1120 × 680) |
| `images_fit` | whether the real trial layout (each of the session's two questions + two 512 px images) fitted the window whole. Always `True` in a saved file: a window where it did not fit was stopped |
| `allow_scaling` | `False`: images were a fixed 512 px for everyone |
| `user_agent` | browser and operating system |

### Calibration

| column | meaning |
|---|---|
| `brightness_confirmed` | ticked "brightness at maximum". Always `True` for a completed session |
| `gamma_estimate` | **the one to use**: the median of the three matches |
| `gamma_estimate_1` … `_3` | the estimate from each match |
| `gamma_grey_match_1` … `_3` | the grey level (0–255) chosen in each match |
| `gamma_density_1` … `_3` | checkerboard density. Always `0.5` |
| `gamma_arrangement_used` | `split_field` or `centre_surround` |

### Target word ratings

| column | meaning |
|---|---|
| `rating_foggy` | 0–6 rating of *foggy* (= `word_foggy`) |
| `rating_faded` | 0–6 rating of *faded* (= `word_faded`) |

Copied to every row (including the trial rows recorded before the
ratings), so a participant can be modelled without joining in another table.

---

## 6. The episodes

### Episode selection (`block == 'episode'`)

After calibration, before block 1: one screen per episode of the group, in
the order design.json lists them (not the block order).

| group | screen 1 | screen 2 |
|---|---|---|
| participant | `derealization`: the episode they described in the interview | `ordinary`: one in a similar setting (similar place, time of day and lighting), from about as long ago, in which the surroundings looked as usual. Their own words for the derealization episode are shown as a reference |
| control | `ordinary`: an episode from the last six months | `expectation`: the short description of derealization; no questions |

Each **recalled** episode (not the expectation) asks for a few identifying
words and five questions that only help bring it back. **Every question
must be answered; "Prefer not to say" is an answer**, so nobody skips one
by accident and nobody is forced to disclose. There is no default answer:
Continue stays disabled until all are answered. Nothing is asked about
clarity, vividness or colour.

The answers are stamped on **every row** as `ep_<episode>_<question>`
(e.g. `ep_derealization_words`, `ep_ordinary_tone`), and also on that
screen's own row.

| column | question on screen | values |
|---|---|---|
| `ep_<episode>_words` | A few words to identify this episode (hint: *e.g. walking home after work*) | the typed text, trimmed. Required; never `prefer_not` |
| `ep_<episode>_when` | When was it? (hint: *e.g. last week, about two months ago*) | the typed text, or `prefer_not` |
| `ep_<episode>_duration` | How long did it last? (hint: *e.g. a few seconds, about an hour*) | the typed text, or `prefer_not` |
| `ep_<episode>_where` | Where were you? (hint: *e.g. at home, on a train, in a shop*) | the typed text, or `prefer_not` |
| `ep_<episode>_tone` | How did it feel emotionally? | `-3` (very unpleasant) … `3` (very pleasant), or `prefer_not` |
| `ep_<episode>_intensity` | How emotionally intense was it? | `0` (not at all intense) … `6` (extremely intense), or `prefer_not` |

Participants have `ep_derealization_*` and `ep_ordinary_*`; controls have
`ep_ordinary_*` only. Because `prefer_not` can stand in a numeric column,
convert with `pd.to_numeric(..., errors='coerce')` after counting the
`prefer_not` answers.

The free-text answers (up to 200 characters) are in the participant's own
words and language, so they need coding before analysis. They are stored
**with the responses**; the consent text asks participants not to include
names or other identifying details, but check them before any data are
shared.

The v4 columns `episode_when`, `episode_duration`, `episode_where` and
`episode_clarity` no longer exist.

### Reinstatement (`block == 'reinstate'`)

The first screen of each block (`block_position` 1 or 2, with `episode`):
it names the block's episode and shows the participant's own identifying
words; the expectation block repeats the description of derealization.
Nothing is recorded but the row.

---

## 7. The image-pair trials (`block == 'pairs'`)

406 rows: per block, 3 practice + 200 main, each block in the frozen order
of its list (`b<p>_list`), with the sides the list gives.

| `list_trial_type` | per block | analysed | what differs between the two images |
|---|---|---|---|
| `practice` | 3 | no | — (`phase == 'practice'`) |
| `sat_only` | 54 | **yes** | colour saturation only |
| `fog_only` | 54 | **yes** | local contrast ("fog") only |
| `together` | 36 | **yes** | both, in the same direction |
| `conflict` | 36 | **yes** | both, in opposite directions |
| `consistency` | 15 | no | an earlier pair of the same block repeated, sides swapped (5 sat_only, 4 fog_only, 3 together, 3 conflict) |
| `catch` | 5 | no | no images; an attention check |

The question above the images depends on the block's **episode**:

| `episode` | question |
|---|---|
| `derealization` | Which looks more like how your surroundings looked during that episode? |
| `ordinary` | Which looks more like how your surroundings looked during the ordinary episode you described? |
| `expectation` | Which looks more like how you think the surroundings look to someone experiencing derealization? |

### Identifying the trial

| column | meaning |
|---|---|
| `block_position` | `1` or `2` |
| `episode` | the block's episode |
| `phase` | `practice` or `main` |
| `block_trial` | the trial number **within the block**: the list's `trial` (1–200), or the practice file's (1–3) |
| `item_id` | **essential**: the item, e.g. `A016`, `Ac13` (consistency), `Ax02` (catch), `P1_01` (practice). **Join to the package's `items.csv` on `item_id`** for every image-level and edit parameter |
| `list_id`, `set`, `order` | the list (`A_o4`), its item set (`A` / `B`, `practice`) and order index |
| `list_trial_type`, `pair_type` | see §4 |
| `analysed` | `True` for the 180 analysed trials of each block |
| `scene_id`, `category` | e.g. `waiting_room_00002953`, `waiting_room`. Both images are always the same scene |

`slot`, `group` and `assignment_row` are session-level, so they are on
every trial row too.

### The stimuli

| column | meaning |
|---|---|
| `left_path`, `right_path` | image files, e.g. `stimuli/dining_hall_00001273__cp2__sp3.png`. On catch rows these are the list's paths, **not shown** |
| `a_is_left` | **essential**: whether image A appeared on the left (fixed by the list; part of the side balance and the side term in the analysis) |
| `file_a`, `file_b` | which file is A and which is B |
| `images_shown` | `False` on catch rows (`catch_mode = no_images`), `True` otherwise |
| `couple` | the list's `couple` column, copied |

### The predictors and normality terms

Copied unchanged from the list into every row. See the package's
`README.txt` for their definitions; `items.csv` has every other column.

| column | meaning |
|---|---|
| `pred_sat`, `pred_fog` | **the predictors**, `pred_sat = -d_sat / 39.182`, `pred_fog = d_fog / 9.348`, always A minus B. **Positive = image A is the predicted choice** |
| `d_sat`, `d_fog` | raw signed differences, A − B (for reference) |
| `z_sat`, `z_fog` | the pair's differences in SD units (for reference) |
| `mag_bin` | magnitude bin |
| `N_corpus`, `N_orig` | normality terms, dist(B) − dist(A); positive = A is the more typical |
| `includes_original` | whether one image is the unedited photograph |
| `catch_mode` | `no_images` on catch rows, empty elsewhere |
| `repeat_of` | consistency rows only: the **block-local** trial number (`block_trial`) of the original |
| `repeat_of_item` | consistency rows only: the original's `item_id` |

### The response

| column | meaning |
|---|---|
| `response` | the key as jsPsych recorded it, **lowercased**: `arrowleft`, `arrowright` |
| `response_key` | the same value, stored separately |
| `response_side` | `left` or `right` (catch rows: the side if ← or → was pressed, else empty) |
| `chosen` | **`A` or `B`**: the image chosen, from `response_side` and `a_is_left`. Empty on catch rows |
| `rt` | **ms** from image onset to keypress (catch rows: from the end of the 750 ms lockout). No time limit and no minimum response time: responses under 300 ms are part of the attention check, applied in the analysis |
| `no_response` | should always be `False`. If `True`, key handling failed and the row needs checking |
| `practice_feedback` | `True` on practice rows followed by a feedback screen |

### Display verification

| column | meaning |
|---|---|
| `display_px` | configured image size (512) |
| `panel_rendered_px` | measured on-screen size, e.g. `512x512`. Should match |

### Catch trials

| column | meaning |
|---|---|
| `is_catch` | `True` on the 5 catch rows of each block |
| `catch_target` | `ArrowUp` or `ArrowDown`: the k-th catch row of a block gets target k of design.json `catch.targets_by_block_position[<block_position>]`, **restarting at the first target in each block** |
| `catch_correct` | whether the single keypress matched the target. Empty on other rows |
| `catch_pressed_side` | `True` if ← or → was pressed instead |

Pressing ← or → means they answered as if it were an image trial, without
reading. Pressing some other key suggests they weren't paying attention at
all.

### Consistency trials

The repeat shows the **same pair with the sides swapped**. Use `chosen`
(A/B), not `response_side`, to compare it with the original.

---

## 8. (Removed) The grid blocks

The v4 episode grid, normal-appearance grid and "None of these" follow-up
are gone, with their columns (`set_code`, `scene_set`, `screen`,
`chosen_level_index`, `chose_none`, `none_detail`, `cell_px`, …). Neither
the v5b nor the v5c package has a grid.

---

## 9. The word ratings (`block == 'word_ratings'`)

One row, holding all ten ratings, 0 = not at all … 6 = exactly. Taken
once, after block 2. Participants rate the **derealization** episode (the
screen names "the episode you described in the interview" and shows their
own words), whichever block came last; controls rate how the surroundings
might look to someone experiencing derealization.

| column | meaning |
|---|---|
| `word_foggy`, `word_faded` | **the two targets**, 0–6 (also session-level as `rating_foggy`, `rating_faded`) |
| `word_veiled`, `word_lifeless`, `word_unreal`, `word_dreamlike`, `word_distant`, `word_like_a_picture`, `word_oppressive`, `word_threatening` | the other eight, 0–6 |
| `word_order` | the order the words appeared on screen (shuffled per participant) |
| `word_range` | highest rating minus lowest |
| `word_mean` | mean of all ten |
| `rt` | ms from the grid appearing to pressing Continue |

A `word_range` of 0 or 1 (every word rated the same) suggests the
participant was not discriminating between the words.

The `word_instructions` row before it is the instruction screen. It holds
no responses.

---

## 10. The state items (`block == 'state'`)

One row, at the end of the session. "Right now, at this moment:" followed
by four items from a published questionnaire (items 2, 13, 19 and 29),
fixed order, each 0 = not at all … 6 = completely; all four must be
answered.

| column | meaning |
|---|---|
| `state_q02`, `state_q13`, `state_q19`, `state_q29` | 0–6 |
| `rt` | ms from the screen appearing to pressing Continue |

---

## 11. Getting to an analysable table

```python
import pandas as pd, numpy as np

d = pd.read_csv(path)

# Exclude test, dev and shortened sessions
s = d.iloc[0]
if s.is_test or s.get('is_dev', False) or s.get('shortened', False):
    raise ValueError('test or dev session')

items = pd.read_csv('data/sets/v5c_180/items.csv')

trials   = d[d.block == 'pairs'].copy()
main     = trials[trials.phase == 'main'].copy()
analysed = main[main.analysed == True].copy()             # 360 rows, 180 per block

analysed['chose_A'] = (analysed.chosen == 'A')            # the outcome
analysed = analysed.merge(items, on='item_id', how='left',
                          suffixes=('', '_item'))         # every item column
```

`chose_A` is the outcome; `pred_sat` and `pred_fog` are the predictors
(positive = A is the predicted choice); `episode` (or `block_position`)
says which block a trial belongs to, and `a_is_left` gives the side term.

### Attention and quality checks

```python
# Catch trials: failures per block and over the session (exclude at >= 3)
catch = main[main.is_catch == True]
fails = (~catch.catch_correct.astype(bool)).groupby(catch.block_position).sum()
total = s.catch_fail_total                         # = fails.sum()

# Fast responses (< 300 ms) — part of the attention check
fast = (main[~main.is_catch.astype(bool)].rt < 300).groupby(main.block_position).mean()

# Consistency: compare the chosen IMAGE with the original's, within the block
cons = main[main.list_trial_type == 'consistency']
orig = main.set_index(['block_position', 'item_id']).chosen
agree = [r.chosen == orig[(r.block_position, r.repeat_of_item)] for r in cons.itertuples()]
consistency_rate = np.mean(agree)                   # of 15 per block

# Side bias
side_bias = (analysed.response_side == 'left').groupby(analysed.block_position).mean()
```

A participant pressing arrows at random has a 1/4 chance on each catch
trial; someone pressing only ← or → fails every one.

---

## 12. Combining sessions

```python
import glob
frames = []
for f in glob.glob('data/*.csv'):
    d = pd.read_csv(f)
    s = d.iloc[0]
    if s.is_test or s.get('is_dev', False) or s.get('shortened', False):
        continue
    frames.append(d[(d.block == 'pairs') & (d.phase == 'main')])
all_trials = pd.concat(frames, ignore_index=True)
```

Group by `participant_id`, and **split by `group` and `episode`** before
comparing. Check `stimulus_set == 'v5c_180'` and `experiment_version` on
every file: sessions from older packages are not comparable — v5b_180 had
the same two-block design and columns but different lists, items and scenes
(and 6 + 3 practice in its design.json); v4 had different lists, one
block and different column meanings (§4).

---

## 13. Quick integrity check

For a complete, usable session:

| check | expected |
|---|---|
| `is_test`, `is_dev`, `shortened` | all `False` |
| `participant_id` | a real ID, or `NOID_…` with `contact_saved = True` |
| `group` | `participant` or `control` |
| `slot`, `assignment_row` | a whole number; `assignment_row == (slot - 1) % 64 + 1` |
| `b1_episode`, `b2_episode` | participants: derealization + ordinary; controls: ordinary + expectation (either order) |
| `consent_given` | `True` |
| `stimulus_set` | `v5c_180` |
| rows where `block == 'pairs'` | 406 (203 per `block_position`) |
| rows where `phase == 'main'` and `analysed == True` | 360 (180 per block) |
| `list_trial_type` counts per block | 54 sat_only, 54 fog_only, 36 together, 36 conflict, 15 consistency, 5 catch, 3 practice |
| main rows per block, in `block_trial` order | identical to `b<p>_list`'s `item_id` order |
| `break` rows | 4 per block |
| `practice_feedback` rows | 3 per block |
| a `rest` row | present; `rest_end` − `rest_start` ≥ 60 s |
| `catch_fail_b1`, `catch_fail_b2`, `catch_fail_total` | 0–5, 0–5, their sum |
| `ep_*_words` | not empty for each recalled episode |
| a `word_ratings` row | present, all ten `word_*` filled |
| `rating_foggy`, `rating_faded` | not empty |
| a `state` row | present, all four `state_q*` filled |
| `gamma_estimate` | not empty |
| `chosen` missing (image trials) | 0 |
| `no_response` true | 0 |
| `panel_rendered_px` | all `512x512` |
| `images_fit` | `True` |
| `failed_images` (on the `preload` rows) | `[]` |

---

## 14. Columns you can ignore

These are written by jsPsych or its plugins rather than by the experiment:

`trial_index` (row counter), `internal_node_id` (timeline address),
`time_elapsed` (ms since the session started), `stimulus` (the screen's raw
HTML), `value`, `success` and `timeout` (download step), `failed_audio`,
`failed_video`, `calibration_step`, `gamma_matches`, `gamma_arrangement`,
`button_pressed` (button screens).

`failed_images` is the exception. Glance at it on the `preload` rows:
anything other than `[]` means some images did not load for that
participant.

---

## 15. The separate contact file

**GitHub Pages and local runs only** (`contact_storage = datapipe`). On
Pavlovia there is no contact file: name and email are in the response file
(§1, §5).

If a participant gives a name or email on the ID screen, those values are
uploaded **straight away**, as a separate one-row CSV, to a separate
DataPipe experiment (`contact_datapipe.experiment_id`, now `T8mzFmXrMcjw`,
a **test** experiment until data collection) and its own Zenodo record
(`[Zenodo record — to complete]`) — even if the session is never finished.
They are removed from the response data before anything else happens, so
the response files stay pseudonymised. (The consent text tells
participants this.)

```
contact_<participant_id>_<session start, Japan time>.csv
e.g. contact_R_9rJJWk01c767jE8_2026-11-30T14-10-40.csv
```

The stamp is the **same** as in the session's response file name (§1),
although the contact file is uploaded earlier.

| column | meaning |
|---|---|
| `participant_id` | the link to the response file and to the CDS-29 record. For a participant who gave no ID, the generated `NOID_DRCHAIN26_…` ID — the same as in their response file, and the only link between the two |
| `name`, `email` | as typed. Either may be empty |
| `is_test`, `is_dev` | same meaning as in the response data |
| `stimulus_set`, `language` | for convenience |
| `session_start_time` | UTC — the same value as in the response file, for matching |
| `saved_at` | UTC time of upload |

No file is written if both fields were left blank, and none for a session
that was declined at consent or stopped by the window check (both come
before the ID screen). It **is** written in local and dev runs, so the
upload can be tested quickly; those rows carry `is_test` / `is_dev` =
`true` and should be deleted or ignored. Restrict access to the contact
record, and delete it when your ethics approval requires, independently of
the response data.
