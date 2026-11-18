/* =========================================================================
 * validate.js — preflight checks, run before anything is displayed.
 *
 * The point is to turn vague failures into specific ones. Without this, a
 * missing image is a grey box halfway through a session and you do not know
 * which file. With it, you get the filename before the experiment starts.
 *
 * In debug mode a full report is printed to the console and, if anything
 * failed, shown on screen instead of starting the study. In production a
 * failure shows a neutral error rather than running a broken session.
 *
 * The v5b package is registered and frozen, so departures from it are
 * ERRORS, not warnings. Three groups of checks, each a pure function so
 * tools/check_package.js can run the same code in Node:
 *
 *   checkPackage(pkg, cfg)   the package against design.json: every list
 *                            (200 rows: counts per type, 180 analysed, 15
 *                            consistency with repeat_of / repeat_of_item,
 *                            5 catch rows, catch_mode), the catch targets
 *                            per block position, the break points, both
 *                            practice files (and that each has at least as
 *                            many rows as config.js's practice override
 *                            asks for), every image of every list and
 *                            practice row in preload.json, and 64
 *                            assignment rows per group whose episodes,
 *                            lists, sets and practice files match the
 *                            group and the design, balanced over the 16
 *                            cells.
 *   checkText(texts, cfg, design, opts)
 *                            both languages have the same keys; every
 *                            group- and episode-dependent string exists in
 *                            both languages; only participants' text
 *                            mentions the interview; no visual words in the
 *                            English instructions; no placeholder left in
 *                            production.
 *   checkConfig(cfg, pkg, opts)
 *                            the practice override, the rest, the limits and
 *                            block positions (index.html refuses shortened
 *                            runs and single blocks), consent.
 *
 * run(data) adds the checks that need the browser: platform, libraries,
 * where name/email go.
 *
 * What is NOT checked in the browser: whether the image files exist on the
 * server (it would need ~640 requests). The preload gates report any that
 * 404, and tools/check_package.js checks every file on disk against
 * manifest.csv.
 * ========================================================================= */

