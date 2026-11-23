/* =========================================================================
 * main.js — assembles the timeline and runs it.
 *
 * Before anything: the GROUP and the SLOT must come from the link
 * (?group=participant|control and ?slot=<n>). Without a valid group, a
 * valid slot, or an assignment row for them, the session does not start;
 * it shows the "incomplete link" screen and nothing is recorded.
 *
 * A session, the same for both groups (each step has its own switch in
 * config.js):
 *    1. consent                      phases/consent.js     blocks.consent
 *       "I do not agree" ends the session here, nothing uploaded.
 *    2. full screen + window check   calibration/screen-check.js
 *       a window too small for the trial layout STOPS the session here,
 *       before the ID screen, so nothing is uploaded.
 *       On Pavlovia the Pavlovia session is opened only after this step.
 *    3. participant ID (+ optional name/email)
 *       -> the background image download (all of preload.json, block 1's
 *          images first) starts after this screen
 *    4. set-up screen, brightness    calibration/setup.js,
 *                                    calibration/brightness-confirmation.js
 *    5. gamma matching               calibration/gamma.js
 *    6. episode selection            phases/episodes.js    blocks.episodes
 *    7. block 1                      phases/pairs.js (+ the reinstatement
 *                                    screen from phases/episodes.js)
 *    8. rest, 1 minute               phases/rest.js        blocks.rest
 *    9. block 2                      as block 1
 *   10. word ratings                 phases/words.js       blocks.words
 *   11. CDS items (4, trait format)  phases/cds.js         blocks.cds
 *   12. save  (DataPipe / Pavlovia / local download), by Platform.name()
 *   13. completion screen, showing whether the upload succeeded
 *
 * Each block: preload gate, reinstatement, practice (3 trials with
 * feedback), 200 main trials with breaks after 40, 80, 120 and 160.
 * blocks.positions ([1, 2]) says which blocks run; dev.html may run one.
 *
 * Session-level stamps on every row: experiment, group, slot and the
 * assignment row, interview_date, display, consent_given, participant_id /
 * is_test, the episode answers, block and rest times, catch failures per
 * block, the target word ratings, the closing stamps.
 * ========================================================================= */

/* global CONFIG, ParticipantID, Record, PairsPhase, WordsPhase, RestPhase,
          ConsentPhase, EpisodesPhase, CdsPhase,
          ScreenCheck, BrightnessConfirmation, GammaCalibration,
          Loader, Validate, DevMenu, Platform, TEXT_EN, TEXT_JA,
          initJsPsych, jsPsychHtmlKeyboardResponse, jsPsychSurveyText,
          jsPsychCallFunction, jsPsychFullscreen, jsPsychPreload,
          jsPsychHtmlButtonResponse, jsPsychSurveyLikert, jsPsychSurveyHtmlForm,
          jsPsychPipe, jsPsychPavlovia */

// NOTE: there is deliberately no on_finish here. The completion screen
// waits for the participant to close the page, so the timeline never
// finishes and an on_finish would never run. Local-mode saving is done by
// an explicit node in _buildSaveNodes() instead.
// The hooks save progress in the browser after every screen and trial and
// number the rows across segments (progress.js).
var jsPsych = initJsPsych({
  on_trial_start: function (trial) { Progress.onTrialStart(trial); },
  on_data_update: function (data) { Progress.onDataUpdate(data); },
});

// Holds whatever the save step reports back, so the completion screen can
// show it.
// status: 'saved' | 'queued' | 'failed' — DataPipe, see ParticipantID.pipeStatus()
//         'pavlovia' — Pavlovia confirmed the upload (experiment RUNNING)
//         'pilot'    — Pavlovia pilot run: the CSV was downloaded to this
//                      computer instead, nothing is stored on Pavlovia
var UPLOAD_RESULT = { attempted: false, success: null, status: null, detail: '' };

