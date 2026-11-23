/* =========================================================================
 * config.js — every setting for the experiment lives here.
 *
 * This is the ONLY file you edit to switch hosting platform, language,
 * or to turn blocks on and off. No settings are hard-coded elsewhere.
 * ========================================================================= */

var CONFIG = {

  // -----------------------------------------------------------------------
  // Experiment identity — stamped onto every row of the output.
  // -----------------------------------------------------------------------
  experiment: {
    name:    'derealization_v5c',
    version: '1.0.0-v5c',
  },

  // -----------------------------------------------------------------------
  // Groups. Read from ?group= in the invitation link — never asked on
  // screen. The group decides which two episodes the session's two blocks
  // are about (design.json: groups):
  //   participant  derealization + ordinary
  //   control      ordinary + expectation
  // and the wording of the episode screens and the word-rating
  // instruction. Group- and episode-dependent strings in text/en and
  // text/ja are objects keyed by group or episode; validate.js checks every
  // one has every version in both languages.
  //
  // A link with no group, or one not listed here, does not start: it shows
  // the same "incomplete link" message as a missing participant ID.
  //
  // Stamped on every row as `group`.
  //
  // SLOT. Every invitation link also carries ?slot=<n> (a whole number,
  // 1 or more). Slot n uses row ((n - 1) mod 64) + 1 of the group's table
  // in the package's assignment.json, which names, for block positions 1
  // and 2, the episode, the set, the list and the practice file. Slots are
  // handed out in sequence per group and never reused. A link without a
  // valid slot (missing, 0, negative, not a whole number) does not start:
  // it shows the "incomplete link" message. Stamped on every row as `slot`
  // and `assignment_row`.
  //
  // The link may also carry ?idate=YYYY-MM-DD, the date of the
  // participant's interview, added by the researcher who schedules the
  // interviews. It is never asked on screen. A valid date is stamped on
  // every row as `interview_date`; a missing or invalid one leaves it empty
  // (and logs a console warning) — the session still runs.
  //
  // A full link:  .../?pid=R_xxxxxxxxxxxxxxx&group=participant&slot=1&idate=2026-11-03
  // -----------------------------------------------------------------------
  groups: ['participant', 'control'],

  // -----------------------------------------------------------------------
  // Hosting platform. Controls how data is saved.
  //
  //   'auto'     — decided from the address the page is served from:
  //                  run.pavlovia.org (or any *.pavlovia.org) -> 'pavlovia'
  //                  *.github.io                              -> 'github'
  //                  anything else (your own computer)        -> 'local'
  //                The SAME files then work on GitHub Pages, on Pavlovia
  //                and on your computer, with nothing to edit.
  //   'local'    — CSV downloads to your own Downloads folder. No upload.
  //   'github'   — uploads via DataPipe, which stores the file on Zenodo.
  //   'pavlovia' — Pavlovia handles saving (results in the Pavlovia
  //                project's data/ folder). See SETUP.md, "Pavlovia".
  //
  // The value actually used is stamped on every row as `platform`.
  // -----------------------------------------------------------------------
  platform: 'auto',

  // -----------------------------------------------------------------------
  // Where jsPsych 7.1.2, jQuery 2.2.0 and the plugins are loaded from.
  //
  //   'bundled'  — our own copy in vendor/ (checked byte-for-byte against
  //                the official jsPsych 7.1.2 release and jQuery 2.2.0).
  //                Works everywhere, and is the same on every platform.
  //   'pavlovia' — the copy Pavlovia serves itself under lib/vendors/
  //                (as in the earlier Pavlovia experiment). Works ONLY on
  //                Pavlovia; elsewhere the page cannot start.
  //
  // The Pavlovia plugin (jspsych-7-pavlovia-2021.12.js, in the top folder)
  // is loaded from our copy in both cases, and only on Pavlovia. The
  // DataPipe plugin is loaded only when something is sent to DataPipe.
  // Stamped on every row as `libraries`.
  // -----------------------------------------------------------------------
  libraries: 'bundled',

  // -----------------------------------------------------------------------
  // DataPipe target. DataPipe stores each uploaded file on Zenodo.
  //
  // >>> TEST EXPERIMENT — REPLACE BEFORE DATA COLLECTION. <<<
  // This experiment_id (and contact_datapipe.experiment_id below) are the
  // TEST experiments, kept so the v5c code can be tested end to end. Their
  // data mix with older test sessions. Before collecting real data, create
  // new DataPipe experiments for v5c and put their IDs here — see the
  // "Before data collection" checklist in README.md.
  //
  // IMPORTANT: on the DataPipe dashboard, "Enable data collection?" must be
  // switched ON or every upload is rejected. The experiment will report the
  // rejection on screen, but it is easy to forget.
  // -----------------------------------------------------------------------
  datapipe: {
    experiment_id: 'VoYGtg5yKGr2',  // TEST experiment — replace before data collection
    zenodo_record: '[Zenodo record — to complete]',   // for reference only
  },

  // -----------------------------------------------------------------------
  // Participant identification.
  //
  // The ID normally arrives as a URL parameter:
  //     https://<site>/?pid=R_9rJJWk01c767jE8
  // If absent, the participant is asked to type it (the same ID is printed
  // in their invitation email).
  //
  // IDs are CASE-SENSITIVE: R_4EWNe48BIB50mVI and R_4ewne48bib50mvi are
  // different identifiers. Whitespace is stripped; case is not touched.
  //
  // All three are asked on ONE screen at the start. If the invitation link
  // carries ?pid=, the ID field is filled in already.
  //
  // The three fields can each be switched off independently:
  //
  //   collect_id     REQUIRED when on. The ID is what links a session to the
  //                  participant's CDS-29 score. If switched off, sessions
  //                  get an anonymous ID ('ANON_' + random) and CANNOT be
  //                  linked to anything — validate.js warns about this.
  //
  //   collect_name   OPTIONAL for the participant (they may leave it blank).
  //   collect_email  OPTIONAL for the participant.
  //
  // With contact_storage 'datapipe' (GitHub Pages), name and email are
  // NEVER written to the response data. They are uploaded as a separate
  // small file (ID + name + email) to a separate DataPipe experiment and
  // Zenodo record — see `contact_datapipe` below — so the response data on
  // Zenodo stays pseudonymised, and the file that identifies people can be
  // restricted or deleted on its own. The response data only records
  // whether each was given (true/false).
  // With contact_storage 'results_file' (Pavlovia) they are kept in the
  // response file instead — see contact_storage at the end of this block.
  // If all three fields are off, the screen is skipped entirely.
  //
  // With 'datapipe', the contact file is uploaded whenever a name or email
  // is given, on every platform including local/dev runs, so it can be
  // tested quickly. Test sessions are flagged is_test / is_dev inside that
  // file too.
  //
  // NO ID IN THE LINK (allow_manual_id: true, name and email both
  // collected). The participant must give EITHER a valid participant ID
  // OR both a name and a valid email address — giving all three is best,
  // and the screen says so. An ID that is typed but does not match
  // id_pattern still blocks Continue (a mistyped ID would point to the
  // wrong person); to continue without an ID the field must be empty.
  // A session without an ID gets a unique ID made of no_id_prefix, '_',
  // and 8 random characters (e.g. NOID_DRCHAIN26_7K3QX9PA). It is the
  // participant_id of the response file AND of the contact file, so the
  // two link exactly as they do with a real ID — which means the link to
  // the person then rests entirely on the contact file reaching DataPipe
  // (recorded as contact_saved). id_source = 'no_id'. These are real
  // sessions, not tests: is_test stays false.
  //
  // With a valid ?pid= in the link nothing changes: the ID is filled in,
  // and name and email are optional.
  // -----------------------------------------------------------------------
  participant: {
    id_pattern:        '^R_[A-Za-z0-9]{15}$',
    no_id_prefix:      'NOID_DRCHAIN26',

    // Test IDs. Accepted in place of a real ID, and every row of a session
    // using one is flagged is_test = true. Add more as needed.
    //   Z_21121989  — your own testing
    //   CHAIN_2026  — for colleagues. Several people may share it; their
    //                 files are still separate (the filename has a
    //                 timestamp), and the optional name field tells them apart.
    superuser_ids:     ['Z_21121989', 'CHAIN_2026'],

    allow_manual_id:   true,   // false = URL parameter only
    collect_id:        true,
    collect_name:      true,
    collect_email:     true,

    // Where a name and email address, if given, are stored.
    //
    //   'auto'         — 'results_file' on Pavlovia, 'datapipe' elsewhere.
    //   'datapipe'     — a separate one-row file, uploaded straight away to
    //                    contact_datapipe (below). Never in the response
    //                    file. The response data records contact_saved.
    //   'results_file' — kept IN the response file, as the columns
    //                    contact_name and contact_email on the
    //                    participant_id row, and saved with it at the end.
    //                    Nothing is sent to DataPipe. Meant for Pavlovia,
    //                    where the results stay in the private Pavlovia
    //                    project. NEVER use it with 'github': the response
    //                    file goes to Zenodo.
    //
    // The consent and ID screens say which applies (the *_results_file
    // texts). Stamped on every row as `contact_storage`.
    contact_storage:   'auto',
  },

  // -----------------------------------------------------------------------
  // Separate DataPipe target for name and email. Kept apart from the
  // response data on purpose — see the note above.
  //
  // On the DataPipe dashboard for THIS experiment:
  //   - switch "Enable data collection" ON
  //   - under Validation, set Required Fields to `participant_id`
  //     (NOT `trial_type`: this file is not written by jsPsych and has no
  //     trial_type column, so that requirement would reject every upload)
  //
  // >>> TEST EXPERIMENT — REPLACE BEFORE DATA COLLECTION (see datapipe,
  // above, and README.md). <<<
  // -----------------------------------------------------------------------
  contact_datapipe: {
    experiment_id: 'T8mzFmXrMcjw',  // TEST experiment — replace before data collection
    zenodo_record: '[Zenodo record — to complete]',   // for reference only
  },

  // -----------------------------------------------------------------------
  // Researcher contact, shown only on the error screen if the upload fails
  // (the thank-you screen has no contact sentence).
  //
  // CHANGE THIS before recruiting, to a neutral institutional address. validate.js warns while it still holds
  // the placeholder.
  // -----------------------------------------------------------------------
  researcher_contact: 'CHANGE_ME@example.com',

  // -----------------------------------------------------------------------
  // Response keys.
  // -----------------------------------------------------------------------
  keys: {
    left:  'ArrowLeft',
    right: 'ArrowRight',
  },

  // -----------------------------------------------------------------------
  // Catch trials.
  //
  // A catch trial shows NO IMAGES — just a large instruction naming one
  // arrow key. Removing the images is what makes the check work: with two
  // pictures on screen the trained "pick a side" response fires before the
  // participant reads anything, so an attentive-but-habituated person fails.
  // With nothing to choose between, the only available action is to read.
  //
  // The target is UP or DOWN, never a side, so a reflexive left/right press
  // fails immediately. A single key avoids OS auto-repeat, which would let
  // a held key satisfy a two-key sequence by accident.
  //
  // ONE PRESS ONLY. The first keypress ends the trial and is scored against
  // the target — there is no retry. A trial that waited for the correct key
  // could only ever end in success and would discriminate nothing.
  //
  // THE TARGETS COME FROM THE PACKAGE (design.json:
  // catch.targets_by_block_position), one list per block position, applied
  // in order to the catch rows of that block's list and RESTARTING at the
  // first target in each block. The lists carry no expected response; the
  // target is recorded on the row as catch_target. Five targets per block
  // for the five catch rows of each list.
  //
  // Failures are counted per block (catch_fail_b1, catch_fail_b2) and in
  // total (catch_fail_total). The exclusion rule (3 or more failures over
  // both blocks, design.json: catch.exclude_at_or_above) is applied in the
  // analysis; the experiment only records.
  //
  // `mode` is what this code implements: 'no_images'. Every catch row of
  // the lists carries a `catch_mode`, and design.json a catch.mode;
  // validate.js refuses to start if either expects a different kind.
  // -----------------------------------------------------------------------
  catch_trials: {
    mode:       'no_images',
    lockout_ms: 750,   // keys dead for this long, so a carried-over
                       // reflex press from the previous trial cannot land.
                       // Not a minimum response time: the catch rt is
                       // measured from the end of the lockout.
  },

  // -----------------------------------------------------------------------
  // Display.
  //
  // image_px is the on-screen size of each stimulus. The real images are
  // 512 x 512, so 512 means 1:1 with no resampling. min_width/min_height
  // are derived from it, so the two cannot drift apart.
  //
  // THE WINDOW CHECK IS A HARD STOP. Right after full screen, the real trial
  // layout — the question in the participant's language and group, above
  // two image_px panels — is drawn invisibly and measured. If any part of
  // it would be cut off, by width or by height, the session stops with a
  // message asking the participant to enlarge the window or use a larger
  // screen and reopen the link. There is no "continue anyway". Nothing is
  // uploaded for a stopped session (the check runs before the ID screen).
  //
  // min_width/min_height are only the RECOMMENDED size, recorded as
  // viewport_ok; the stop is decided by the measurement, not by them. The
  // measured smallest window that passes is 1056 x 666 CSS pixels (both
  // languages, both groups): the question at 1.5rem on up to two lines, the
  // two panels, and the arrow keys shown under them on the first practice
  // trial of each block.
  // -----------------------------------------------------------------------
  display: {
    image_px:      512,
    gap_px:        32,
    min_width:     512 * 2 + 32 + 64,   // 1120, recommended
    min_height:    512 + 168,           // 680, recommended

    // false (default, and required for the registered design): every
    //   participant sees panels at exactly image_px. Removes
    //   between-participant variation in the physical size of the
    //   manipulation. A window too small to show them whole is stopped by
    //   the window check above.
    // true: panels shrink to fit. Nothing is cut off, but display size
    //   varies between participants and must be treated as a covariate.
    allow_scaling: false,
  },

  // -----------------------------------------------------------------------
  // Language. 'en' | 'ja'. ?lang=en or ?lang=ja in the URL overrides this,
  // which is useful for checking both without editing the file.
  // -----------------------------------------------------------------------
  language: 'en',

  // -----------------------------------------------------------------------
  // Stimulus package.
  //
  // The package lives in its own folder under sets_dir and holds everything
  // the experiment needs:
  //
  //     data/sets/<set>/design.json       counts, groups, lists, catch
  //                                       targets, breaks, rest, practice
  //                                       (trials and feedback per block)
  //     data/sets/<set>/assignment.json   64 slots per group
  //     data/sets/<set>/lists/*.json      one block's 200 main trials each
  //     data/sets/<set>/practice/block1.json, block2.json
  //     data/sets/<set>/items.csv         one row per item_id, for analysis
  //     data/sets/<set>/preload.json      every image a list or practice
  //                                       row shows (catch rows show none)
  //     data/sets/<set>/stimuli/*.png
  //
  // `v5c_180` is the two-block package in use: 8 lists of 200 main trials
  // (180 analysed, 15 consistency repeats, 5 catch), 3 + 3 practice trials
  // with feedback before both blocks, 632 images of 42 scenes (617 shown,
  // 15 belonging only to catch rows, which show no images). It is a FROZEN
  // copy, verified against the package's checksums, and must never be
  // edited, re-encoded, resized or renamed. tools/check_package.js checks
  // it. Its README.txt describes the design.
  //
  // `v5b_180` (the earlier package, 6 + 3 practice) is still in data/sets/
  // but no longer used; it will be removed in a separate change.
  //
  // `set` is the default; ?set=<name> overrides it, but only names in
  // available_sets are accepted. Stamped on every row as `stimulus_set` and
  // in the uploaded filename. (The set A/B a block uses is a different
  // thing: it is recorded per row as `set`.)
  // -----------------------------------------------------------------------
  data: {
    set:            'v5c_180',
    available_sets: ['v5c_180'],
    sets_dir:       'data/sets/',
  },

  // -----------------------------------------------------------------------
  // Which blocks run, in SESSION ORDER. Each can be switched off
  // independently, so a single phase can be tested without sitting through
  // the whole session; dev.html lists every switch.
  //
  // The session, the same for both groups:
  //    1. consent                     blocks.consent
  //    2. full screen + window check  calibration.fullscreen / screen_check
  //    3. participant ID              participant.collect_*
  //    4. set-up, brightness          calibration.setup / brightness
  //    5. gamma matching              calibration.gamma
  //    6. episode selection           blocks.episodes
  //    7. block 1: reinstatement, practice, 200 trials with breaks
  //    8. rest (1 minute)             blocks.rest
  //    9. block 2: as block 1, with the second episode
  //   10. word ratings                blocks.words
  //   11. CDS items (4, trait format) blocks.cds
  //   12. save, 13. completion screen
  //
  // Within each block: blocks.practice (the practice trials) and
  // blocks.main (the 200 main trials). blocks.positions says which block
  // positions run: [1, 2] for a real session; dev.html can run one alone.
  //
  // CONSENT IS REQUIRED for a real session. index.html refuses to start
  // with blocks.consent off, or with positions other than [1, 2]
  // (validate.js); only dev.html can.
  // -----------------------------------------------------------------------
  blocks: {
    consent:      true,   // first screen; declining ends the session with
                          // nothing uploaded
    size_check:   false,  // developer screen showing the measured panel
                          // size. Not for participants; the 'Screen & size
                          // check' dev preset switches it on.
    episodes:     true,   // episode selection: identifying words and the
                          // five recall questions per recalled episode
    practice:     true,   // the practice trials before each block
    main:         true,   // the 200 main trials of each block
    rest:         true,   // the fixed rest between the two blocks
    words:        true,   // word ratings, once, after block 2
    cds:          true,   // four CDS items (trait format) at the end
    positions:    [1, 2], // block positions to run (dev.html only may change)
  },

  // -----------------------------------------------------------------------
  // Episode questions. For each RECALLED episode (participants: the
  // derealization and the ordinary episode; controls: the ordinary
  // episode), one screen asks:
  //
  //   words      a few words to identify it      free text, REQUIRED
  //   when       When was it?                    free text, optional
  //   duration   How long did it last?           free text, optional
  //   where      Where were you?                 free text, optional
  //   tone       unpleasant ... pleasant         -3 .. +3, REQUIRED
  //   intensity  emotional intensity             0 .. 6, REQUIRED
  //
  // The scales have no default, and Continue stays disabled until the
  // words, the tone and the intensity are answered. The optional questions
  // are marked "(optional)"; a blank one is saved as an empty cell. There
  // is no "Prefer not to say". The expectation block (controls) has no
  // questions: its screen shows the short description of derealization.
  //
  // Answers are stamped on every row as ep_<episode>_<question>. See
  // DATA_DICTIONARY.md §6.
  // -----------------------------------------------------------------------
  episodes: {
    text_max: 200,    // characters per free-text answer
  },

  // Practice: NOT SET HERE. The number of practice trials before each block,
  // whether they get feedback and on how many of them, come from the
  // package's design.json (practice_by_block, practice_feedback_by_block_
  // position, practice_feedback_trials) and its practice files; v5c_180:
  // 3 + 3 trials, feedback on all 3 before both blocks. A package without
  // these keys does not start (the loader and validate.js stop with an
  // error naming the key). The values are stamped on every row
  // (practice_trials_b1/_b2, practice_feedback_b1/_b2).

  // -----------------------------------------------------------------------
  // Developer trial label. DEV.HTML ONLY — leave false here.
  //
  // When on, every practice and main trial shows a small label under the
  // images (catch trials: at the bottom of the screen), e.g.
  //   Block 1 · 37/200 · sat_only · A016 · A on left · colour +1.03 SD, contrast +0.00 SD
  // colour / contrast are the list's pred_sat / pred_fog: the pair's
  // differences in SD units, signed so that positive = image A is the
  // predicted choice. Consistency rows add "repeat of trial n", catch rows
  // their target. A second line (not on catch rows, which show no images)
  // gives each image's contrast and colour levels, read from its file name
  // (<scene>__c<level>__s<level>.png; 0, p1-p3, n1-n3; c0 + s0 = "original"),
  // and how many levels apart the two are:
  //   Left: contrast −2, colour +1 · Right: contrast −2, colour −3 · Apart: contrast 0, colour 4 levels
  //
  // dev.html switches it on with the "Trial label" box in the dev menu (on
  // by default there). It is drawn into the page after each screen appears,
  // so it is never part of the recorded `stimulus` HTML or any other column.
  // It is shown only when dev.html is running (window.DEV_MODE), whatever
  // this says, and validate.js refuses to start index.html with it true.
  // -----------------------------------------------------------------------
  dev: {
    trial_label: false,
  },

  // -----------------------------------------------------------------------
  // Limits. DEV.HTML ONLY — leave at 0.
  //
  // max_trials shortens EACH block to its first N main trials, and
  // max_practice the practice of each block to its first N trials. Useful
  // for checking a whole session, or an upload, in a few minutes.
  //
  // A shortened session is NOT valid data: it misses catch and consistency
  // trials. Limits are ignored outside dev.html, and validate.js refuses to
  // start index.html while either is set. A shortened session is stamped
  // is_dev = true, shortened = true and shortened_to = N on every row.
  // -----------------------------------------------------------------------
  limits: {
    max_trials:   0,   // 0 = all 200 main trials per block
    max_practice: 0,   // 0 = all practice trials (design.json)
  },

  // -----------------------------------------------------------------------
  // Calibration and screen handling.
  //
  // fullscreen is required for the real experiment: it fixes the viewport
  // so the stimuli are the same size throughout, and removes browser
  // chrome that would otherwise eat vertical space.
  // -----------------------------------------------------------------------
  calibration: {
    fullscreen:   true,
    screen_check: true,   // window check: HARD STOP if the trial layout
                          // would be cut off (see display, above)

    // Set-up screen before the brightness screen: position of the computer
    // and no phone or other devices (src/calibration/setup.js). No
    // checkbox; one row with block 'setup'.
    setup:        true,

    // Brightness and gamma matter more here than in most experiments,
    // because the manipulations ARE saturation and shadow lifting (see the
    // module headers in src/calibration/). Neither lets you correct
    // anything; both give you a covariate. Neither screen mentions the
    // pictures.
    brightness:   true,   // maximum screen brightness and steady room
                          // lighting: two required checkboxes, recorded
                          // as brightness_confirmed / lighting_confirmed
    gamma:        true,   // 3x luminance match, ~2 minutes

    // 'split_field' (left checkerboard | right grey) or 'centre_surround'
    gamma_arrangement: 'split_field',
  },

  // -----------------------------------------------------------------------
  // Trial timing (milliseconds).
  // -----------------------------------------------------------------------
  timing: {
    fixation_ms: 500,
    blank_ms:    250,
    // Breaks: after trials 40, 80, 120 and 160 of each block, taken from
    // design.json (timing.breaks_after_trial); not set here.

    // Practice feedback: the chosen image is outlined for this long, after
    // each practice trial that gets feedback (design.json: practice_
    // feedback_by_block_position, practice_feedback_trials), except the
    // first of the block.
    practice_feedback_ms: 900,

    // First practice trial of a block with feedback: after the response,
    // only the chosen image stays on screen, with a message confirming the
    // participant's choice (practice.first_feedback.<episode>), for this
    // long; then the next practice trial starts. Recorded as
    // feedback_display = 'chosen_only' on that trial's row.
    first_feedback_ms: 3000,

    // The fixed rest between the two blocks. A countdown is shown, and
    // Continue appears only when it reaches zero.
    rest_ms: 60000,
  },

  // -----------------------------------------------------------------------
  // Debug. When true, the console prints a validation report and the
  // completion screen shows the raw upload response.
  // -----------------------------------------------------------------------
  debug: true,
};