var Validate = (function () {

  // Fields every list row must have (null is a valid value — "not
  // applicable" — but the key must be there).
  var LIST_FIELDS = [
    'trial', 'trial_type', 'analysed', 'scene_id', 'category',
    'left_path', 'right_path', 'a_is_left', 'pred_sat', 'pred_fog',
    'catch_mode', 'repeat_of', 'list_id', 'set', 'order', 'item_id',
    'repeat_of_item', 'pair_type',
  ];
  var ANALYSED_TYPES = ['sat_only', 'fog_only', 'together', 'conflict'];
  var MAIN_TYPES     = ANALYSED_TYPES.concat(['consistency', 'catch']);
  var EPISODES       = ['derealization', 'ordinary', 'expectation'];
  var CATCH_KEYS     = ['ArrowUp', 'ArrowDown'];

  // The word list. The ids become output columns (word_<id>) and must be
  // exactly these. The two targets are promoted to rating_foggy and
  // rating_faded by record.js.
  var EXPECTED_WORD_IDS = ['foggy', 'faded', 'veiled', 'lifeless', 'unreal',
                           'dreamlike', 'distant', 'like_a_picture',
                           'oppressive', 'threatening'];
  var TARGET_WORDS      = ['foggy', 'faded'];

  // State items: columns state_q02, state_q13, state_q19, state_q29.
  var EXPECTED_STATE_IDS = ['q02', 'q13', 'q19', 'q29'];

  // Blocks the registered design needs. Switching one off on index.html is
  // allowed (warning) but such a session is not a registered session.
  var REGISTERED_BLOCKS = ['consent', 'episodes', 'practice', 'main', 'rest',
                           'words', 'state'];

  // Instruction text must not describe the experience with visual words —
  // those are exactly what the word ratings and the images measure.
  var VISUAL_WORDS = /\b(fog|foggy|blur|blurred|blurry|faded|fade|dull|colou?rless|unreal|dream-?like|flat|veiled|veil|behind glass)\b/i;

  // Only participants were interviewed. A string mentioning the interview
  // must be one only participants see: keyed `participant`, or keyed
  // `derealization` (only participants have that episode).
  var INTERVIEW = /interview|面接|インタビュー/i;
  var INTERVIEW_OK_KEYS = ['participant', 'derealization'];

  // A bracketed gap such as [researcher names] or [TO COMPLETE after pilot].
  var PLACEHOLDER = /\[[^\]]+\]/;

  // -----------------------------------------------------------------------
  // Small helpers.
  // -----------------------------------------------------------------------
  function _pathSet(list) {
    var s = {};
    for (var i = 0; i < list.length; i++) s[list[i]] = true;
    return s;
  }

  function _keyPaths(obj, prefix, out) {
    out = out || [];
    prefix = prefix || '';
    for (var k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      var path = prefix ? prefix + '.' + k : k;
      if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
        _keyPaths(obj[k], path, out);
      } else {
        out.push(path);
      }
    }
    return out;
  }

  // Every string in an object (arrays included), with its path, skipping
  // the listed paths.
  function _strings(obj, prefix, skip, out) {
    out = out || [];
    for (var k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      var path = prefix ? prefix + '.' + k : k;
      if (skip.indexOf(path) !== -1) continue;
      var v = obj[k];
      if (typeof v === 'string') out.push({ path: path, value: v });
      else if (v && typeof v === 'object') _strings(v, path, skip, out);
    }
    return out;
  }

  function _get(obj, path) {
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (obj === null || obj === undefined) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }

  function _count(rows, key) {
    var c = {};
    rows.forEach(function (r) { c[r[key]] = (c[r[key]] || 0) + 1; });
    return c;
  }

  // The practice size and feedback for a block position: config.js's
  // override, else design.json.
  function _practiceCount(cfg, design, p) {
    var o = (cfg.practice && cfg.practice.trials_by_block_position) || {};
    if (o[p] !== undefined) return o[p];
    return (design.practice_by_block || [])[p - 1];
  }

  // =======================================================================
  // PACKAGE
  // pkg = { design, assignment, lists: {id: rows}, practice: {file: rows},
  //         preload: [paths] }
  // =======================================================================
  function checkPackage(pkg, cfg) {
    var errors = [], warnings = [];
    var D = pkg.design;
    if (!D || typeof D !== 'object') {
      errors.push('design.json did not load or is not an object.');
      return { errors: errors, warnings: warnings };
    }
    var C = D.counts_per_block || {};
    var N = D.main_trials_per_block;
    var preload = pkg.preload;

    // --- design.json itself ---------------------------------------------
    if (!(N > 0)) errors.push('design.json has no main_trials_per_block.');
    var sumTypes = MAIN_TYPES.reduce(function (a, t) { return a + (C[t] || 0); }, 0);
    if (sumTypes !== N) {
      errors.push('design.json counts_per_block add up to ' + sumTypes +
                  ', not main_trials_per_block (' + N + ').');
    }
    var sumAnalysed = ANALYSED_TYPES.reduce(function (a, t) { return a + (C[t] || 0); }, 0);
    if (sumAnalysed !== C.analysed) {
      errors.push('design.json: analysed (' + C.analysed + ') is not the sum of ' +
                  'the four analysed types (' + sumAnalysed + ').');
    }

    var groups = cfg.groups || [];
    var G = D.groups || {};
    if (Object.keys(G).sort().join(',') !== groups.slice().sort().join(',')) {
      errors.push('design.json groups (' + Object.keys(G).join(', ') + ') are not ' +
                  'CONFIG.groups (' + groups.join(', ') + ').');
    }
    groups.forEach(function (g) {
      var eps = (G[g] && G[g].episodes) || [];
      if (eps.length !== 2 || eps[0] === eps[1] ||
          eps.some(function (e) { return EPISODES.indexOf(e) === -1; })) {
        errors.push('design.json group "' + g + '" must list two different episodes ' +
                    'from ' + EPISODES.join(', ') + '; it lists ' + JSON.stringify(eps) + '.');
      }
    });

    // --- catch -----------------------------------------------------------
    var K = D.catch || {};
    var mode = cfg.catch_trials && cfg.catch_trials.mode;
    if (K.mode !== mode) {
      errors.push('design.json catch.mode is "' + K.mode + '" but this code ' +
                  'implements "' + mode + '".');
    }
    var targets = K.targets_by_block_position || {};
    [1, 2].forEach(function (p) {
      var t = targets[p];
      if (!Array.isArray(t)) {
        errors.push('design.json has no catch targets for block position ' + p + '.');
        return;
      }
      if (t.length !== C.catch) {
        errors.push('Block position ' + p + ' has ' + t.length + ' catch targets ' +
                    'for ' + C.catch + ' catch rows per block.');
      }
      var bad = t.filter(function (k) { return CATCH_KEYS.indexOf(k) === -1; });
      if (bad.length) {
        errors.push('Catch targets for block position ' + p + ' include ' +
                    bad.join(', ') + '; only ' + CATCH_KEYS.join(' / ') + ' are ' +
                    'allowed (a left/right target is met by the trained response).');
      }
    });

    // --- breaks ----------------------------------------------------------
    var T = D.timing || {};
    var br = T.breaks_after_trial;
    if (!Array.isArray(br) || !br.length) {
      errors.push('design.json has no timing.breaks_after_trial.');
    } else {
      for (var bi = 0; bi < br.length; bi++) {
        if (!(br[bi] > 0 && br[bi] < N) || (bi > 0 && br[bi] <= br[bi - 1])) {
          errors.push('design.json timing.breaks_after_trial must be increasing ' +
                      'trial numbers between 1 and ' + (N - 1) + ': ' + br.join(', '));
          break;
        }
      }
    }

    // --- preload ---------------------------------------------------------
    if (!Array.isArray(preload) || !preload.length) {
      errors.push('preload.json is empty or not a plain list of paths.');
      preload = [];
    }
    var preSet = _pathSet(preload);
    if (Object.keys(preSet).length !== preload.length) {
      errors.push('preload.json lists some paths more than once.');
    }
    var used = {};
    var notPreloaded = {};
    function shows(t) { return !(t.trial_type === 'catch' && t.catch_mode === 'no_images'); }
    function usesImages(t, where) {
      if (!shows(t)) return;
      [t.left_path, t.right_path].forEach(function (p) {
        used[p] = true;
        if (!preSet[p]) notPreloaded[p] = where;
      });
    }

    // --- lists -----------------------------------------------------------
    var listDefs = D.lists || {};
    var itemsBySet = {};
    Object.keys(listDefs).forEach(function (id) {
      var def = listDefs[id];
      var rows = (pkg.lists || {})[id];
      var tag = 'List ' + id;
      if (!Array.isArray(rows)) {
        errors.push(tag + ' (' + def.file + ') did not load.');
        return;
      }
      if (rows.length !== N || rows.length !== def.n) {
        errors.push(tag + ' has ' + rows.length + ' rows; design.json says ' +
                    def.n + ' (main_trials_per_block ' + N + ').');
      }

      var missing = {};
      rows.forEach(function (r) {
        LIST_FIELDS.forEach(function (f) {
          if (r[f] === undefined) missing[f] = (missing[f] || 0) + 1;
        });
      });
      Object.keys(missing).forEach(function (f) {
        errors.push(tag + ': field "' + f + '" missing on ' + missing[f] + ' rows.');
      });

      // Numbering: 1 .. n in file order (the presentation order).
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].trial !== i + 1) {
          errors.push(tag + ': row ' + (i + 1) + ' has trial ' + rows[i].trial +
                      '; lists are numbered 1..' + rows.length + ' in file order.');
          break;
        }
      }

      var wrongId = rows.filter(function (r) {
        return r.list_id !== id || r.set !== def.set || r.order !== def.order;
      });
      if (wrongId.length) {
        errors.push(tag + ': ' + wrongId.length + ' row(s) do not carry list_id ' + id +
                    ', set ' + def.set + ', order ' + def.order + '.');
      }

      // Counts per type.
      var counts = _count(rows, 'trial_type');
      MAIN_TYPES.forEach(function (t) {
        if ((counts[t] || 0) !== C[t]) {
          errors.push(tag + ': ' + (counts[t] || 0) + ' "' + t + '" rows; design.json ' +
                      'says ' + C[t] + '.');
        }
      });
      Object.keys(counts).forEach(function (t) {
        if (MAIN_TYPES.indexOf(t) === -1) {
          errors.push(tag + ': unknown trial_type "' + t + '" (' + counts[t] + ' rows).');
        }
      });
      var nAn = rows.filter(function (r) { return r.analysed === true; }).length;
      if (nAn !== C.analysed) {
        errors.push(tag + ': ' + nAn + ' analysed rows; design.json says ' + C.analysed + '.');
      }
      var badAn = rows.filter(function (r) {
        return r.analysed !== (ANALYSED_TYPES.indexOf(r.trial_type) !== -1);
      });
      if (badAn.length) {
        errors.push(tag + ': ' + badAn.length + ' row(s) have `analysed` inconsistent ' +
                    'with their type (e.g. trial ' + badAn[0].trial + ').');
      }
      var badPT = rows.filter(function (r) {
        return r.analysed === true && r.pair_type !== r.trial_type;
      });
      if (badPT.length) {
        errors.push(tag + ': ' + badPT.length + ' analysed row(s) have pair_type ' +
                    'different from trial_type.');
      }

      // item_id: present and unique within the list.
      var ids = {};
      rows.forEach(function (r) {
        if (!r.item_id) return;
        if (ids[r.item_id]) errors.push(tag + ': item_id ' + r.item_id + ' appears twice.');
        ids[r.item_id] = r;
      });
      var noId = rows.filter(function (r) { return !r.item_id; });
      if (noId.length) {
        errors.push(tag + ': ' + noId.length + ' row(s) have no item_id; responses ' +
                    'could not be joined to items.csv.');
      }
      var key = def.set;
      var itemKey = Object.keys(ids).sort().join(',');
      if (itemsBySet[key] === undefined) itemsBySet[key] = { list: id, items: itemKey };
      else if (itemsBySet[key].items !== itemKey) {
        errors.push(tag + ' does not hold the same items as ' + itemsBySet[key].list +
                    ' (same set ' + key + ', different order expected only).');
      }

      // a_is_left a real boolean.
      var badAIL = rows.filter(function (r) { return typeof r.a_is_left !== 'boolean'; });
      if (badAIL.length) {
        errors.push(tag + ': ' + badAIL.length + ' row(s) have a non-boolean a_is_left.');
      }

      // Catch rows.
      var catches = rows.filter(function (r) { return r.trial_type === 'catch'; });
      var wrongMode = catches.filter(function (r) { return r.catch_mode !== mode; });
      if (wrongMode.length) {
        errors.push(tag + ': ' + wrongMode.length + ' catch row(s) have catch_mode "' +
                    wrongMode[0].catch_mode + '", not "' + mode + '".');
      }
      var stray = rows.filter(function (r) {
        return r.trial_type !== 'catch' && r.catch_mode !== null;
      });
      if (stray.length) errors.push(tag + ': ' + stray.length + ' non-catch row(s) have a catch_mode.');
      [1, 2].forEach(function (p) {
        if (Array.isArray(targets[p]) && targets[p].length !== catches.length) {
          errors.push(tag + ' has ' + catches.length + ' catch rows but block position ' +
                      p + ' has ' + targets[p].length + ' targets.');
        }
      });

      // Consistency rows: repeat_of = the block-local trial number of an
      // EARLIER row showing the same pair; repeat_of_item = its item_id.
      var byNumber = {};
      rows.forEach(function (r) { byNumber[r.trial] = r; });
      var cons = rows.filter(function (r) { return r.trial_type === 'consistency'; });
      cons.forEach(function (r) {
        var o = byNumber[r.repeat_of];
        if (!o) {
          errors.push(tag + ' trial ' + r.trial + ': repeat_of ' + r.repeat_of +
                      ' is not a trial of this list.');
          return;
        }
        if (o.trial >= r.trial) {
          errors.push(tag + ' trial ' + r.trial + ' repeats trial ' + o.trial +
                      ', which is not earlier.');
        }
        var same = (r.left_path === o.left_path && r.right_path === o.right_path) ||
                   (r.left_path === o.right_path && r.right_path === o.left_path);
        if (!same) {
          errors.push(tag + ' trial ' + r.trial + ' does not show the same pair as ' +
                      'trial ' + o.trial + '.');
        }
        if (r.repeat_of_item !== o.item_id) {
          errors.push(tag + ' trial ' + r.trial + ': repeat_of_item ' + r.repeat_of_item +
                      ' is not the item_id of trial ' + o.trial + ' (' + o.item_id + ').');
        }
        if (r.pair_type !== o.pair_type) {
          errors.push(tag + ' trial ' + r.trial + ': pair_type differs from the original.');
        }
      });
      var byType = _count(cons, 'pair_type');
      var want = C.consistency_by_type || {};
      Object.keys(want).forEach(function (t) {
        if ((byType[t] || 0) !== want[t]) {
          errors.push(tag + ': ' + (byType[t] || 0) + ' consistency repeats of ' + t +
                      '; design.json says ' + want[t] + '.');
        }
      });
      var strayRep = rows.filter(function (r) {
        return r.trial_type !== 'consistency' &&
               (r.repeat_of !== null || r.repeat_of_item !== null);
      });
      if (strayRep.length) {
        errors.push(tag + ': ' + strayRep.length + ' non-consistency row(s) have a ' +
                    'repeat_of or repeat_of_item.');
      }

      rows.forEach(function (r) { usesImages(r, tag); });
    });

    // --- practice --------------------------------------------------------
    var P = D.practice || {};
    [1, 2].forEach(function (p) {
      var file = P[p];
      var rows = (pkg.practice || {})[file];
      var tag = 'Practice ' + file + ' (block position ' + p + ')';
      if (!file || !Array.isArray(rows)) {
        errors.push('design.json names no practice file for block position ' + p +
                    ', or it did not load.');
        return;
      }
      var designN = (D.practice_by_block || [])[p - 1];
      if (rows.length !== designN) {
        errors.push(tag + ' has ' + rows.length + ' rows; design.json ' +
                    'practice_by_block says ' + designN + '.');
      }
      var want = _practiceCount(cfg, D, p);
      if (!(want >= 1) || Math.floor(want) !== want) {
        errors.push('Practice trials for block position ' + p + ' must be a whole ' +
                    'number of 1 or more (config.js: practice), not ' + want + '.');
      } else if (rows.length < want) {
        errors.push(tag + ' has ' + rows.length + ' rows; config.js asks for ' + want + '.');
      }
      rows.forEach(function (r) {
        if (r.trial_type !== 'practice' || r.analysed !== false) {
          errors.push(tag + ' row ' + r.trial + ' is not an unanalysed practice row.');
        }
        if (typeof r.a_is_left !== 'boolean') {
          errors.push(tag + ' row ' + r.trial + ' has a non-boolean a_is_left.');
        }
        if (!r.item_id) errors.push(tag + ' row ' + r.trial + ' has no item_id.');
        usesImages(r, tag);
      });
    });

    var np = Object.keys(notPreloaded);
    if (np.length) {
      errors.push(np.length + ' image(s) shown by list or practice rows are not in ' +
                  'preload.json, e.g. ' + np.slice(0, 3).join(', ') + ' (' +
                  notPreloaded[np[0]] + ').');
    }
    var unused = preload.filter(function (p) { return !used[p]; });
    if (unused.length) {
      warnings.push(unused.length + ' image(s) in preload.json are never shown.');
    }

    // --- assignment ------------------------------------------------------
    var A = pkg.assignment || {};
    var per = A.slots_per_group;
    if (!(per > 0) || per !== (D.assignment || {}).slots_per_group) {
      errors.push('assignment.json slots_per_group is ' + per + '; design.json says ' +
                  (D.assignment || {}).slots_per_group + '.');
    }
    groups.forEach(function (g) {
      var table = (A.groups || {})[g];
      var eps = (G[g] && G[g].episodes) || [];
      var tag = 'Assignment, group ' + g;
      if (!Array.isArray(table)) {
        errors.push(tag + ': no table.');
        return;
      }
      if (table.length !== per) {
        errors.push(tag + ': ' + table.length + ' rows; ' + per + ' expected.');
      }
      var seen = {}, cells = {};
      table.forEach(function (row) {
        var rt = tag + ' row ' + row.slot;
        if (!(row.slot >= 1 && row.slot <= per) || seen[row.slot]) {
          errors.push(rt + ': slot number missing, out of range or repeated.');
        }
        seen[row.slot] = true;
        var b = row.blocks || [];
        if (b.length !== 2 || b[0].position !== 1 || b[1].position !== 2) {
          errors.push(rt + ': must have block positions 1 and 2, in that order.');
          return;
        }
        var rowEps = [b[0].episode, b[1].episode];
        if (rowEps.slice().sort().join(',') !== eps.slice().sort().join(',')) {
          errors.push(rt + ': episodes ' + rowEps.join(', ') + ' are not the group\'s (' +
                      eps.join(', ') + ').');
          return;
        }
        // block_order 0 = the group's first-listed episode first.
        if (b[0].episode !== eps[row.block_order]) {
          errors.push(rt + ': block_order ' + row.block_order + ' but block 1 is ' +
                      b[0].episode + '.');
        }
        // set_mapping 0 = set A with the first-listed episode.
        var firstEp = (b[0].episode === eps[0]) ? b[0] : b[1];
        if (firstEp.set !== (row.set_mapping === 0 ? 'A' : 'B')) {
          errors.push(rt + ': set_mapping ' + row.set_mapping + ' but ' + eps[0] +
                      ' uses set ' + firstEp.set + '.');
        }
        if (b[0].set === b[1].set) errors.push(rt + ': both blocks use set ' + b[0].set + '.');
        b.forEach(function (x) {
          var def = listDefs[x.list];
          if (!def) {
            errors.push(rt + ': list ' + x.list + ' is not in design.json.');
            return;
          }
          if (def.set !== x.set || def.order !== row.order) {
            errors.push(rt + ': list ' + x.list + ' is set ' + def.set + ' order ' +
                        def.order + ', but the row says set ' + x.set + ' order ' +
                        row.order + '.');
          }
          if (x.practice !== P[x.position]) {
            errors.push(rt + ': block position ' + x.position + ' uses practice ' +
                        x.practice + '; the practice file follows the block position (' +
                        P[x.position] + ').');
          }
        });
        var cell = row.block_order + '/' + row.set_mapping + '/' + row.order;
        cells[cell] = (cells[cell] || 0) + 1;
      });
      for (var s = 1; s <= per; s++) {
        if (!seen[s]) { errors.push(tag + ': no row for slot ' + s + '.'); break; }
      }
      var cv = Object.keys(cells).map(function (k) { return cells[k]; });
      if (cv.length && (Math.min.apply(null, cv) !== Math.max.apply(null, cv))) {
        errors.push(tag + ': the 64 rows are not balanced over block order x set ' +
                    'mapping x order (' + JSON.stringify(cells) + ').');
      }
    });

    return { errors: errors, warnings: warnings };
  }

  // =======================================================================
  // TEXT
  // texts = { TEXT_EN, TEXT_JA, WORDS_EN, WORDS_JA }
  // opts  = { production: bool, contactStorage: 'datapipe' | 'results_file' }
  // =======================================================================
  function checkText(texts, cfg, design, opts) {
    var errors = [], warnings = [];
    var TE = texts.TEXT_EN, TJ = texts.TEXT_JA, WE = texts.WORDS_EN, WJ = texts.WORDS_JA;
    opts = opts || {};

    // Same keys in both languages.
    [['TEXT', TE, TJ], ['WORDS', WE, WJ]].forEach(function (x) {
      if (!x[1] || !x[2]) {
        errors.push(x[0] + '_EN or ' + x[0] + '_JA did not load. Check the text/*/ ' +
                    'script tags.');
        return;
      }
      var en = _keyPaths(x[1]), ja = _keyPaths(x[2]);
      var noJa = en.filter(function (k) { return ja.indexOf(k) === -1; });
      var noEn = ja.filter(function (k) { return en.indexOf(k) === -1; });
      if (noJa.length) errors.push('Missing from ' + x[0] + '_JA: ' + noJa.join(', '));
      if (noEn.length) errors.push('Missing from ' + x[0] + '_EN: ' + noEn.join(', '));
    });
    if (!TE || !TJ || !WE || !WJ) return { errors: errors, warnings: warnings };

    var groups = cfg.groups || [];
    var G = (design && design.groups) || {};
    var langs = [['EN', TE, WE], ['JA', TJ, WJ]];

    function need(lang, name, v) {
      if (typeof v !== 'string' || !v.trim()) {
        errors.push(lang + ': ' + name + ' is missing or empty.');
      }
    }

    langs.forEach(function (L) {
      var lang = L[0], T = L[1], W = L[2];
      // Group-dependent: the episode screens (per group, one per episode of
      // the group) and the word-rating instruction and question.
      groups.forEach(function (g) {
        var eps = (G[g] && G[g].episodes) || [];
        eps.forEach(function (ep) {
          var s = _get(T, 'episodes.screens.' + g + '.' + ep) || {};
          need(lang, 'TEXT.episodes.screens.' + g + '.' + ep + '.title', s.title);
          need(lang, 'TEXT.episodes.screens.' + g + '.' + ep + '.body', s.body);
        });
        need(lang, 'WORDS.instruction.' + g, _get(W, 'instruction.' + g));
        need(lang, 'WORDS.question_short.' + g, _get(W, 'question_short.' + g));
      });
      // Episode-dependent: the question above the images and the
      // reinstatement screen, for every episode.
      EPISODES.forEach(function (ep) {
        need(lang, 'TEXT.prompt.main.' + ep, _get(T, 'prompt.main.' + ep));
        need(lang, 'TEXT.reinstate.body.' + ep, _get(T, 'reinstate.body.' + ep));
      });
      // The recalled episodes show the identifying words; the participant
      // word ratings name the derealization episode with them.
      ['derealization', 'ordinary'].forEach(function (ep) {
        var b = _get(T, 'reinstate.body.' + ep) || '';
        if (b.indexOf('{WORDS}') === -1) {
          errors.push(lang + ': TEXT.reinstate.body.' + ep + ' must show the ' +
                      'participant\'s identifying words ({WORDS}).');
        }
      });
      if (String(_get(W, 'instruction.participant') || '').indexOf('{WORDS}') === -1) {
        errors.push(lang + ': WORDS.instruction.participant must name the ' +
                    'derealization episode with the participant\'s words ({WORDS}).');
      }
      ['when', 'duration', 'where', 'tone', 'intensity'].forEach(function (q) {
        need(lang, 'TEXT.episodes.questions.' + q + '.label',
             _get(T, 'episodes.questions.' + q + '.label'));
      });
      need(lang, 'TEXT.practice.question_changed', _get(T, 'practice.question_changed'));
      if (String(_get(T, 'practice.question_changed') || '').indexOf('{QUESTION}') === -1) {
        errors.push(lang + ': TEXT.practice.question_changed must show the new ' +
                    'question ({QUESTION}).');
      }

      // The interview: participants only.
      _strings(T, 'TEXT', [], []).concat(_strings(W, 'WORDS', [], [])).forEach(function (s) {
        if (!INTERVIEW.test(s.value)) return;
        var segs = s.path.split('.');
        var ok = INTERVIEW_OK_KEYS.some(function (k) { return segs.indexOf(k) !== -1; });
        if (!ok) {
          errors.push(lang + ': ' + s.path + ' mentions the interview, but controls ' +
                      'can see it. Only participant / derealization text may.');
        }
      });
    });

    // Word lists.
    var idsEn = (WE.items || []).map(function (w) { return w.id; });
    var idsJa = (WJ.items || []).map(function (w) { return w.id; });
    if (idsEn.slice().sort().join(',') !== idsJa.slice().sort().join(',')) {
      errors.push('Word lists differ between languages. EN: ' + idsEn.join(', ') +
                  ' | JA: ' + idsJa.join(', '));
    }
    if (idsEn.slice().sort().join(',') !== EXPECTED_WORD_IDS.slice().sort().join(',')) {
      errors.push('Word ids are not the registered ten (' + EXPECTED_WORD_IDS.join(', ') +
                  '). Found: ' + idsEn.join(', '));
    }
    TARGET_WORDS.forEach(function (t) {
      if (idsEn.indexOf(t) === -1) errors.push('Target word "' + t + '" is missing.');
    });

    // State items: exactly the four, same ids in both languages.
    [['EN', TE], ['JA', TJ]].forEach(function (L) {
      var st = L[1].state;
      var ids = (st && Array.isArray(st.items)) ? st.items.map(function (x) { return x.id; }) : [];
      if (ids.join(',') !== EXPECTED_STATE_IDS.join(',')) {
        errors.push('TEXT_' + L[0] + '.state.items must be ' + EXPECTED_STATE_IDS.join(', ') +
                    ' in that order. Found: ' + (ids.join(', ') || 'none'));
      }
    });

    // Placeholders: any [bracketed gap] in any participant-facing string
    // (the consent text, the session length, the state items, ...). Only
    // the consent variant this platform shows is checked.
    var gaps = [];
    langs.forEach(function (L) {
      var unusedConsent = (opts.contactStorage === 'results_file')
                          ? 'TEXT.consent.body' : 'TEXT.consent.body_results_file';
      _strings(L[1], 'TEXT', [unusedConsent], [])
        .concat(_strings(L[2], 'WORDS', [], []))
        .forEach(function (s) {
          if (PLACEHOLDER.test(s.value)) gaps.push(L[0] + ' ' + s.path);
        });
    });
    if (gaps.length) {
      var msg = 'Placeholder text still in use (' + gaps.join('; ') + '). ' +
                'Paste the approved wording before recruiting.';
      if (opts.production) errors.push(msg); else warnings.push(msg);
    }

    // Visual words in English instruction text. The rated words and the
    // questionnaire items are exempt.
    var hits = [];
    _strings(TE, '', ['state.items'], []).forEach(function (s) {
      if (VISUAL_WORDS.test(s.value.replace(/<[^>]+>/g, ' '))) hits.push(s.path);
    });
    _strings(WE, 'words', ['words.items'], []).forEach(function (s) {
      if (VISUAL_WORDS.test(s.value.replace(/<[^>]+>/g, ' '))) hits.push(s.path);
    });
    if (hits.length) {
      warnings.push('Instruction text describes the experience with a visual ' +
                    'word (foggy, faded, dull, unreal, ...): ' + hits.join(', '));
    }

    return { errors: errors, warnings: warnings };
  }

  // =======================================================================
  // CONFIG
  // opts = { devMode: bool, production: bool }
  // =======================================================================
  function checkConfig(cfg, pkg, opts) {
    var errors = [], warnings = [];
    opts = opts || {};
    var B = cfg.blocks || {};
    var D = (pkg && pkg.design) || {};

    if (!B.consent) {
      if (!opts.devMode) {
        errors.push('CONFIG.blocks.consent is OFF. A real session must not run ' +
                    'without the consent screen. Use dev.html to test without it.');
      } else {
        warnings.push('Consent screen is off (dev session).');
      }
    }

    // Participant mode refuses shortened runs and single blocks.
    var L = cfg.limits || {};
    var pos = (B.positions || []).slice().sort().join(',');
    if (!opts.devMode) {
      if (L.max_trials > 0 || L.max_practice > 0) {
        errors.push('CONFIG.limits shortens the blocks (max_trials ' + L.max_trials +
                    ', max_practice ' + L.max_practice + '). Shortened runs are for ' +
                    'dev.html only; set both to 0.');
      }
      if (pos !== '1,2') {
        errors.push('CONFIG.blocks.positions is [' + (B.positions || []).join(', ') +
                    ']; a real session runs both blocks, [1, 2]. Use dev.html to ' +
                    'run one block alone.');
      }
      REGISTERED_BLOCKS.forEach(function (b) {
        if (!B[b]) {
          warnings.push('Registered block CONFIG.blocks.' + b + ' is OFF. Sessions ' +
                        'run like this are not registered sessions.');
        }
      });
    }

    // Practice override: whole numbers and booleans for positions 1 and 2.
    var pr = cfg.practice || {};
    [1, 2].forEach(function (p) {
      var n = (pr.trials_by_block_position || {})[p];
      if (n !== undefined && !(n >= 1 && Math.floor(n) === n)) {
        errors.push('CONFIG.practice.trials_by_block_position[' + p + '] must be a ' +
                    'whole number of 1 or more, not ' + n + '.');
      }
      var f = (pr.feedback_by_block_position || {})[p];
      if (f !== undefined && typeof f !== 'boolean') {
        errors.push('CONFIG.practice.feedback_by_block_position[' + p + '] must be ' +
                    'true or false.');
      }
    });

    // Rest.
    var rest = cfg.timing && cfg.timing.rest_ms;
    if (D.timing && D.timing.rest_between_blocks && !(rest > 0)) {
      errors.push('design.json asks for a rest between the blocks but ' +
                  'CONFIG.timing.rest_ms is ' + rest + '.');
    }

    if (!cfg.catch_trials || !(cfg.catch_trials.lockout_ms > 0)) {
      warnings.push('No catch-trial lockout. A keypress carried over from the ' +
                    'previous trial could land before the participant has read ' +
                    'the screen.');
    }
    if (cfg.display && cfg.display.allow_scaling) {
      warnings.push('display.allow_scaling is ON. The registered design shows every ' +
                    'image at exactly ' + cfg.display.image_px + ' px.');
    }
    if (!cfg.researcher_contact || /CHANGE_ME/.test(cfg.researcher_contact)) {
      warnings.push('CONFIG.researcher_contact is still the placeholder. It appears ' +
                    'on the final screen and the upload-failure screen — set it ' +
                    'before recruiting.');
    }
    return { errors: errors, warnings: warnings };
  }

  function _isProduction() {
    return !window.DEV_MODE && !CONFIG.debug;
  }

  // -----------------------------------------------------------------------
  // Run every check. Returns { ok, errors, warnings, summary }.
  // -----------------------------------------------------------------------
  function run(data) {
    var errors = [], warnings = [];
    function add(r) {
      errors = errors.concat(r.errors);
      warnings = warnings.concat(r.warnings);
    }

    add(checkPackage(data, CONFIG));
    add(checkText({
      TEXT_EN:  typeof TEXT_EN  !== 'undefined' ? TEXT_EN  : null,
      TEXT_JA:  typeof TEXT_JA  !== 'undefined' ? TEXT_JA  : null,
      WORDS_EN: typeof WORDS_EN !== 'undefined' ? WORDS_EN : null,
      WORDS_JA: typeof WORDS_JA !== 'undefined' ? WORDS_JA : null,
    }, CONFIG, data.design, {
      production:     _isProduction(),
      contactStorage: Platform.contactStorage(),
    }));
    add(checkConfig(CONFIG, data, { devMode: !!window.DEV_MODE }));

    // --- Participant fields and contact ---------------------------------
    var P = CONFIG.participant || {};
    if (!P.collect_id) {
      warnings.push('collect_id is OFF. Sessions get an anonymous ID and ' +
                    'cannot be linked to a CDS-29 score.');
    }
    if (P.collect_id && P.allow_manual_id && P.collect_name && P.collect_email) {
      var pre = P.no_id_prefix;
      if (!pre || !/^[A-Za-z0-9_]+$/.test(pre)) {
        errors.push('CONFIG.participant.no_id_prefix must be letters, digits ' +
                    'and _ (it starts the ID of sessions without an ID).');
      } else {
        var sample = pre + '_ABCDEFGH';
        if (new RegExp(P.id_pattern).test(sample) ||
            (P.superuser_ids || []).indexOf(sample) !== -1) {
          errors.push('IDs made from no_id_prefix ("' + sample + '") would match ' +
                      'id_pattern or a test ID. Choose another prefix.');
        }
      }
    }
    if ((P.collect_name || P.collect_email) &&
        Platform.contactStorage() === 'datapipe' &&
        !(CONFIG.contact_datapipe && CONFIG.contact_datapipe.experiment_id)) {
      errors.push('Name/email collection is on but CONFIG.contact_datapipe.' +
                  'experiment_id is empty — contact details would be lost.');
    }
    _checkPlatform(P, errors, warnings);

    // --- Summary ---------------------------------------------------------
    var D = data.design || {};
    var a = Loader.assignment();
    var summary = {
      stimulus_set:   Loader.stimulusSet(),
      design_version: D.version || null,
      lists:          Object.keys(data.lists || {}).length,
      main_per_block: D.main_trials_per_block,
      analysed_per_block: (D.counts_per_block || {}).analysed,
      practice:       [Loader.practiceCount(1), Loader.practiceCount(2)],
      practice_feedback: [Loader.practiceFeedback(1), Loader.practiceFeedback(2)],
      images:         (data.preload || []).length,
      language:       Loader.language(),
      group:          Loader.group(),
      slot:           Loader.slot(),
      assignment_row: Loader.assignmentRowNumber(Loader.slot()),
      blocks:         a ? a.blocks.map(function (b) {
                        return { position: b.position, episode: b.episode,
                                 set: b.set, list: b.list, practice: b.practice };
                      }) : [],
      interview_date: Loader.interviewDate(),
    };

    return _result(errors, warnings, summary);
  }

  // -----------------------------------------------------------------------
  // Platform checks — see platform.js.
  // -----------------------------------------------------------------------
  var CONTACT_STORAGE = ['auto', 'datapipe', 'results_file'];

  function _checkPlatform(P, errors, warnings) {
    var platform = Platform.name();
    if (Platform.PLATFORMS.indexOf(CONFIG.platform) === -1) {
      errors.push('CONFIG.platform must be one of ' + Platform.PLATFORMS.join(', ') +
                  ', not "' + CONFIG.platform + '".');
    }
    if (Platform.LIBRARIES.indexOf(CONFIG.libraries) === -1) {
      errors.push('CONFIG.libraries must be one of ' + Platform.LIBRARIES.join(', ') +
                  ', not "' + CONFIG.libraries + '".');
    } else if (CONFIG.libraries !== Platform.libraries()) {
      warnings.push('CONFIG.libraries is "' + CONFIG.libraries + '", which exists ' +
                    'only on Pavlovia; this page uses our copy in vendor/ instead.');
    }
    if (CONTACT_STORAGE.indexOf(P.contact_storage || 'auto') === -1) {
      errors.push('CONFIG.participant.contact_storage must be one of ' +
                  CONTACT_STORAGE.join(', ') + ', not "' + P.contact_storage + '".');
    }

    if (platform === 'pavlovia') {
      if (typeof jsPsychPavlovia === 'undefined') {
        errors.push('Platform is pavlovia but the Pavlovia plugin ' +
                    '(jspsych-7-pavlovia-2021.12.js) did not load — nothing ' +
                    'could be saved.');
      }
      if (typeof jQuery === 'undefined') {
        errors.push('Platform is pavlovia but jQuery 2.2.0 did not load; the ' +
                    'Pavlovia plugin needs it.');
      }
      if (Platform.detect() !== 'pavlovia') {
        warnings.push('CONFIG.platform is "pavlovia" but this page is not on ' +
                      'pavlovia.org; opening the Pavlovia session will fail and ' +
                      'the participant will get the download fallback.');
      }
    }
    if (platform === 'github' && typeof jsPsychPipe === 'undefined') {
      warnings.push('Platform is github but the DataPipe plugin did not load ' +
                    '(unpkg.com unreachable?). Uploads will fail and participants ' +
                    'will get the download fallback.');
    }

    var contact = P.collect_name || P.collect_email;
    if (contact && Platform.contactStorage() === 'results_file' &&
        platform === 'github') {
      warnings.push('contact_storage is results_file on GitHub Pages: names and ' +
                    'email addresses would go into the response file on Zenodo. ' +
                    'Use "datapipe" (or "auto") there.');
    }
    if (contact && Platform.contactStorage() === 'datapipe' &&
        platform === 'pavlovia') {
      warnings.push('contact_storage is datapipe on Pavlovia: names and email ' +
                    'addresses go to DataPipe/Zenodo, not to the Pavlovia ' +
                    'project. Use "auto" to keep them on Pavlovia.');
    }
    if (contact && Platform.contactStorage() === 'datapipe' &&
        typeof jsPsychPipe === 'undefined') {
      warnings.push('Name/email go to DataPipe but the DataPipe plugin did not ' +
                    'load; contact details would not be saved.');
    }
  }

  function _result(errors, warnings, summary) {
    return {
      ok:       errors.length === 0,
      errors:   errors,
      warnings: warnings,
      summary:  summary,
    };
  }

  // -----------------------------------------------------------------------
  // Console report.
  // -----------------------------------------------------------------------
  function report(result) {
    console.log('%c[Validate] ' + (result.ok ? 'PASS' : 'FAIL'),
                'font-weight:bold;color:' + (result.ok ? '#1a7f37' : '#b3261e'));
    console.log('[Validate] summary:', result.summary);
    result.errors.forEach(function (e)   { console.error('  ERROR:   ' + e); });
    result.warnings.forEach(function (w) { console.warn ('  WARNING: ' + w); });
  }

  // -----------------------------------------------------------------------
  // On-screen report, used in debug mode when validation fails.
  // -----------------------------------------------------------------------
  function toHTML(result) {
    var html = '<div class="card"><h2>Validation failed</h2>' +
               '<p>The experiment did not start because the data files or ' +
               'settings are inconsistent. This screen appears only in debug ' +
               'mode.</p>' +
               '<div class="debug-box">';
    result.errors.forEach(function (e) {
      html += '<p class="fail">' + e + '</p>';
    });
    if (result.warnings.length) {
      html += '<hr>';
      result.warnings.forEach(function (w) { html += '<p>' + w + '</p>'; });
    }
    html += '</div></div>';
    return html;
  }

  return {
    run:          run,
    report:       report,
    toHTML:       toHTML,
    checkPackage: checkPackage,
    checkText:    checkText,
    checkConfig:  checkConfig,
  };
})();

// Node (tools/check_package.js) loads this file too.
if (typeof module !== 'undefined' && module.exports) module.exports = Validate;