// What Pavlovia said when the session was opened.
//   status  the experiment's status ('RUNNING', 'PILOTING', ...)
//   pilot   true for a pilot run (?__pilotToken= in the link, or the
//           experiment not RUNNING): the plugin then downloads the CSV
//           instead of storing it on Pavlovia.
var PAVLOVIA = { opened: false, status: null, pilot: null, error: '' };

function _describe(x) {
  if (x instanceof Error) return x.name + ': ' + x.message;
  try { return JSON.stringify(x); } catch (e) { return String(x); }
}

// ---------------------------------------------------------------------------
// Pavlovia init node: opens the Pavlovia session (and the "leave this
// page?" warning). Placed AFTER consent and the window check, so a
// participant who declines or is stopped there never opens a session.
// If it fails, the session carries on and the save step reports the
// failure, so the participant can still download their responses.
// ---------------------------------------------------------------------------
function _buildPavloviaInit() {
  if (Platform.name() !== 'pavlovia') return [];
  return [{
    type: jsPsychPavlovia,
    command: 'init',
    setPavloviaInfo: function (info) {
      var session = (info && info.session) || {};
      PAVLOVIA.opened = true;
      PAVLOVIA.status = session.status || null;
      PAVLOVIA.pilot  = Platform.isPavloviaPilotLink() ||
                        PAVLOVIA.status !== 'RUNNING';
      console.log('[Pavlovia] Session opened (status ' + PAVLOVIA.status +
                  (PAVLOVIA.pilot ? ', PILOT: the CSV will be downloaded, ' +
                                    'not stored on Pavlovia' : '') + ').', info);
    },
    errorCallback: function (error) {
      PAVLOVIA.error = _describe(error);
      console.error('[Pavlovia] Could not open a session:', error);
    },
    data: { block: 'pavlovia_init' },
  }];
}

