/* =========================================================================
 * progress.js: saving progress in the browser, resuming after a reload,
 * the completion record and the "Leave this page?" dialog.
 *
 * WHY
 * ---
 * A reload or a closed tab used to lose the whole session. The page now
 * keeps its progress and every response in the browser (localStorage), so
 * opening the same link again in the same browser continues the session.
 * Nothing is sent anywhere: the stored copy only lets this browser carry
 * on, and it is deleted when the final screen appears.
 *
 * THE SESSION KEY
 * ---------------
 * mode (index / dev) | experiment name | experiment version | package |
 * group | slot | participant ID from the link (empty when the ID was
 * typed). A link opened with other values starts normally. A link without
 * an ID finds the record by the other values and takes the ID from it.
 *
 * WHAT IS STORED (all under the session key)
 *   |r|<n>   each data row, as it is written (session-level columns are
 *            left out: they are restored from the checkpoint)
 *   |cp      the latest RESTART POINT: the index of the timeline node to
 *            continue from, the number of rows recorded before it, the
 *            session-level columns, and the state the later screens
 *            depend on (registered by the modules: participant ID, episode
 *            answers, catch counts, word order, ...)
 *   |m       where the session is now and when it last saved, the time
 *            the page was left (pagehide), the rest's elapsed time
 *   |log     the segment number, the interruptions so far, whether the
 *            contact upload succeeded, and (dev.html) the dev settings
 *
 * RESTART POINTS are set by main.js (Progress.tag): at the start of each
 * part (consent, participant details, full screen, set-up, brightness,
 * calibration, the episode questions, each block's preload and
 * reinstatement, the end of each practice, every main trial, every break,
 * the rest, the word ratings, the CDS items, the saving step). A main
 * trial's response node ADVANCES the restart point to the next trial, so a
 * trial already answered is never shown again. On resume, rows recorded
 * after the restart point (a screen that is started again) are dropped and
 * listed in restarted_screens.
 *
 * STORAGE UNAVAILABLE (blocked, or a write fails): the study runs
 * normally without resuming; resume_available = false is recorded, and a
 * failure during the session is stamped as resume_storage_error.
 *
 * COMPLETION RECORD: dpdr.completed|<experiment name>|<participant ID>,
 * written when the final screen appears (saved, or the failure screen).
 * index.html then shows only the completion message for that ID.
 * ========================================================================= */

