/* =========================================================================
 * loader.js — fetches the package, reads the link parameters, and exposes
 * the active text set.
 *
 * Reads, for the active package (v5b_180):
 *   data/sets/<set>/design.json       the design: counts, groups and their
 *                                     episodes, lists, practice files, catch
 *                                     targets per block position, breaks
 *   data/sets/<set>/assignment.json   per group, 64 slots, each naming for
 *                                     block positions 1 and 2 the episode,
 *                                     the set, the list and the practice file
 *   data/sets/<set>/lists/<list>.json all 8 lists (1.4 MB together), so
 *                                     validate.js can check the whole
 *                                     package; the session uses the two its
 *                                     slot names
 *   data/sets/<set>/practice/block1.json, block2.json
 *   data/sets/<set>/preload.json      every image a list or practice row
 *                                     shows (catch rows show none)
 *
 * The package is a FROZEN copy of the registered package. Nothing here (or
 * anywhere) reorders, resamples or rewrites it: each list is presented in
 * file order, with the sides it gives.
 *
 * The active package comes from CONFIG.data.set, or from ?set=<name> in
 * the URL, which overrides it (only names in available_sets).
 *
 * LINK PARAMETERS read here, so every module sees the same values:
 *   ?lang=en|ja           language (overrides CONFIG.language)
 *   ?group=participant|control
 *                         REQUIRED. Missing or invalid -> group() is null and
 *                         main.js shows the "incomplete link" screen.
 *   ?slot=<n>             REQUIRED. A whole number, 1 or more. Missing or
 *                         invalid -> slot() is null, "incomplete link".
 *                         Slot n uses row ((n - 1) mod 64) + 1 of the group's
 *                         table in assignment.json.
 *   ?idate=YYYY-MM-DD     optional interview date; invalid -> ''.
 *   ?pid=...              read by participant-id.js.
 *
 * FILE:// DOES NOT WORK
 * ---------------------
 * fetch() cannot read local files when the page is opened directly from
 * disk — browsers treat file:// as a cross-origin request and block it.
 * To test locally, serve the folder over HTTP:
 *
 *     cd /path/to/repo && python3 -m http.server 8000
 *     then open http://localhost:8000/
 * ========================================================================= */