// ---------------------------------------------------------------------------
// Save nodes.
//
// 'github'   -> DataPipe upload (DataPipe stores the file on Zenodo)
// 'pavlovia' -> Pavlovia finish command
// 'local'    -> a node below downloads the CSV to the participant's computer
// ---------------------------------------------------------------------------
function _buildSaveNodes() {
  var nodes = [];

  // Closing stamps, applied to every row before the data is serialised.
  nodes.push({
    type: jsPsychCallFunction,
    func: function () {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(function () {});
      }
      Record.stampSessionEnd(jsPsych, {
        viewport_width_end:  window.innerWidth,
        viewport_height_end: window.innerHeight,
        // Whether the separate name/email upload succeeded. null when
        // nothing was given, in local mode, or if it had not returned yet.
        contact_saved:       ParticipantID.contactSaved(),
        // The name the response file is saved under (with _resumed<n>
        // when the session was resumed at this saving step).
        data_filename:       Record.dataFilename(ParticipantID.get()),
      });
    },
  });

  var platform = Platform.name();

  // Local mode: nothing is uploaded, so the CSV is downloaded here, BEFORE
  // the completion screen (which never ends by itself).
  if (platform === 'local') {
    nodes.push({
      type: jsPsychCallFunction,
      func: function () {
        var filename = Record.dataFilename(ParticipantID.get());
        jsPsych.data.get().localSave('csv', filename);
        if (CONFIG.debug) console.log('[Data] local CSV saved: ' + filename);
      },
    });
  }

  if (platform === 'github' && typeof jsPsychPipe === 'undefined') {
    // The DataPipe plugin did not load (e.g. unpkg.com unreachable).
    // Report a failed upload, so the completion screen offers the
    // download-and-email fallback instead of the session stalling here.
    nodes.push({
      type: jsPsychCallFunction,
      func: function () {
        UPLOAD_RESULT.attempted = true;
        UPLOAD_RESULT.success   = false;
        UPLOAD_RESULT.status    = 'failed';
        UPLOAD_RESULT.detail    = 'DataPipe plugin not loaded';
        console.error('[DataPipe] plugin not loaded — nothing uploaded.');
      },
    });

  } else if (platform === 'github') {
    nodes.push({
      type:          jsPsychPipe,
      action:        'save',
      experiment_id: CONFIG.datapipe.experiment_id,
      filename:      function () {
        return Record.dataFilename(ParticipantID.get());
      },
      data_string:   function () { return jsPsych.data.get().csv(); },
      // Shown while the file uploads. Replaces the plugin's English default
      // so the Japanese version is covered, and says plainly not to close
      // the page — closing it now is how a session gets lost.
      wait_message:  Loader.text().end.saving,
      on_finish: function (data) {
        // Do NOT trust data.success: the plugin reports a network failure
        // as success (it returns the Error object, which has no .error
        // field). Success is judged from DataPipe's own reply instead.
        UPLOAD_RESULT.attempted = true;
        UPLOAD_RESULT.status    = ParticipantID.pipeStatus(data.result);
        UPLOAD_RESULT.success   = (UPLOAD_RESULT.status !== 'failed');
        try {
          UPLOAD_RESULT.detail = JSON.stringify(data);
        } catch (e) {
          UPLOAD_RESULT.detail = String(data);
        }
        console.log('[DataPipe] Response:', data);
      },
    });

  } else if (platform === 'pavlovia') {
    nodes.push({
      type: jsPsychPavlovia,
      command: 'finish',
      // Pavlovia names the file <project>_<participantId>_SESSION_<date>.csv.
      // participantId carries the same ID, set and Japan-time stamp as the
      // DataPipe file name, e.g. R_xxx_v5c_180_2026-11-30T14-12-40.
      participantId: function () {
        return Record.dataFilename(ParticipantID.get())
                     .replace(/\.csv$/, '');
      },
      dataFilter: function (data) { return data; },
      // The plugin shows its own English "Please wait..." while uploading.
      // Replace it with the same saving screen as on GitHub, in the
      // participant's language. (The plugin writes its message as soon as
      // the upload starts; this runs straight after.)
      on_start: function () {
        setTimeout(function () {
          if (document.getElementById('pavlovia-data-upload')) {
            jsPsych.getDisplayElement().innerHTML = Loader.text().end.saving;
          }
        }, 0);
      },
      completedCallback: function () {
        UPLOAD_RESULT.attempted = true;
        UPLOAD_RESULT.success   = true;
        UPLOAD_RESULT.status    = PAVLOVIA.pilot ? 'pilot' : 'pavlovia';
        console.log(PAVLOVIA.pilot
          ? '[Pavlovia] Pilot run: the CSV was downloaded to this computer, ' +
            'not stored on Pavlovia.'
          : '[Pavlovia] Data uploaded and session closed.');
      },
      // Any failure (no session, upload refused, network): the completion
      // screen offers the download-and-email fallback.
      errorCallback: function (error) {
        UPLOAD_RESULT.attempted = true;
        UPLOAD_RESULT.success   = false;
        UPLOAD_RESULT.status    = 'failed';
        UPLOAD_RESULT.detail    = _describe(error);
        console.error('[Pavlovia] Saving failed:', error);
      },
    });
  }

  return nodes;
}

// ---------------------------------------------------------------------------
// Completion screen.
//
// Three outcomes, all in the participant's language:
//
//   saved     — thanks, confirmation the responses were saved (no contact
//               sentence)
//   failed    — the upload did not go through: a button downloads the CSV so
//               the participant can email it, rather than the session being
//               lost silently
//   local     — dev/local mode: same as saved (the CSV was downloaded)
//
// In debug mode a box underneath reports the upload details. Set
// CONFIG.debug = false before recruiting and participants never see it.
// ---------------------------------------------------------------------------
function _contactHTML() {
  var c = CONFIG.researcher_contact || '';
  if (/^[^@\s]+@[^@\s]+$/.test(c)) {
    return '<a href="mailto:' + c + '">' + c + '</a>';
  }
  return c;
}

