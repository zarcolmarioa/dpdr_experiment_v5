/* =========================================================================
 * record.js — builds what ends up in the output file.
 *
 * Two jobs:
 *   1. Stamp session-level properties onto every row (experiment, group,
 *      slot and the assignment row, practice settings, interview date,
 *      display; then participant ID; then episode answers (episodes.js),
 *      block and rest times, catch failures per block, the target word
 *      ratings; then the closing stamps).
 *   2. Build the per-trial row for a stimulus pair or a catch trial.
 *
 * The consent, episode, rest and CDS rows are built in their own phase
 * files.
 *
 * SESSION PROPERTIES OVERWRITE TRIAL FIELDS, IMPORTANT
 * ----------------------------------------------------
 * jsPsych writes each row as {plugin data, trial data, jsPsych's own
 * columns, session properties}, later ones winning, and addProperties also
 * writes onto every row already recorded. A session property therefore
 * silently replaces a trial field of the same name. So the session never
 * uses a trial field's name: the assignment is stamped as assign_* and
 * b1_* / b2_*, never as `set`, `order`, `episode` or `block_position`,
 * which are per-trial.
 *
 * NAME COLLISION: trial_type
 * --------------------------
 * jsPsych writes its own column called `trial_type`, holding the PLUGIN
 * name ('html-keyboard-response', ...), and it overwrites any `trial_type`
 * we give. The list's design label (sat_only ... consistency, catch,
 * practice) is therefore written as `list_trial_type`. The list's own
 * `pair_type` (the type of the image pair, which differs from
 * list_trial_type on consistency and catch rows) is written as `pair_type`.
 * The lists themselves are never modified.
 *
 * KEY CASE, IMPORTANT
 * -------------------
 * jsPsych 7 returns key names LOWERCASED: 'arrowleft', not 'ArrowLeft'.
 * Every comparison between a recorded key and a configured key is
 * case-insensitive.
 * ========================================================================= */