var Loader = (function () {

  var _data = {
    design:     null,   // design.json
    assignment: null,   // assignment.json
    lists:      {},     // list id -> rows, for every list in design.lists
    practice:   {},     // practice file path ('practice/block1.json') -> rows
    preload:    null,   // preload.json, a list of paths
  };

  function _param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  // -----------------------------------------------------------------------
  // Active package. A name not in CONFIG.data.available_sets is rejected
  // HERE, before any fetch, with a message naming the valid ones.
  // -----------------------------------------------------------------------
  function _activeSet() {
    var override = _param('set');
    var name = override || CONFIG.data.set;
    var known = CONFIG.data.available_sets || [];

    if (known.indexOf(name) === -1) {
      throw new Error(
        'Unknown stimulus set "' + name + '"' +
        (override ? ' (from ?set= in the URL)' : ' (from CONFIG.data.set)') +
        '. Available sets: ' + known.join(', ') + '.'
      );
    }
    return name;
  }

  function stimulusSet() { return _activeSet(); }

  function _setDir() {
    return CONFIG.data.sets_dir + _activeSet() + '/';
  }

  // -----------------------------------------------------------------------
  // Language and text.
  // -----------------------------------------------------------------------
  function _activeLanguage() {
    var lang = _param('lang') || CONFIG.language || 'en';
    return (lang === 'ja') ? 'ja' : 'en';
  }
  function text()     { return (_activeLanguage() === 'ja') ? TEXT_JA : TEXT_EN; }
  function words()    { return (_activeLanguage() === 'ja') ? WORDS_JA : WORDS_EN; }
  function language() { return _activeLanguage(); }

  // -----------------------------------------------------------------------
  // Group, from ?group=. Exact match against CONFIG.groups; anything else
  // is null, and main.js refuses to start. Deliberately no default.
  // -----------------------------------------------------------------------
  function group() {
    var g = _param('group');
    return (g && (CONFIG.groups || []).indexOf(g) !== -1) ? g : null;
  }

  // Pick the active group's version of a group-dependent string. Plain
  // strings pass through.
  function byGroup(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      var g = group();
      return (g && value[g] !== undefined) ? value[g] : '';
    }
    return value;
  }

  // Pick one episode's version of an episode-dependent string
  // ('derealization' / 'ordinary' / 'expectation'). Plain strings pass
  // through.
  function byEpisode(value, episode) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return (value[episode] !== undefined) ? value[episode] : '';
    }
    return value;
  }

  // -----------------------------------------------------------------------
  // Slot, from ?slot=. Only a plain whole number of 1 or more is valid:
  // '0', '-3', '2.5', '1e2', '+4', 'abc' and a missing slot are all null,
  // and main.js refuses to start ("incomplete link").
  // -----------------------------------------------------------------------
  function slot() {
    var raw = _param('slot');
    if (raw === null) return null;
    raw = raw.trim();
    if (!/^[0-9]+$/.test(raw)) return null;
    var n = parseInt(raw, 10);
    return (n >= 1 && n <= Number.MAX_SAFE_INTEGER) ? n : null;
  }

  // Slot n -> row ((n - 1) mod rows) + 1 of the group's table.
  function assignmentRowNumber(n) {
    var per = (_data.assignment && _data.assignment.slots_per_group) ||
              (_data.design && _data.design.assignment &&
               _data.design.assignment.slots_per_group);
    if (!n || !per) return null;
    return ((n - 1) % per) + 1;
  }

  // The group's assignment row for this session's slot, or null.
  function assignment() {
    var g = group(), n = slot();
    if (!g || !n || !_data.assignment) return null;
    var rowNo = assignmentRowNumber(n);
    var table = (_data.assignment.groups || {})[g] || [];
    for (var i = 0; i < table.length; i++) {
      if (table[i].slot === rowNo) return table[i];
    }
    return null;
  }

  // -----------------------------------------------------------------------
  // Interview date, from ?idate=YYYY-MM-DD. Must be a real calendar date.
  // '' when absent or invalid.
  // -----------------------------------------------------------------------
  function interviewDate() {
    var raw = _param('idate');
    if (!raw) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
    if (m) {
      var y = +m[1], mo = +m[2], d = +m[3];
      var dt = new Date(Date.UTC(y, mo - 1, d));
      if (dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 &&
          dt.getUTCDate() === d) {
        return m[0];
      }
    }
    console.warn('[Loader] ?idate="' + raw + '" is not a valid YYYY-MM-DD ' +
                 'date — interview_date left empty.');
    return '';
  }

  // 'stimuli/xxx.png' -> 'data/sets/<set>/stimuli/xxx.png'. Case-sensitive
  // on GitHub Pages as on Linux.
  function imageURL(relativePath) {
    return _setDir() + relativePath;
  }

  // -----------------------------------------------------------------------
  // Fetch one JSON file, with a useful error if it is missing.
  // -----------------------------------------------------------------------
  function _fetchJSON(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) {
        throw new Error(
          'Could not load ' + path + ' (HTTP ' + response.status + '). ' +
          'Check the file exists and the path in CONFIG.data is correct.'
        );
      }
      return response.json();
    }).catch(function (err) {
      if (window.location.protocol === 'file:') {
        throw new Error(
          'Could not load ' + path + ' because the page was opened from ' +
          'disk (file://). Serve the folder over HTTP instead:\n\n' +
          '    python3 -m http.server 8000\n\n' +
          'then open http://localhost:8000/'
        );
      }
      throw err;
    });
  }

  // -----------------------------------------------------------------------
  // Load everything: design.json first (it names the other files), then
  // the assignment table, every list, both practice files and the preload
  // list, in parallel.
  // -----------------------------------------------------------------------
  function loadAll() {
    var dir;
    try {
      dir = _setDir();                 // throws on an unknown set name
    } catch (e) {
      return Promise.reject(e);
    }

    return _fetchJSON(dir + 'design.json').then(function (design) {
      _data.design = design;
      var listIds = Object.keys(design.lists || {});
      var practiceFiles = [];
      var P = design.practice || {};
      Object.keys(P).forEach(function (k) {
        if (practiceFiles.indexOf(P[k]) === -1) practiceFiles.push(P[k]);
      });
      var assignFile = (design.assignment && design.assignment.file) || 'assignment.json';

      return Promise.all([
        _fetchJSON(dir + assignFile),
        _fetchJSON(dir + 'preload.json'),
        Promise.all(listIds.map(function (id) {
          return _fetchJSON(dir + design.lists[id].file);
        })),
        Promise.all(practiceFiles.map(function (f) { return _fetchJSON(dir + f); })),
      ]).then(function (r) {
        _data.assignment = r[0];
        _data.preload    = r[1];
        _data.lists = {};
        listIds.forEach(function (id, i) { _data.lists[id] = r[2][i]; });
        _data.practice = {};
        practiceFiles.forEach(function (f, i) { _data.practice[f] = r[3][i]; });

        if (CONFIG.debug) {
          var a = assignment();
          console.log('[Loader] package "' + _activeSet() + '" (' +
                      (design.version || '?') + '): ' + listIds.length +
                      ' lists, ' + practiceFiles.length + ' practice files, ' +
                      (_data.preload || []).length + ' images; group = ' +
                      (group() || 'MISSING') + ', slot = ' + (slot() || 'MISSING') +
                      (a ? ' -> row ' + a.slot + ' (' + a.blocks.map(function (b) {
                        return b.position + ': ' + b.episode + '/' + b.list;
                      }).join(', ') + ')' : '') +
                      ', language = ' + _activeLanguage());
        }
        return _data;
      });
    });
  }

  // -----------------------------------------------------------------------
  // Accessors.
  // -----------------------------------------------------------------------
  function design()  { return _data.design; }
  function data()    { return _data; }
  function preload() { return _data.preload; }

  // The group's episodes, in the order design.json lists them.
  function episodes() {
    var g = group();
    var G = (_data.design && _data.design.groups) || {};
    return (g && G[g]) ? G[g].episodes.slice() : [];
  }

  // Practice settings for a block position. CONFIG.practice OVERRIDES
  // design.json (see config.js).
  function practiceCount(position) {
    var o = (CONFIG.practice && CONFIG.practice.trials_by_block_position) || {};
    if (o[position] !== undefined) return o[position];
    var d = (_data.design && _data.design.practice_by_block) || [];
    return d[position - 1];
  }
  function practiceFeedback(position) {
    var o = (CONFIG.practice && CONFIG.practice.feedback_by_block_position) || {};
    if (o[position] !== undefined) return !!o[position];
    var d = (_data.design && _data.design.practice_feedback_by_block_position) || {};
    return !!d[position];
  }

  // Catch targets for a block position, from design.json.
  function catchTargets(position) {
    var c = (_data.design && _data.design.catch) || {};
    return ((c.targets_by_block_position || {})[position] || []).slice();
  }

  // Break points (after these block-local trial numbers), from design.json.
  function breaksAfter() {
    var t = (_data.design && _data.design.timing) || {};
    return (t.breaks_after_trial || []).slice();
  }

  // -----------------------------------------------------------------------
  // One block of this session, by position (1 or 2):
  //   { position, episode, set, list, practiceFile,
  //     rows        the list's 200 main rows, in file order (shortened to
  //                 CONFIG.limits.max_trials on dev.html only)
  //     practice    the practice rows (first practiceCount(position) rows
  //                 of the file, shortened by max_practice on dev.html)
  //     feedback    practice feedback on/off
  //     targets     the catch targets, in order }
  // null when the session has no valid assignment row.
  // -----------------------------------------------------------------------
  function block(position) {
    var a = assignment();
    if (!a) return null;
    var b = null;
    for (var i = 0; i < a.blocks.length; i++) {
      if (a.blocks[i].position === position) b = a.blocks[i];
    }
    if (!b) return null;

    var rows = (_data.lists[b.list] || []).slice();
    var prac = (_data.practice[b.practice] || []).slice(0, practiceCount(position));
    var lim = limits();
    if (lim.max_trials   > 0) rows = rows.slice(0, lim.max_trials);
    if (lim.max_practice > 0) prac = prac.slice(0, lim.max_practice);

    return {
      position:     position,
      episode:      b.episode,
      set:          b.set,
      list:         b.list,
      practiceFile: b.practice,
      rows:         rows,
      fullLength:   (_data.lists[b.list] || []).length,
      practice:     prac,
      feedback:     practiceFeedback(position),
      targets:      catchTargets(position),
    };
  }

  // The test limits, honoured ONLY on dev.html. On index.html they are
  // always zero here (and validate.js refuses to start if they are set).
  function limits() {
    var L = CONFIG.limits || {};
    if (!window.DEV_MODE) return { max_trials: 0, max_practice: 0 };
    return { max_trials: L.max_trials || 0, max_practice: L.max_practice || 0 };
  }

  // The images a block shows: its practice and main rows, catch rows
  // excluded (they show no images). Absolute URLs.
  function blockImageURLs(b) {
    var seen = {}, out = [];
    b.practice.concat(b.rows).forEach(function (t) {
      if (t.catch_mode === 'no_images') return;
      [t.left_path, t.right_path].forEach(function (p) {
        var u = imageURL(p);
        if (!seen[u]) { seen[u] = true; out.push(u); }
      });
    });
    return out;
  }

  // Every image in preload.json, as URLs, block 1's first, so the images
  // needed first arrive first.
  function preloadURLs() {
    var first = [];
    var b1 = block(1);
    if (b1) first = blockImageURLs(b1);
    var seen = {};
    first.forEach(function (u) { seen[u] = true; });
    var rest = (_data.preload || []).map(imageURL).filter(function (u) { return !seen[u]; });
    return first.concat(rest);
  }

  return {
    loadAll:             loadAll,
    data:                data,
    design:              design,
    preload:             preload,
    preloadURLs:         preloadURLs,
    blockImageURLs:      blockImageURLs,
    imageURL:            imageURL,
    stimulusSet:         stimulusSet,
    text:                text,
    words:               words,
    language:            language,
    group:               group,
    byGroup:             byGroup,
    byEpisode:           byEpisode,
    slot:                slot,
    assignmentRowNumber: assignmentRowNumber,
    assignment:          assignment,
    episodes:            episodes,
    block:               block,
    practiceCount:       practiceCount,
    practiceFeedback:    practiceFeedback,
    catchTargets:        catchTargets,
    breaksAfter:         breaksAfter,
    limits:              limits,
    interviewDate:       interviewDate,
  };
})();