// Debug wording for an upload outcome.
function _statusHTML(status) {
  if (status === 'pavlovia') return '<span class="ok">SAVED on Pavlovia &mdash; ' +
                                    'in the project\'s data/ folder</span>';
  if (status === 'pilot')  return '<span class="ok">PILOTING &mdash; file downloaded ' +
                                  'to this computer, not stored on Pavlovia</span>';
  if (status === 'saved')  return '<span class="ok">SAVED &mdash; on Zenodo now</span>';
  if (status === 'queued') return '<span class="ok">RECEIVED by DataPipe &mdash; ' +
                                  'Zenodo upload pending, DataPipe retries automatically. ' +
                                  'Check Zenodo in a few minutes.</span>';
  if (status === 'failed') return '<span class="fail">FAILED</span>';
  return '<code>not attempted</code> (no name/email given, or still running)';
}

function _buildCompletionNode() {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: 'NO_KEYS',
    stimulus: function () {
      var E = Loader.text().end;
      var contact = _contactHTML();
      var platform = Platform.name();
      var failed = (platform !== 'local') &&
                   !(UPLOAD_RESULT.attempted && UPLOAD_RESULT.success);
      var html;

      if (failed) {
        html = '<div class="card end-card"><h2>' + E.fail_title + '</h2>' +
               E.fail_body.replace(/\{CONTACT\}/g, contact) +
               '<p><button id="end-download" class="calib-btn">' +
               E.fail_button + '</button></p>' +
               '<p id="end-download-done" class="hint" style="display:none">' +
               E.fail_done + '</p>';
      } else {
        // No contact sentence on the thank-you screen; the failure screen
        // keeps the contact address.
        html = '<div class="card end-card"><h2>' + E.title + '</h2>' + E.body;
      }

      if (CONFIG.debug) {
        html += '<hr><div class="debug-box">';
        html += '<p><b>Debug — not shown to participants</b></p>';
        html += '<p>Platform: <code>' + platform + '</code> (setting <code>' +
                CONFIG.platform + '</code>), libraries: <code>' +
                Platform.libraries() + '</code></p>';
        html += '<p>Participant: <code>' +
                (ParticipantID.get() || 'none') + '</code>' +
                (ParticipantID.isSuperuser() ? ' (test session)' : '') + '</p>';
        if (Platform.contactStorage() === 'results_file') {
          html += '<p>Name/email: kept in the response file ' +
                  '(contact_storage <code>results_file</code>), nothing sent ' +
                  'to DataPipe.</p>';
        } else {
          html += '<p>Contact upload (to ' + CONFIG.contact_datapipe.experiment_id +
                  '): ' + _statusHTML(ParticipantID.contactStatus()) + '</p>';
        }
        if (ParticipantID.contactReply()) {
          html += '<pre>' + ParticipantID.contactReply()
                    .replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>';
        }

        if (platform === 'pavlovia') {
          html += '<p>Pavlovia session: ' + (PAVLOVIA.opened
                    ? 'opened, experiment status <code>' + PAVLOVIA.status + '</code>'
                    : '<span class="fail">NOT opened</span>') + '</p>';
          if (PAVLOVIA.error) {
            html += '<pre>' + PAVLOVIA.error.replace(/&/g, '&amp;')
                                            .replace(/</g, '&lt;') + '</pre>';
          }
        }

        if (platform === 'local') {
          html += '<p>Local mode — CSV downloaded, nothing uploaded.</p>';
        } else if (!UPLOAD_RESULT.attempted) {
          html += '<p class="fail">No upload was attempted.</p>';
        } else if (UPLOAD_RESULT.success) {
          html += '<p>' + (platform === 'pavlovia' ? 'Responses' :
                  'Responses upload (to ' + CONFIG.datapipe.experiment_id + ')') +
                  ': ' + _statusHTML(UPLOAD_RESULT.status) + '</p>';
        } else if (platform === 'pavlovia') {
          html += '<p class="fail">Saving to Pavlovia FAILED. Check that the ' +
                  'experiment is RUNNING (or PILOTING) on Pavlovia, that it ' +
                  'has credits or a licence, and that config.json was ' +
                  'created when it was activated.</p>';
        } else {
          html += '<p class="fail">Upload FAILED. Check that ' +
                  '&ldquo;Enable data collection&rdquo; is switched on for ' +
                  'experiment <code>' + CONFIG.datapipe.experiment_id +
                  '</code> on the DataPipe dashboard.</p>';
        }
        if (UPLOAD_RESULT.detail) {
          html += '<pre>' + UPLOAD_RESULT.detail.replace(/&/g, '&amp;')
                                                .replace(/</g, '&lt;') + '</pre>';
        }
        html += '</div>';
      }

      return html + '</div>';
    },
    on_load: function () {
      // The final screen: no more "Leave this page?" dialog; the stored
      // progress is deleted and this ID is recorded as having completed.
      var platform = Platform.name();
      var failed = (platform !== 'local') &&
                   !(UPLOAD_RESULT.attempted && UPLOAD_RESULT.success);
      Progress.complete(ParticipantID.get(), failed ? 'failed' : 'saved');
      var btn = document.getElementById('end-download');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var filename = Record.dataFilename(ParticipantID.get());
        jsPsych.data.get().localSave('csv', filename);
        var done = document.getElementById('end-download-done');
        if (done) done.style.display = 'block';
      });
    },
  };
}