var Record = (function () {

  // -----------------------------------------------------------------------
  // Session and task times. Times in the DATA are UTC (ISO 8601, ending in
  // Z). The FILE NAMES use the session start in JAPAN TIME — see
  // sessionStamp().
  //
  //   session  from the session-start stamp (just before the consent
  //            screen) to the save step.
  //   task     from the onset of the first image trial (practice included)
  //            to the answer to the last trial of the last block.
  // -----------------------------------------------------------------------
  var _sessionStart = null;   // Date
  var _taskStart    = null;   // Date
  var _taskEnd      = null;   // Date

  // Catch failures per block position: null until that block has started.
  var _catchFail  = { 1: null, 2: null };
  var _catchShown = { 1: null, 2: null };

  var JST_OFFSET_MS = 9 * 60 * 60 * 1000;   // Japan: UTC+9, no daylight saving

  function _sessionStartDate() {
    if (!_sessionStart) _sessionStart = new Date();
    return _sessionStart;
  }

  function sessionStartISO() {
    return _sessionStartDate().toISOString();
  }

  // The session start in Japan time, safe for file names:
  //   2026-10-30T14-12-40
  function sessionStamp() {
    var jst = new Date(_sessionStartDate().getTime() + JST_OFFSET_MS);
    return jst.toISOString().slice(0, 19).replace(/:/g, '-');
  }

  function markTaskStart() { if (!_taskStart) _taskStart = new Date(); }
  function markTaskEnd()   { _taskEnd = new Date(); }

  function _seconds(a, b) {
    return (a && b) ? Math.round((b.getTime() - a.getTime()) / 1000) : null;
  }

  // -----------------------------------------------------------------------
  // Session-level properties, stamped at the very start so they reach every
  // row of the file.
  // -----------------------------------------------------------------------
  function stampSessionStart(jsPsych) {
    var a = Loader.assignment() || { blocks: [] };
    var props = {
      experiment_name:      CONFIG.experiment.name,
      experiment_version:   CONFIG.experiment.version,
      platform:             Platform.name(),
      contact_storage:      Platform.contactStorage(),
      libraries:            Platform.libraries(),
      language:             Loader.language(),

      // From the invitation link.
      group:                Loader.group(),
      slot:                 Loader.slot(),
      interview_date:       Loader.interviewDate(),

      // The package, and this slot's row of assignment.json.
      stimulus_set:         Loader.stimulusSet(),
      design_version:       (Loader.design() || {}).version || null,
      assignment_row:       Loader.assignmentRowNumber(Loader.slot()),
      assign_block_order:   (a.block_order === undefined) ? null : a.block_order,
      assign_set_mapping:   (a.set_mapping === undefined) ? null : a.set_mapping,
      assign_order:         (a.order === undefined) ? null : a.order,

      session_start_time:   sessionStartISO(),

      // Display context, measured before full screen. The full-screen
      // values are added by screen-check.js.
      screen_width:         window.screen.width,
      screen_height:        window.screen.height,
      viewport_width:       window.innerWidth,
      viewport_height:      window.innerHeight,
      device_pixel_ratio:   window.devicePixelRatio,
      user_agent:           navigator.userAgent,
    };
    // Per block position: the episode, set, list and practice file the
    // assignment row names, and the practice settings, from the package's
    // design.json (practice_by_block, practice_feedback_by_block_position).
    [1, 2].forEach(function (p) {
      var blk = null;
      a.blocks.forEach(function (x) { if (x.position === p) blk = x; });
      props['b' + p + '_episode']  = blk ? blk.episode  : null;
      props['b' + p + '_set']      = blk ? blk.set      : null;
      props['b' + p + '_list']     = blk ? blk.list     : null;
      props['b' + p + '_practice'] = blk ? blk.practice : null;
      props['practice_trials_b' + p]   = Loader.practiceCount(p);
      props['practice_feedback_b' + p] = Loader.practiceFeedback(p);
      props['block' + p + '_start'] = null;
      props['block' + p + '_end']   = null;
      props['catch_fail_b' + p]     = null;
    });
    props.rest_start = null;
    props.rest_end   = null;
    props.catch_fail_total = null;
    jsPsych.data.addProperties(props);
  }

  // Who is running the session, once the ID screen has accepted an ID.
  function stampParticipant(jsPsych, participantId, isSuperuser) {
    jsPsych.data.addProperties({
      participant_id: participantId,
      is_test:        isSuperuser,
    });
  }

  // -----------------------------------------------------------------------
  // Block and rest times, and catch failures per block.
  //
  //   block<p>_start  when the block began: after its preload gate, before
  //                   its reinstatement screen
  //   block<p>_end    after the answer to its last main trial
  //   catch_fail_b<p> catch trials of that block answered with a key other
  //                   than the target (0-5); null if the block did not run
  //   rest_start / rest_end   the rest screen appearing / Continue pressed
  // -----------------------------------------------------------------------
  function markBlockStart(jsPsych, b) {
    _catchFail[b.position]  = 0;
    _catchShown[b.position] = 0;
    var props = {};
    props['block' + b.position + '_start'] = new Date().toISOString();
    props['catch_fail_b' + b.position] = 0;
    jsPsych.data.addProperties(props);
    if (CONFIG.debug) {
      console.log('[Record] block ' + b.position + ' (' + b.episode + ', list ' +
                  b.list + ', practice ' + b.practiceFile + ' x' +
                  b.practice.length + (b.feedback ? ' with feedback' : '') +
                  ', ' + b.rows.length + ' main trials) started.');
    }
  }

  function markBlockEnd(jsPsych, b) {
    var props = {};
    props['block' + b.position + '_end'] = new Date().toISOString();
    props['catch_fail_b' + b.position] = _catchFail[b.position];
    props.catch_fail_total = _catchTotal();
    jsPsych.data.addProperties(props);
    if (CONFIG.debug) {
      console.log('[Record] block ' + b.position + ' ended: ' +
                  _catchFail[b.position] + ' catch failure(s) of ' +
                  _catchShown[b.position] + '.');
    }
  }

  function markRest(jsPsych, which, when) {
    var props = {};
    props['rest_' + which] = when.toISOString();
    jsPsych.data.addProperties(props);
  }

  // Sum over the blocks that ran; null if none did.
  function _catchTotal() {
    var t = null;
    [1, 2].forEach(function (p) {
      if (_catchFail[p] !== null) t = (t || 0) + _catchFail[p];
    });
    return t;
  }

  // -----------------------------------------------------------------------
  // Closing stamps, at the save step.
  // -----------------------------------------------------------------------
  function stampSessionEnd(jsPsych, extra) {
    var end = new Date();
    var props = {
      session_end_time:   end.toISOString(),
      session_duration_s: _seconds(_sessionStartDate(), end),
      task_start_time:    _taskStart ? _taskStart.toISOString() : null,
      task_end_time:      _taskEnd   ? _taskEnd.toISOString()   : null,
      task_duration_s:    _seconds(_taskStart, _taskEnd),
      catch_fail_b1:      _catchFail[1],
      catch_fail_b2:      _catchFail[2],
      catch_fail_total:   _catchTotal(),
    };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) props[k] = extra[k];
      }
    }
    jsPsych.data.addProperties(props);
  }

  // -----------------------------------------------------------------------
  // The two TARGET word ratings as session columns: rating_foggy and
  // rating_faded, on every row.
  // -----------------------------------------------------------------------
  function stampWordRatings(jsPsych, ratings) {
    jsPsych.data.addProperties({
      rating_foggy: (ratings.foggy === undefined) ? null : ratings.foggy,
      rating_faded: (ratings.faded === undefined) ? null : ratings.faded,
    });
  }

  // -----------------------------------------------------------------------
  // Map a recorded key onto a side. Both sides lowercased.
  // -----------------------------------------------------------------------
  function keyToSide(key) {
    if (key === null || key === undefined) return null;
    var k = String(key).toLowerCase();
    if (k === String(CONFIG.keys.left).toLowerCase())  return 'left';
    if (k === String(CONFIG.keys.right).toLowerCase()) return 'right';
    return null;
  }

  // -----------------------------------------------------------------------
  // Per-trial data for one row of a list or practice file. `ctx` is
  // { position, episode, phase ('practice' | 'main') }. slot, group and
  // assignment_row are session properties, so they are on this row too.
  //
  // Everything from the list row is copied unchanged; item_id is what joins
  // a response to items.csv.
  // -----------------------------------------------------------------------
  function pairTrialData(row, ctx) {
    var isCatch = (row.trial_type === 'catch');
    return {
      block:             'pairs',
      phase:             ctx.phase,            // practice | main
      block_position:    ctx.position,         // 1 | 2
      episode:           ctx.episode,          // derealization | ordinary | expectation
      block_trial:       row.trial,            // trial number within the block (list's `trial`)
      list_trial_type:   row.trial_type,       // the list's trial_type — see header
      pair_type:         row.pair_type,
      analysed:          row.analysed,
      item_id:           row.item_id,
      list_id:           row.list_id,
      set:               row.set,
      order:             row.order,
      repeat_of:         row.repeat_of,        // consistency rows: block-local trial number
      repeat_of_item:    row.repeat_of_item,   // consistency rows: the original's item_id
      is_catch:          isCatch,
      catch_mode:        row.catch_mode,
      catch_target:      null,                 // set on catch rows
      catch_correct:     null,                 // set on catch rows
      images_shown:      !(isCatch && row.catch_mode === 'no_images'),
      scene_id:          row.scene_id,
      category:          row.category,
      a_is_left:         row.a_is_left,
      left_path:         row.left_path,
      right_path:        row.right_path,
      file_a:            row.file_a,
      file_b:            row.file_b,
      couple:            row.couple,
      pred_sat:          row.pred_sat,
      pred_fog:          row.pred_fog,
      d_sat:             row.d_sat,
      d_fog:             row.d_fog,
      z_sat:             row.z_sat,
      z_fog:             row.z_fog,
      mag_bin:           row.mag_bin,
      N_corpus:          row.N_corpus,
      N_orig:            row.N_orig,
      includes_original: row.includes_original,
      display_px:        CONFIG.display.image_px,
      // Practice display, set by pairs.js on practice rows; these defaults
      // stand on main and catch rows.
      practice_feedback: false,              // feedback screen after this trial
      feedback_display:  '',                 // 'chosen_only' | 'outline' | ''
      arrows_shown:      false,              // arrow keys under the images
    };
  }

  // -----------------------------------------------------------------------
  // After an image trial: the side, and the chosen IMAGE (A or B) from the
  // side and a_is_left. rt is jsPsych's, in milliseconds from the onset of
  // the pair. There is no time limit, so no_response should never be true;
  // it is recorded so that a key-handling fault would show.
  // -----------------------------------------------------------------------
  function finishPairTrial(data) {
    data.response_key  = data.response;             // raw, as jsPsych gave it
    data.response_side = keyToSide(data.response);
    data.no_response   = (data.response_side === null);
    if (data.response_side === null || typeof data.a_is_left !== 'boolean') {
      data.chosen = null;
    } else {
      var leftIsA = data.a_is_left;
      data.chosen = ((data.response_side === 'left') === leftIsA) ? 'A' : 'B';
    }
  }

  // -----------------------------------------------------------------------
  // After a catch trial: the single keypress scored against the target
  // (design.json, by block position). No image is chosen: chosen is null.
  // rt is from the end of the lockout. A left or right press
  // (catch_pressed_side) means the trained side-choosing response fired
  // without reading.
  // -----------------------------------------------------------------------
  function finishCatchTrial(data) {
    var pressed = (data.response === null || data.response === undefined)
      ? null : String(data.response).toLowerCase();
    var target  = String(data.catch_target).toLowerCase();

    data.response_key       = data.response;
    data.response_side      = keyToSide(data.response);
    data.chosen             = null;
    data.catch_correct      = (pressed === target);
    data.no_response        = (pressed === null);
    data.catch_pressed_side = (data.response_side !== null);

    var p = data.block_position;
    if (_catchFail[p] === null) { _catchFail[p] = 0; _catchShown[p] = 0; }
    _catchShown[p] += 1;
    if (!data.catch_correct) _catchFail[p] += 1;
  }

  // -----------------------------------------------------------------------
  // Filename for the uploaded file:
  //     <participant_id>_<stimulus_set>_<session start, Japan time>.csv
  //     e.g. R_9rJJWk01c767jE8_v5c_180_2026-11-30T14-12-40.csv
  // -----------------------------------------------------------------------
  function sessionFilename(participantId) {
    var set = Loader.stimulusSet();
    return participantId + '_' + set + '_' + sessionStamp() + '.csv';
  }

  return {
    stampSessionStart: stampSessionStart,
    stampParticipant:  stampParticipant,
    stampSessionEnd:   stampSessionEnd,
    keyToSide:         keyToSide,
    stampWordRatings:  stampWordRatings,
    pairTrialData:     pairTrialData,
    finishPairTrial:   finishPairTrial,
    finishCatchTrial:  finishCatchTrial,
    markBlockStart:    markBlockStart,
    markBlockEnd:      markBlockEnd,
    markRest:          markRest,
    sessionFilename:   sessionFilename,
    sessionStamp:      sessionStamp,
    sessionStartISO:   sessionStartISO,
    markTaskStart:     markTaskStart,
    markTaskEnd:       markTaskEnd,
  };
})();
