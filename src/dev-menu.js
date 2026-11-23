/* =========================================================================
 * dev-menu.js — the block jumper shown by dev.html.
 *
 * WHY THIS EXISTS
 * ---------------
 * Testing the last screen of the study normally means sitting through
 * consent, full screen, ID entry, calibration, the episode screens, two
 * blocks of 200 trials and a rest. Any single part is reachable from here
 * in a few seconds.
 *
 * It is loaded ONLY by dev.html. index.html — what participants open —
 * does not include it, so there is no way for a participant to reach it.
 *
 * Every session started here is stamped `is_dev = true` on every row, and
 * a shortened one also `shortened = true` and `shortened_to = N`, so a
 * test session can never be mistaken for data even if it uploads.
 *
 * GROUP AND SLOT come from ?group= and ?slot= exactly as on index.html;
 * the chips below set them. Until both are valid the presets are
 * disabled. The slot decides the episode order, the lists and the practice
 * files (assignment.json), shown in the table.
 *
 * Presets set CONFIG.blocks (including blocks.positions, which block
 * positions run), CONFIG.calibration and CONFIG.limits, then hand control
 * back to main.js, which builds the timeline as usual. Nothing here
 * duplicates the experiment logic — a block tested from this menu is the
 * same code the participant runs. A jump that skips the episode screens
 * shows a marked dev value in place of the participant's words.
 *
 * SHORTENED RUNS (CONFIG.limits.max_trials, per block) are available
 * only here: Loader ignores the limits outside dev.html, and validate.js
 * refuses to start index.html while they are set.
 *
 * TRIAL LABEL: the "Trial label" box (on by default) sets
 * CONFIG.dev.trial_label for whichever preset or custom session is
 * started, showing a small label under the images on every practice and
 * main trial. It is never recorded (see pairs.js) and never shown on
 * index.html.
 * ========================================================================= */