// ---------------------------------------------------------------------------
// "Incomplete link": no valid ?group= or ?slot=. The same kind of message
// as a missing participant ID. Nothing is recorded or uploaded.
// ---------------------------------------------------------------------------
function _runIncompleteLink(reason) {
  var L = Loader.text().link;
  console.warn('[Main] ' + reason + ' — session not started.');
  jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div class="card"><h2>' + L.missing_title + '</h2>' +
              L.missing_body + '</div>',
    choices: 'NO_KEYS',
    data: { block: 'link_incomplete' },
  }]);
}

// ---------------------------------------------------------------------------
// This ID has already completed the study in this browser (index.html): the
// completion message and nothing else. Nothing is recorded or uploaded.
// ---------------------------------------------------------------------------
function _completedScreen() {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      return '<div class="card end-card">' + Loader.text().session.completed + '</div>';
    },
    choices: 'NO_KEYS',
    data: { block: 'already_completed' },
    on_load: function () { Progress.abandon(); },
  };
}

// ---------------------------------------------------------------------------
// The screen that opens a resumed session. Only Continue is offered.
// ---------------------------------------------------------------------------
function _resumeScreen() {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      var S = Loader.text().session;
      return '<div class="card"><h2>' + S.resume_title + '</h2>' +
             S.resume_body + S.reload_warning + '</div>';
    },
    choices: function () { return [Loader.text().session.resume_button]; },
    data: { block: 'resume' },
    on_start: function () { Progress.guard(true); },
    on_finish: function (data) { Progress.confirmResume(data); },
  };
}

// The settings dev.html may change, stored with the progress so a dev
// session resumes with the same ones.
function _devConfig() {
  return JSON.parse(JSON.stringify({
    blocks: CONFIG.blocks, calibration: CONFIG.calibration,
    limits: CONFIG.limits || null, platform: CONFIG.platform, dev: CONFIG.dev || null,
  }));
}

// ---------------------------------------------------------------------------
// Start the image download in the BACKGROUND. Does not block: the
// participant carries on with calibration and the episode screens while
// the images arrive. Every image in preload.json (both blocks), block 1's
// first. Each block's preload gate then waits for whatever is still
// missing. A shortened dev run downloads only what its blocks show.
// ---------------------------------------------------------------------------
function _buildBackgroundPreload(positions) {
  return {
    type: jsPsychCallFunction,
    func: function () {
      try {
        var urls = [];
        if (CONFIG.blocks.practice || CONFIG.blocks.main) {
          var L = Loader.limits();
          if (L.max_trials > 0 || L.max_practice > 0) {
            positions.forEach(function (p) {
              urls = urls.concat(Loader.blockImageURLs(Loader.block(p)));
            });
          } else {
            urls = Loader.preloadURLs();
          }
        }
        if (urls.length) jsPsych.pluginAPI.preloadImages(urls);
        if (CONFIG.debug) {
          console.log('[Preload] background download started (' +
                      urls.length + ' images).');
        }
      } catch (e) {
        console.warn('[Preload] background start failed; the gates will ' +
                     'download them instead.', e);
      }
    },
  };
}