var Progress = (function () {

  var PREFIX      = 'dpdr.progress|';
  var DONE_PREFIX = 'dpdr.completed|';

  var _available = null;     // storage works
  var _key       = null;     // session key (without PREFIX)
  var _jsPsych   = null;
  var _meta      = [];       // per top-level node: { kind, cp, advance, position }
  var _modules   = {};       // name -> { save: fn, restore: fn }
  var _lastCp    = -1;       // index of the latest restart point
  var _refreshIdx = -1;      // a restart point to take again when its node starts
  var _segment   = 0;
  var _indexOffset = 0;      // first trial_index of this segment
  var _log       = null;     // { segment, resumes: [], contact: {}, config }
  var _resume    = null;     // the stored record being resumed, or null
  var _guardOn   = false;
  var _restResume = null;    // ms of rest already elapsed, on resume at the rest
  var _failed    = false;

  // -----------------------------------------------------------------------
  // Storage helpers. Every access is guarded: a failure switches resuming
  // off for the rest of the session.
  // -----------------------------------------------------------------------
  function _ls() {
    try { return window.localStorage; } catch (e) { return null; }
  }

  function available() {
    if (_available !== null) return _available;
    var ls = _ls();
    try {
      if (!ls) throw new Error('no localStorage');
      ls.setItem('dpdr.test', '1');
      if (ls.getItem('dpdr.test') !== '1') throw new Error('read back failed');
      ls.removeItem('dpdr.test');
      _available = true;
    } catch (e) {
      _available = false;
      console.warn('[Progress] Browser storage unavailable; no resuming.', e);
    }
    return _available;
  }

  function _get(k) {
    if (!available()) return null;
    try {
      var v = _ls().getItem(k);
      return v === null ? null : JSON.parse(v);
    } catch (e) { return null; }
  }

  function _set(k, v) {
    if (!available() || _failed) return false;
    try {
      _ls().setItem(k, JSON.stringify(v));
      return true;
    } catch (e) {
      _fail(e);
      return false;
    }
  }

  function _remove(k) {
    try { if (_ls()) _ls().removeItem(k); } catch (e) { /* ignore */ }
  }

  // Every stored key that starts with `start`.
  function _keys(start) {
    var out = [];
    var ls = _ls();
    if (!ls) return out;
    try {
      for (var i = 0; i < ls.length; i++) {
        var k = ls.key(i);
        if (k && k.indexOf(start) === 0) out.push(k);
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  function _k(part) { return PREFIX + _key + '|' + part; }

  // A write failed (quota, storage blocked mid-session): stop using
  // storage, delete what this session stored, and record it.
  function _fail(err) {
    if (_failed) return;
    _failed = true;
    console.warn('[Progress] A write to browser storage failed; resuming is off ' +
                 'for this session.', err);
    if (_key) _keys(PREFIX + _key + '|').forEach(_remove);
    if (_jsPsych) {
      _jsPsych.data.addProperties({
        resume_available:     false,
        resume_storage_error: new Date().toISOString(),
      });
    }
  }

  function _active() { return !!(_key && available() && !_failed); }

  // -----------------------------------------------------------------------
  // The session key.
  // -----------------------------------------------------------------------
  function sessionKey(pidFromLink) {
    return [window.DEV_MODE ? 'dev' : 'index',
            CONFIG.experiment.name, CONFIG.experiment.version,
            Loader.stimulusSet(), Loader.group(), Loader.slot(),
            pidFromLink || ''].join('|');
  }

  // Look for an unfinished session for this link. Returns the stored
  // record { cp, m, log } or null.
  function find(key) {
    if (!available()) return null;
    var cp = _get(PREFIX + key + '|cp');
    var log = _get(PREFIX + key + '|log');
    if (!cp || !log) return null;
    return { key: key, cp: cp, m: _get(PREFIX + key + '|m') || {}, log: log };
  }

  // Delete the stored progress of one link (or of this session).
  function clear(key) {
    _keys(PREFIX + (key || _key) + '|').forEach(_remove);
  }

  // -----------------------------------------------------------------------
  // Modules register what later screens depend on, so a resumed session
  // has the same participant ID, episode words, catch counts, word order...
  // -----------------------------------------------------------------------
  function register(name, save, restore) {
    _modules[name] = { save: save, restore: restore };
  }

  function _saveModules() {
    var out = {};
    for (var n in _modules) {
      if (!Object.prototype.hasOwnProperty.call(_modules, n)) continue;
      try { out[n] = _modules[n].save(); } catch (e) { out[n] = null; }
    }
    return out;
  }

  function _restoreModules(mods) {
    for (var n in _modules) {
      if (!Object.prototype.hasOwnProperty.call(_modules, n)) continue;
      if (mods && mods[n] !== undefined && mods[n] !== null) {
        try { _modules[n].restore(mods[n]); } catch (e) {
          console.warn('[Progress] could not restore ' + n, e);
        }
      }
    }
  }

  // -----------------------------------------------------------------------
  // Timeline metadata, set by main.js. `meta` per top-level node:
  //   kind      what the node belongs to (consent, screen, id, ..., main)
  //   cp        a restart point
  //   advance   after this node's row, the next trial is the restart point
  //   position  block position, for nodes inside a block
  // -----------------------------------------------------------------------
  function tag(node, meta) {
    node._pidx = _meta.length;
    _meta.push(meta);
    return node;
  }

  function meta(i) { return _meta[i]; }
  function metaList() { return _meta; }

  // -----------------------------------------------------------------------
  // Starting: a new session, or resuming a stored one.
  // -----------------------------------------------------------------------
  function start(jsPsych, key, resume, devConfig) {
    _jsPsych = jsPsych;
    _key = key;
    _resume = resume || null;
    if (!available()) return;

    if (!_resume) {
      clear(key);
      _segment = 0;
      _log = { segment: 0, resumes: [], contact: null, config: devConfig || null,
               created_at: new Date().toISOString() };
      _set(_k('log'), _log);
      return;
    }

    // Resuming: restore the modules, the rows and the session columns.
    _log = _resume.log;
    _segment = (_log.segment || 0) + 1;
    _log.segment = _segment;
    var cp = _resume.cp;
    _restoreModules(cp.mods);

    var dropped = [];
    var maxIndex = -1;
    var rows = [];
    for (var n = 0; ; n++) {
      var row = _get(_k('r|' + n));
      if (!row) break;
      if (n < cp.rowsAt) {
        rows.push(row);
        if (typeof row.trial_index === 'number' && row.trial_index > maxIndex) {
          maxIndex = row.trial_index;
        }
      } else {
        dropped.push(_describeRow(row));
        _remove(_k('r|' + n));
      }
    }
    rows.forEach(function (r) { jsPsych.data.get().push(r); });
    jsPsych.data.addProperties(cp.props || {});
    // trial_index continues across segments. jsPsych finds a trial's own
    // row by its trial_index, so the new segment must not reuse the
    // indices of the restored rows: its counter starts after them.
    _indexOffset = maxIndex + 1;
    jsPsych.global_trial_index = _indexOffset;
    _lastCp = cp.idx;
    _refreshIdx = cp.idx;

    var m = _resume.m || {};
    if (cp.kind === 'rest' && typeof m.rest_elapsed_ms === 'number') {
      _restResume = { elapsed: m.rest_elapsed_ms, start: m.rest_start || null };
    }

    // A fresh "where the session is" record for this segment.
    _set(_k('m'), {});

    // The interruption being resumed (completed when Continue is pressed).
    _resume.entry = {
      resume_n:                    _segment,
      interrupted_at:              m.last_saved_at || cp.at || null,
      left_page_at:                m.left_at || null,
      resumed_at:                  null,
      gap_seconds:                 null,
      interrupted_phase:           (m.cur && m.cur.kind) || cp.kind || null,
      interrupted_block:           (m.cur && m.cur.block) || null,
      interrupted_block_position:  (m.cur && m.cur.position) || null,
      interrupted_trial:           (m.cur && m.cur.trial) || null,
      resumed_from:                cp.kind,
      restarted_screens:           dropped.join('|'),
      contact_saved_before_resume: _log.contact ? !!_log.contact.saved : null,
    };
    _set(_k('log'), _log);
  }

  function _describeRow(r) {
    var s = r.block || r.calibration_step || r.trial_type || '?';
    if (r.episode && (r.block === 'episode' || r.block === 'reinstate')) s += ':' + r.episode;
    if (r.item_id) s += ':' + r.item_id;
    return s;
  }

  function resuming()  { return !!_resume; }
  function segment()   { return _segment; }
  function resumeKind() { return _resume ? _resume.cp.kind : null; }
  function resumeIndex() { return _resume ? _resume.cp.idx : -1; }
  function resumeEntry() { return _resume ? _resume.entry : null; }
  function storedConfig() { return _resume && _resume.log ? _resume.log.config : null; }

  // The resume screen's Continue: complete the interruption record, stamp
  // the session columns, and make the resume row part of the restart point
  // (so a second interruption keeps it).
  function confirmResume(data) {
    if (!_resume) return;
    var e = _resume.entry;
    var now = new Date();
    e.resumed_at = now.toISOString();
    e.gap_seconds = e.interrupted_at
      ? Math.round((now.getTime() - Date.parse(e.interrupted_at)) / 1000) : null;
    for (var k in e) if (Object.prototype.hasOwnProperty.call(e, k)) data[k] = e[k];
    data.block = 'resume';
    _log.resumes.push(e);
    var total = 0;
    _log.resumes.forEach(function (x) { total += (x.gap_seconds || 0); });
    _jsPsych.data.addProperties({
      resume_count:       _log.resumes.length,
      resume_gap_total_s: total,
    });
    _set(_k('log'), _log);
  }

  // Called after the resume row is written: it joins the restart point.
  function _keepResumeRow() {
    var cp = _get(_k('cp'));
    if (!cp) return;
    cp.rowsAt = _jsPsych.data.get().count();
    cp.props  = _jsPsych.data.dataProperties ? Object.assign({}, _jsPsych.data.dataProperties) : cp.props;
    _set(_k('cp'), cp);
  }

  // -----------------------------------------------------------------------
  // jsPsych hooks (main.js passes them to initJsPsych).
  // -----------------------------------------------------------------------
  function _checkpoint(idx, kind) {
    if (!_active()) return;
    var cp = {
      idx:    idx,
      kind:   kind,
      rowsAt: _jsPsych.data.get().count(),
      props:  Object.assign({}, _jsPsych.data.dataProperties || {}),
      mods:   _saveModules(),
      at:     new Date().toISOString(),
    };
    _lastCp = idx;
    _set(_k('cp'), cp);
  }

  function onTrialStart(trial) {
    if (!_active()) return;
    var idx = trial && trial._pidx;
    if (typeof idx !== 'number') return;
    var mt = _meta[idx] || {};
    // A restart point is taken when its node starts. It is taken again when
    // the node starts after an answered trial moved the restart point to it
    // (so the trial's blank is kept) or after a resume (so the resume screen,
    // full screen and the reinstatement screen are kept).
    if (mt.cp && (idx !== _lastCp || idx === _refreshIdx)) {
      _refreshIdx = -1;
      _checkpoint(idx, mt.kind);
    }
    var d = (trial && typeof trial.data === 'object' && trial.data) || {};
    var m = _get(_k('m')) || {};
    m.cur = { idx: idx, kind: mt.kind || null, block: d.block || null,
              position: d.block_position || mt.position || null,
              trial: (typeof d.block_trial === 'number') ? d.block_trial : null };
    _set(_k('m'), m);
  }

  function onDataUpdate(row) {
    row.segment = _segment;
    if (!_active()) return;
    var n = _jsPsych.data.get().count() - 1;
    var props = _jsPsych.data.dataProperties || {};
    var slim = {};
    for (var k in row) {
      if (Object.prototype.hasOwnProperty.call(row, k) &&
          !Object.prototype.hasOwnProperty.call(props, k)) slim[k] = row[k];
    }
    _set(_k('r|' + n), slim);
    var m = _get(_k('m')) || {};
    m.last_saved_at = new Date().toISOString();
    _set(_k('m'), m);

    if (row.block === 'resume') _keepResumeRow();

    // A main trial answered: continue with what follows it.
    var cur = _jsPsych.getCurrentTrial();
    var idx = cur && cur._pidx;
    if (typeof idx === 'number' && _meta[idx] && _meta[idx].advance) {
      var j = idx + 1;
      while (j < _meta.length && _meta[j].kind === 'tail') j++;
      if (j < _meta.length) {
        _checkpoint(j, _meta[j].kind);
        _refreshIdx = j;
      }
    }
  }

  // The rest screen reports its elapsed time every second (and when it
  // started, so a resumed rest keeps rest_start).
  function restHeartbeat(elapsedMs, startISO) {
    if (!_active()) return;
    var m = _get(_k('m')) || {};
    m.rest_elapsed_ms = elapsedMs;
    if (startISO) m.rest_start = startISO;
    _set(_k('m'), m);
  }

  // On resume at the rest: { elapsed: ms already spent, start: ISO } (once).
  function takeRestElapsed() {
    var v = _restResume;
    _restResume = null;
    return v;
  }

  // The contact (name/email) upload succeeded: remembered, so a resumed
  // session never uploads it twice.
  function noteContact(saved, filename) {
    if (!_active() || !_log) return;
    _log.contact = { saved: !!saved, filename: filename || null,
                     at: new Date().toISOString() };
    _set(_k('log'), _log);
  }

  function contactSavedBefore() {
    return !!(_log && _log.contact && _log.contact.saved);
  }

  function _pagehide() {
    if (!_active()) return;
    var m = _get(_k('m')) || {};
    m.left_at = new Date().toISOString();
    _set(_k('m'), m);
  }

  // -----------------------------------------------------------------------
  // The "Leave this page?" dialog: on from the consent screen until the
  // final screen (or a screen that ends the session early).
  // -----------------------------------------------------------------------
  function _beforeunload(e) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }

  function guard(on) {
    if (on && !_guardOn) window.addEventListener('beforeunload', _beforeunload);
    if (!on && _guardOn) window.removeEventListener('beforeunload', _beforeunload);
    _guardOn = !!on;
  }

  function guardOn() { return _guardOn; }

  // -----------------------------------------------------------------------
  // Completion records.
  // -----------------------------------------------------------------------
  function _doneKey(pid) { return DONE_PREFIX + CONFIG.experiment.name + '|' + pid; }

  function isCompleted(pid) {
    if (!pid || !available()) return false;
    return !!_get(_doneKey(pid));
  }

  // The final screen appeared: delete the stored progress, store the
  // completion record (when there is a participant ID), switch the dialog
  // off.
  function complete(pid, outcome) {
    guard(false);
    if (_key) clear(_key);
    if (pid && available()) {
      try {
        _ls().setItem(_doneKey(pid), JSON.stringify({
          at: new Date().toISOString(), outcome: outcome || null,
          dev: !!window.DEV_MODE,
        }));
      } catch (e) { /* nothing more to do */ }
    }
    _key = null;
  }

  // The session ended early (consent declined): nothing to resume.
  function abandon() {
    guard(false);
    if (_key) clear(_key);
    _key = null;
  }

  // dev.html: everything this origin stores for the study.
  function listAll() {
    return { progress: _keys(PREFIX).filter(function (k) { return /\|log$/.test(k); })
                                    .map(function (k) { return k.slice(PREFIX.length, -4); }),
             completed: _keys(DONE_PREFIX).map(function (k) { return k.slice(DONE_PREFIX.length); }) };
  }

  function clearAll() {
    _keys(PREFIX).concat(_keys(DONE_PREFIX)).forEach(_remove);
  }

  window.addEventListener('pagehide', _pagehide);

  return {
    available:          available,
    sessionKey:         sessionKey,
    find:               find,
    clear:              clear,
    register:           register,
    tag:                tag,
    meta:               meta,
    metaList:           metaList,
    start:              start,
    resuming:           resuming,
    segment:            segment,
    resumeKind:         resumeKind,
    resumeIndex:        resumeIndex,
    resumeEntry:        resumeEntry,
    storedConfig:       storedConfig,
    confirmResume:      confirmResume,
    onTrialStart:       onTrialStart,
    onDataUpdate:       onDataUpdate,
    restHeartbeat:      restHeartbeat,
    takeRestElapsed:    takeRestElapsed,
    noteContact:        noteContact,
    contactSavedBefore: contactSavedBefore,
    guard:              guard,
    guardOn:            guardOn,
    isCompleted:        isCompleted,
    complete:           complete,
    abandon:            abandon,
    listAll:            listAll,
    clearAll:           clearAll,
  };
})();