var DevMenu = (function () {

  // The switches as config.js ships them, captured before any preset
  // changes CONFIG — the defaults of the custom section.
  var BLOCK_DEFAULTS = JSON.parse(JSON.stringify(CONFIG.blocks));
  var BLOCK_SWITCHES = Object.keys(BLOCK_DEFAULTS).filter(function (k) {
    return typeof BLOCK_DEFAULTS[k] === 'boolean';
  });
  var CALIB_KEYS     = ['fullscreen', 'screen_check', 'setup', 'brightness', 'gamma'];
  var CALIB_DEFAULTS = {};
  CALIB_KEYS.forEach(function (k) { CALIB_DEFAULTS[k] = CONFIG.calibration[k]; });

  var SHORT_N   = 12;   // main trials per block in the shortened presets
  var SLOT_CHIPS = [1, 2, 37, 64, 65, 130];

  // All block switches off, then the listed ones on; positions as given.
  // Calibration likewise.
  function _only(blocksOn, calibOn, positions) {
    var blocks = {};
    BLOCK_SWITCHES.forEach(function (k) { blocks[k] = (blocksOn.indexOf(k) !== -1); });
    blocks.positions = positions || [];
    var calibration = {};
    CALIB_KEYS.forEach(function (k) { calibration[k] = (calibOn.indexOf(k) !== -1); });
    return { blocks: blocks, calibration: calibration };
  }

  function _merge(a, b) {
    var out = {};
    [a, b].forEach(function (o) {
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) out[k] = o[k];
    });
    return out;
  }

  var SCREEN = ['fullscreen', 'screen_check'];
  var BLOCK  = ['practice', 'main'];
  var NO_LIMITS = { max_trials: 0, max_practice: 0 };

  // The platform an upload test uses: this page's own, except that on your
  // computer (where 'auto' means no upload) it uploads to DataPipe.
  function _uploadPlatform() {
    return (Platform.name() === 'local') ? 'github' : Platform.name();
  }

  // The first catch trial of block 1's list for this slot (for the catch
  // preset), or 40.
  function _firstCatch() {
    var b = Loader.block(1);
    if (!b) return 40;
    for (var i = 0; i < b.rows.length; i++) {
      if (b.rows[i].trial_type === 'catch') return b.rows[i].trial;
    }
    return 40;
  }

  // -----------------------------------------------------------------------
  // Presets. Each returns the overrides to apply.
  //
  // `platform` is forced to 'local' on every preset except the upload test,
  // so routine dev runs do not fill the data store with junk.
  // -----------------------------------------------------------------------
  var PRESETS = [
    {
      id: 'full',
      label: 'Full session (local)',
      note: 'Exactly what a participant gets: both blocks of 200 trials and ' +
            'the 1-minute rest; the CSV downloads instead of uploading.',
      apply: function () {
        return { platform: 'local', limits: NO_LIMITS,
                 blocks: JSON.parse(JSON.stringify(BLOCK_DEFAULTS)) };
      },
    },
    {
      id: 'short',
      label: 'Shortened session &mdash; first ' + SHORT_N + ' trials per block',
      note: 'Every step of a real session (episodes, both blocks with practice, ' +
            'the rest, words, CDS items), each block cut to its first ' + SHORT_N +
            ' trials. Calibration and consent skipped. Rows are marked ' +
            'shortened = true. The CSV downloads.',
      apply: function () {
        return _merge(_only(['episodes', 'practice', 'main', 'rest', 'words', 'cds'],
                            SCREEN, [1, 2]),
                      { limits: { max_trials: SHORT_N, max_practice: 0 },
                        platform: 'local' });
      },
    },
    {
      id: 'consent',
      label: 'Consent screen only',
      note: 'Agree or decline. Declining shows the thank-you screen and stops.',
      apply: function () {
        return _merge(_only(['consent'], [], []), { platform: 'local', limits: NO_LIMITS });
      },
    },
    {
      id: 'screen',
      label: 'Full screen, window check &amp; size readout',
      note: 'Resize the window to see the hard stop. The check measures both ' +
            'of the group\'s questions. No trials, no preload.',
      apply: function () {
        return _merge(_only(['size_check'], SCREEN, []), { platform: 'local', limits: NO_LIMITS });
      },
    },
    {
      id: 'calibration',
      label: 'Calibration only',
      note: 'The set-up screen, brightness (charger, automatic features, ' +
            'lighting, two required checkboxes) and the 3&times; gamma match. ' +
            '~3 minutes.',
      apply: function () {
        return _merge(_only([], SCREEN.concat(['setup', 'brightness', 'gamma']), []),
                      { platform: 'local', limits: NO_LIMITS });
      },
    },
    {
      id: 'episodes',
      label: 'Episode screens only',
      note: 'The two episode screens for the chosen group: identifying words, ' +
            'three optional questions and the two required scales (Continue ' +
            'disabled until the words and both scales are answered).',
      apply: function () {
        return _merge(_only(['episodes'], [], []), { platform: 'local', limits: NO_LIMITS });
      },
    },
    {
      id: 'block1',
      label: 'Episodes + block 1 (first ' + SHORT_N + ' trials)',
      note: 'The episode screens, then block 1: reinstatement, practice with ' +
            'feedback, the first ' + SHORT_N + ' trials.',
      apply: function () {
        return _merge(_only(['episodes'].concat(BLOCK), SCREEN, [1]), {
          limits: { max_trials: SHORT_N, max_practice: 0 }, platform: 'local',
        });
      },
    },
    {
      id: 'block2',
      label: 'Jump to block 2 (first ' + SHORT_N + ' trials)',
      note: 'Block 2 alone: reinstatement (with a dev value for the words), ' +
            'the practice intro saying the question has changed, practice ' +
            'with feedback, the first ' + SHORT_N + ' trials.',
      apply: function () {
        return _merge(_only(BLOCK, SCREEN, [2]), {
          limits: { max_trials: SHORT_N, max_practice: 0 }, platform: 'local',
        });
      },
    },
    {
      id: 'rest',
      label: 'Jump to the rest',
      note: 'The 1-minute rest between the blocks: countdown, then Continue.',
      apply: function () {
        return _merge(_only(['rest'], [], []), { platform: 'local', limits: NO_LIMITS });
      },
    },
    {
      id: 'words',
      label: 'Jump to the word ratings',
      note: 'The 10 words, 0&ndash;6, wording for the chosen group (a dev value ' +
            'for the participant\'s words).',
      apply: function () {
        return _merge(_only(['words'], [], []), { platform: 'local', limits: NO_LIMITS });
      },
    },
    {
      id: 'catch',
      label: 'Catch trial (block 1)',
      note: 'Block 1 without practice, up to and including its first catch ' +
            'trial (this slot\'s list).',
      apply: function () {
        return _merge(_only(['main'], SCREEN, [1]), {
          limits: { max_trials: _firstCatch(), max_practice: 0 }, platform: 'local',
        });
      },
    },
    {
      id: 'cds',
      label: 'CDS items only',
      note: 'The four CDS items (2, 13, 19, 29), trait format: frequency, then ' +
            'the duration when the frequency is not 0.',
      apply: function () {
        return _merge(_only(['cds'], [], []), { platform: 'local', limits: NO_LIMITS });
      },
    },
    {
      id: 'save_test',
      label: 'Upload test &mdash; 3 trials per block',
      note: 'Both blocks, 3 trials each, no practice, no rest, then saves as ' +
            'this platform does: DataPipe on GitHub Pages and on your ' +
            'computer, Pavlovia on Pavlovia. Use to check the save path.',
      upload: true,
      apply: function () {
        return _merge(_only(['main'], SCREEN, [1, 2]), {
          limits: { max_trials: 3, max_practice: 0 },
          platform: _uploadPlatform(),
        });
      },
    },
  ];

  // -----------------------------------------------------------------------
  // Apply overrides onto CONFIG, one level deep.
  // -----------------------------------------------------------------------
  function _apply(overrides) {
    for (var key in overrides) {
      if (!Object.prototype.hasOwnProperty.call(overrides, key)) continue;
      var val = overrides[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        CONFIG[key] = CONFIG[key] || {};
        for (var sub in val) {
          if (Object.prototype.hasOwnProperty.call(val, sub)) CONFIG[key][sub] = val[sub];
        }
      } else {
        CONFIG[key] = val;
      }
    }
  }

  function _esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  // -----------------------------------------------------------------------
  // Render the menu. `onStart` is called once a preset is chosen.
  // -----------------------------------------------------------------------
  function show(summary, onStart) {
    var group = Loader.group();
    var slot  = Loader.slot();
    var a     = Loader.assignment();
    var ready = !!(group && slot && a);

    var html =
      '<div class="dev-menu">' +
      '<h1>Developer menu</h1>' +
      '<p class="dev-warning">Test sessions only. Every row is stamped ' +
      '<code>is_dev = true</code>. Participants use <code>index.html</code>.</p>';

    // --- Current state ---------------------------------------------------
    html += '<div class="dev-state"><table>';
    html += '<tr><th>package</th><td><code>' + _esc(summary.stimulus_set) + '</code> (' +
            _esc(summary.design_version) + '), ' + summary.lists + ' lists, ' +
            summary.images + ' images</td></tr>';
    html += '<tr><th>per block</th><td>' + summary.main_per_block + ' main trials (' +
            summary.analysed_per_block + ' analysed); practice ' +
            (summary.practice || ['?', '?']).join(' / ') + ' trials, feedback ' +
            (summary.practice_feedback || ['?', '?']).join(' / ') + ' on ' +
            (summary.practice_feedback_trials || ['?', '?']).join(' / ') +
            ' trials (design.json)</td></tr>';
    html += '<tr><th>language</th><td><code>' + _esc(summary.language) + '</code></td></tr>';
    html += '<tr><th>group</th><td>' + (group ? '<code>' + _esc(group) + '</code>'
              : '<b class="dev-missing">none &mdash; choose one below</b>') + '</td></tr>';
    html += '<tr><th>slot</th><td>' + (slot
              ? '<code>' + slot + '</code> &rarr; assignment row ' + summary.assignment_row
              : '<b class="dev-missing">none &mdash; choose one below</b>') + '</td></tr>';
    if (a) {
      html += '<tr><th>blocks</th><td>' + a.blocks.map(function (b) {
        return b.position + ': <b>' + _esc(b.episode) + '</b>, set ' + _esc(b.set) +
               ', list <code>' + _esc(b.list) + '</code>, <code>' +
               _esc(b.practice) + '</code>';
      }).join('<br>') + '<br><span class="dev-preset-note">block_order ' + a.block_order +
              ', set_mapping ' + a.set_mapping + ', order ' + a.order + '</span></td></tr>';
    }
    html += '<tr><th>interview_date</th><td>' + (summary.interview_date
              ? '<code>' + _esc(summary.interview_date) + '</code>' : '(none)') + '</td></tr>';
    html += '<tr><th>platform</th><td><code>' + _esc(Platform.name()) + '</code>' +
            (CONFIG.platform === 'auto' ? ' (auto, from this address)' : ' (set in config.js)') +
            ' &mdash; presets save locally; the upload test saves via <code>' +
            _esc(_uploadPlatform()) + '</code> (DataPipe: <code>' +
            _esc(CONFIG.datapipe.experiment_id) + '</code>, a TEST experiment)</td></tr>';
    html += '<tr><th>libraries</th><td><code>' + _esc(Platform.libraries()) + '</code>' +
            (CONFIG.libraries !== Platform.libraries()
              ? ' (config says <code>' + _esc(CONFIG.libraries) + '</code>, only on Pavlovia)' : '') +
            '</td></tr>';
    html += '<tr><th>name/email</th><td><code>' + _esc(Platform.contactStorage()) + '</code>' +
            (Platform.contactStorage() === 'results_file'
              ? ' (kept in the response file)' : ' (separate DataPipe upload)') + '</td></tr>';
    html += '</table></div>';

    // --- Switchers -------------------------------------------------------
    html += '<div class="dev-switchers">';
    html += '<span>group:</span>';
    (CONFIG.groups || []).forEach(function (g) {
      html += '<a class="dev-chip' + (g === group ? ' on' : '') +
              '" href="' + _link({ group: g }) + '">' + _esc(g) + '</a>';
    });
    html += '<span>slot:</span>';
    SLOT_CHIPS.forEach(function (n) {
      html += '<a class="dev-chip' + (n === slot ? ' on' : '') +
              '" href="' + _link({ slot: n }) + '">' + n + '</a>';
    });
    html += '<input id="dev-slot" type="number" min="1" style="width:5em" value="' +
            (slot || '') + '"><button id="dev-slot-go">set</button>';
    html += '<span>language:</span>';
    ['en', 'ja'].forEach(function (l) {
      html += '<a class="dev-chip' + (l === summary.language ? ' on' : '') +
              '" href="' + _link({ lang: l }) + '">' + l + '</a>';
    });
    html += '</div>';

    // Applies to every preset and to the custom session.
    html += '<div class="dev-switchers"><label class="dev-inline">' +
            '<input id="dev-trial-label" type="checkbox" checked> ' +
            '<b>Trial label</b> under the images on every practice and main trial ' +
            '(block, trial, type, item, side, colour / contrast in SD; each ' +
            'image\'s levels and how far apart they are; not recorded, never ' +
            'on index.html)</label></div>';

    if (!ready) {
      html += '<p class="dev-warning">Choose a group and a slot first. index.html ' +
              'refuses to start without <code>?group=</code> and a valid ' +
              '<code>?slot=</code>, and so does this menu.</p>';
    }

    // --- Presets ---------------------------------------------------------
    html += '<div class="dev-presets">';
    PRESETS.forEach(function (p) {
      html += '<button class="dev-preset" data-id="' + p.id + '"' +
              (ready ? '' : ' disabled') + '>' +
              '<span class="dev-preset-label">' + p.label +
              (p.upload ? ' <span class="dev-upload">uploads</span>' : '') +
              '</span>' +
              '<span class="dev-preset-note">' + p.note + '</span>' +
              '</button>';
    });
    html += '</div>';

    // --- Custom: every switch --------------------------------------------
    html += '<div class="dev-custom"><h2>Custom session</h2>' +
            '<p class="dev-preset-note">Every switch in <code>CONFIG.blocks</code> ' +
            'and <code>CONFIG.calibration</code>, preset to the values in ' +
            'config.js. Changes here last for this test session only.</p>' +
            '<div class="dev-switches">';
    CALIB_KEYS.forEach(function (k) {
      html += '<label><input type="checkbox" data-calib="' + k + '"' +
              (CALIB_DEFAULTS[k] ? ' checked' : '') + '> calibration.' + k + '</label>';
    });
    BLOCK_SWITCHES.forEach(function (k) {
      html += '<label><input type="checkbox" data-block="' + k + '"' +
              (BLOCK_DEFAULTS[k] ? ' checked' : '') + '> blocks.' + k + '</label>';
    });
    [1, 2].forEach(function (p) {
      html += '<label><input type="checkbox" data-position="' + p + '"' +
              ((BLOCK_DEFAULTS.positions || []).indexOf(p) !== -1 ? ' checked' : '') +
              '> block position ' + p + '</label>';
    });
    html += '</div>' +
            '<p>Main trials per block: <input id="dev-n" type="number" min="0" max="' +
            summary.main_per_block + '" value="0"> (0 = all ' + summary.main_per_block +
            ') &nbsp; practice per block: <input id="dev-np" type="number" min="0" max="' +
            Math.max.apply(null, summary.practice || [0]) + '" value="0"> (0 = all, ' +
            'design.json) &nbsp; ' +
            '<label class="dev-inline"><input id="dev-upload" type="checkbox"> upload (' +
            _esc(_uploadPlatform()) + ')</label> ' +
            '<button id="dev-run-custom"' + (ready ? '' : ' disabled') + '>Run</button></p>' +
            '</div>';

    html += '</div>';

    document.body.innerHTML = html;

    // --- Wiring ----------------------------------------------------------
    document.getElementById('dev-slot-go').addEventListener('click', function () {
      var v = document.getElementById('dev-slot').value;
      window.location.href = _link({ slot: v || null });
    });

    var buttons = document.querySelectorAll('.dev-preset');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        if (!ready) return;
        var id = this.getAttribute('data-id');
        for (var j = 0; j < PRESETS.length; j++) {
          if (PRESETS[j].id === id) {
            _apply(PRESETS[j].apply());
            _applyLabel();
            console.log('[Dev] preset "' + id + '" — platform=' + CONFIG.platform +
                        ', blocks=', CONFIG.blocks, ', calibration=', CONFIG.calibration,
                        ', limits=', CONFIG.limits);
            document.body.innerHTML = '';
            onStart();
            return;
          }
        }
      });
    }

    document.getElementById('dev-run-custom').addEventListener('click', function () {
      if (!ready) return;
      var blocks = { positions: [] }, calibration = {};
      var boxes = document.querySelectorAll('.dev-switches input');
      for (var b = 0; b < boxes.length; b++) {
        var bk = boxes[b].getAttribute('data-block');
        var ck = boxes[b].getAttribute('data-calib');
        var pk = boxes[b].getAttribute('data-position');
        if (bk) blocks[bk] = boxes[b].checked;
        if (ck) calibration[ck] = boxes[b].checked;
        if (pk && boxes[b].checked) blocks.positions.push(parseInt(pk, 10));
      }
      var n  = parseInt(document.getElementById('dev-n').value, 10) || 0;
      var np = parseInt(document.getElementById('dev-np').value, 10) || 0;
      var up = document.getElementById('dev-upload').checked;
      _apply({ blocks: blocks, calibration: calibration,
               limits: { max_trials: n, max_practice: np } });
      _applyLabel();
      CONFIG.platform = up ? _uploadPlatform() : 'local';
      console.log('[Dev] custom — blocks=', blocks, 'calibration=', calibration,
                  'trials=' + (n || 'all') + ', practice=' + (np || 'config') +
                  ', upload=' + up);
      document.body.innerHTML = '';
      onStart();
    });
  }

  // The trial-label box -> CONFIG.dev.trial_label.
  function _applyLabel() {
    var box = document.getElementById('dev-trial-label');
    CONFIG.dev = CONFIG.dev || {};
    CONFIG.dev.trial_label = !!(box && box.checked);
    console.log('[Dev] trial label ' + (CONFIG.dev.trial_label ? 'on' : 'off'));
  }

  // Build a link to this page with query parameters changed (null removes).
  function _link(changes) {
    var params = new URLSearchParams(window.location.search);
    for (var k in changes) {
      if (!Object.prototype.hasOwnProperty.call(changes, k)) continue;
      if (changes[k] === null) params.delete(k); else params.set(k, changes[k]);
    }
    return window.location.pathname + '?' + params.toString();
  }

  return { show: show };
})();