// Which block positions run. Always [1, 2] on index.html; dev.html may
// run one alone (validate.js refuses anything else on index.html).
function _positions() {
  if (!window.DEV_MODE) return [1, 2];
  var p = (CONFIG.blocks && CONFIG.blocks.positions) || [1, 2];
  return [1, 2].filter(function (x) { return p.indexOf(x) !== -1; });
}

// ---------------------------------------------------------------------------
// Build and run.
// ---------------------------------------------------------------------------
function runExperiment(opts) {
  var timeline = [];

  // Panels are a fixed size unless scaling is explicitly permitted.
  if (CONFIG.display.allow_scaling) {
    document.body.classList.add('allow-scaling');
  }

  // Arrow keys scroll the page by default. There is nothing to scroll in
  // fullscreen, but suppressing it removes any chance of the screen
  // shifting under the participant mid-trial. Text fields are exempt so
  // the ID entry still behaves normally.
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  }, false);

  // No valid group or slot in the link: do not start.
  if (!Loader.group()) {
    _runIncompleteLink('?group= is missing or invalid (expected one of ' +
                       CONFIG.groups.join(', ') + ')');
    return;
  }
  if (!Loader.slot()) {
    _runIncompleteLink('?slot= is missing or not a whole number of 1 or more');
    return;
  }
  if (!Loader.assignment()) {
    _runIncompleteLink('no assignment row for group ' + Loader.group() +
                       ', slot ' + Loader.slot());
    return;
  }

  var positions = _positions();
  var lim = Loader.limits();
  var shortened = (lim.max_trials > 0 || lim.max_practice > 0);

  // --- Completion check and resuming (progress.js) -------------------------
  // index.html: an ID from the link that has completed the study in this
  // browser sees only the completion message. (A typed ID is checked on
  // the ID screen.)
  var linkPid = ParticipantID.fromURL();
  if (!window.DEV_MODE && linkPid && Progress.isCompleted(linkPid)) {
    console.log('[Progress] ' + linkPid + ' has already completed the study.');
    jsPsych.run([_completedScreen()]);
    return;
  }

  // An unfinished session for this link? index.html resumes it; dev.html
  // only when its menu says so (opts.resume).
  var key = Progress.sessionKey(linkPid);
  var stored = (window.DEV_MODE && !(opts && opts.resume)) ? null : Progress.find(key);
  Progress.register('participant', ParticipantID.state, ParticipantID.restore);
  Progress.register('episodes', EpisodesPhase.state, EpisodesPhase.restore);
  Progress.register('record', Record.state, Record.restore);
  Progress.register('words', WordsPhase.state, WordsPhase.restore);
  // Restores the modules and the rows, before the timeline is built.
  Progress.start(jsPsych, key, stored, window.DEV_MODE ? _devConfig() : null);

  // Each top-level node is tagged (Progress.tag): which part it belongs to,
  // and whether it is a restart point.
  function add(nodes, kind, firstIsCp) {
    (nodes || []).forEach(function (n, i) {
      var meta = n._res || { kind: kind, cp: !!(firstIsCp && i === 0) };
      delete n._res;
      timeline.push(Progress.tag(n, meta));
    });
  }

  // Session properties, stamped first so they reach every row (jsPsych's
  // addProperties also covers rows recorded later).
  add([{
    type: jsPsychCallFunction,
    func: function () {
      Record.stampSessionStart(jsPsych);
      // Mark anything started from dev.html, or shortened, so it can never
      // be mistaken for a real session.
      jsPsych.data.addProperties({
        is_dev:       !!window.DEV_MODE || shortened,
        shortened:    shortened,
        shortened_to: shortened ? (lim.max_trials || null) : null,
        shortened_practice_to: shortened ? (lim.max_practice || null) : null,
        positions_run: positions.join(','),
        // Resuming: whether browser storage works, and the interruptions.
        resume_available:   Progress.available(),
        resume_count:       0,
        resume_gap_total_s: 0,
      });
      // "Leave this page?" from the consent screen until the final screen.
      Progress.guard(true);
    },
  }], 'start');

  // 1. Consent. Declining ends the session here with nothing uploaded.
  if (CONFIG.blocks.consent) add(ConsentPhase.buildNodes(jsPsych), 'consent', true);

  // 2. Full screen, window check (hard stop), and the dev size check.
  //    Before the ID screen, so a stopped participant has uploaded nothing.
  add(ScreenCheck.buildNodes(jsPsych), 'screen', true);

  // Pavlovia only: open the Pavlovia session now — after consent and the
  // window check, so neither a decline nor a stop opens one.
  add(_buildPavloviaInit(), 'pavlovia');

  // 3. Participant ID, then (index.html) the completion check for a typed
  // ID, then stamp it.
  add(ParticipantID.buildNodes(jsPsych), 'id', true);
  add([{
    timeline: [_completedScreen()],
    conditional_function: function () { return ParticipantID.alreadyCompleted(); },
  }], 'id');
  add([{
    type: jsPsychCallFunction,
    func: function () {
      Record.stampParticipant(jsPsych, ParticipantID.get(),
                              ParticipantID.isSuperuser());
    },
  }], 'id');

  // Start downloading the stimuli in the background, early, so they are
  // usually cached by the time each block needs them.
  add([_buildBackgroundPreload(positions)], 'preload_bg');

  // 4-5. Set-up screen, then display calibration. Order matters:
  // brightness before gamma, because the gamma match is judged by eye and
  // a dimmed screen would bias it.
  if (CONFIG.calibration.setup) add(SetupScreen.getNodes(jsPsych), 'setup', true);
  if (CONFIG.calibration.brightness) {
    add(BrightnessConfirmation.getNodes(jsPsych), 'brightness', true);
  }
  if (CONFIG.calibration.gamma) add(GammaCalibration.getNodes(jsPsych), 'gamma', true);

  // 6. Episode selection: the identifying words and recall questions for
  // each recalled episode, and (controls) the description of derealization
  // for the expectation block.
  if (CONFIG.blocks.episodes) add(EpisodesPhase.buildNodes(jsPsych), 'episodes', true);

  // 7-9. Block 1, the rest, block 2. The block nodes carry their own
  // tags (pairs.js).
  positions.forEach(function (p, i) {
    if (i > 0 && CONFIG.blocks.rest) add(RestPhase.buildNodes(jsPsych), 'rest', true);
    var b = Loader.block(p);
    add(PairsPhase.buildBlockNodes(jsPsych, b, EpisodesPhase.reinstateNodes(jsPsych, b)),
        'block');
  });
  // A rest-only dev run (no block positions, rest on).
  if (!positions.length && CONFIG.blocks.rest) {
    add(RestPhase.buildNodes(jsPsych), 'rest', true);
  }

  // 10. Word ratings, once, after block 2.
  if (CONFIG.blocks.words) add(WordsPhase.buildNodes(jsPsych), 'words', true);

  // 11. CDS items.
  if (CONFIG.blocks.cds) add(CdsPhase.buildNodes(jsPsych), 'cds', true);

  // 12-13. Save and completion.
  add(_buildSaveNodes(), 'save', true);
  add([_buildCompletionNode()], 'end');

  if (!Progress.resuming()) {
    jsPsych.run(timeline);
    return;
  }
  jsPsych.run(_resumedTimeline(timeline, positions));
}

// ---------------------------------------------------------------------------
// The timeline of a resumed session: the resume screen, full screen and the
// window check again, (Pavlovia) a new Pavlovia session, the image
// download, then the session from its restart point. Inside a block, the
// block's preload gate first and, before a practice-end screen or a main
// trial, the reinstatement screen.
//
//   restart point            continues with
//   consent                  consent (then everything as at the start)
//   full screen ... gamma    that part again from its first screen
//   episodes                 the episode questions from the first screen
//   reinstate (practice)     [gate] reinstatement, practice from the start
//   practice_end             [gate, reinstatement] the practice-end screen
//   main trial               [gate, reinstatement] that trial
//   break                    [gate] that break screen
//   rest                     the rest, with the time that remained
//   words / cds              that part from its first screen
//   save                     the saving step (file name _resumed<n>); no
//                            full screen
// ---------------------------------------------------------------------------
function _resumedTimeline(full, positions) {
  var c    = Progress.resumeIndex();
  var meta = Progress.metaList();
  var kind = (meta[c] || {}).kind;
  var first = function (k) {
    for (var i = 0; i < meta.length; i++) if (meta[i].kind === k) return i;
    return -1;
  };
  var out  = [_resumeScreen()];
  var from = full.slice(c);
  var screenAt = first('screen');

  if (kind === 'save') {
    if (first('pavlovia') !== -1) out = out.concat(_buildPavloviaInit());
    return out.concat(from);
  }

  if (screenAt !== -1 && c > screenAt) {
    out = out.concat(ScreenCheck.buildNodes(jsPsych));
    var pav = first('pavlovia');
    if (pav !== -1 && pav < c) out = out.concat(_buildPavloviaInit());
    var bg = first('preload_bg');
    if (bg !== -1 && bg < c) out.push(_buildBackgroundPreload(positions));
    from = from.filter(function (n) {
      var k = (meta[n._pidx] || {}).kind;
      return k !== 'screen' && k !== 'pavlovia' && k !== 'preload_bg';
    });
  }

  var p = (meta[c] || {}).position;
  if (p && ['reinstate', 'practice_end', 'main', 'break'].indexOf(kind) !== -1) {
    var b = Loader.block(p);
    out = out.concat(PairsPhase.gateNodes(b));
    if (kind === 'practice_end' || kind === 'main') {
      out = out.concat(EpisodesPhase.reinstateNodes(jsPsych, b));
    }
  }
  console.log('[Progress] Resuming at node ' + c + ' (' + kind + '), segment ' +
              Progress.segment() + '.');
  return out.concat(from);
}

// ---------------------------------------------------------------------------
// Fatal error screen — shown when the data files cannot be loaded at all.
// ---------------------------------------------------------------------------
function _showFatal(message) {
  var T = (typeof TEXT_EN !== 'undefined') ? TEXT_EN : null;
  var title = T ? T.error.title : 'An error has occurred';
  var body  = T ? T.error.body  : '<p>The study could not start.</p>';
  var html  = '<div class="card"><h2>' + title + '</h2>' + body;
  if (CONFIG.debug && message) {
    html += '<div class="debug-box"><pre>' + message + '</pre></div>';
  }
  html += '</div>';
  document.body.innerHTML =
    '<div class="jspsych-display-element"><div>' + html + '</div></div>';
  console.error('[Fatal] ' + message);
}

// ---------------------------------------------------------------------------
// Entry point.
//
// Data files are loaded and validated BEFORE the timeline is built, so a
// broken trial list stops the session at the first screen rather than
// producing grey boxes partway through.
// ---------------------------------------------------------------------------
Loader.loadAll()
  .then(function (data) {
    var result = Validate.run(data);
    if (CONFIG.debug) Validate.report(result);

    if (!result.ok) {
      if (CONFIG.debug) {
        document.body.innerHTML =
          '<div class="jspsych-display-element"><div>' +
          Validate.toHTML(result) + '</div></div>';
      } else {
        _showFatal('Validation failed: ' + result.errors.join(' | '));
      }
      return;
    }

    // dev.html sets window.DEV_MODE and loads dev-menu.js. index.html does
    // neither, so a participant can never reach the menu.
    if (window.DEV_MODE && typeof DevMenu !== 'undefined') {
      DevMenu.show(result.summary, runExperiment);
      return;
    }
    runExperiment();
  })
  .catch(function (err) {
    _showFatal(err && err.message ? err.message : String(err));
  });
