/* =========================================================================
 * pairs.js — one block of image-pair trials, driven entirely by the
 * package: the block's list (lists/<list>.json) and practice file.
 *
 * A block (main.js builds one per block position, 1 and 2):
 *   preload gate  -> waits for the block's images (usually instant, since
 *                    downloading started in the background earlier)
 *   block start   -> block<p>_start is stamped
 *   reinstatement -> names the block's episode (phases/episodes.js)
 *   practice intro (block 2: says the question has changed, shows it)
 *   3 practice trials, each followed by feedback (config.js: practice)
 *   practice end
 *   200 main trials, in the list's order: 180 analysed, 15 consistency
 *     repeats, 5 catch, with a break after trials 40, 80, 120 and 160
 *     (design.json: timing.breaks_after_trial), "n of 200"
 *   block end     -> block<p>_end and catch_fail_b<p> are stamped
 *
 * Trial order, pairing, left/right assignment (left_path, right_path,
 * a_is_left) and the predictor values all come from the frozen list.
 * Nothing is randomised, reordered or resampled here.
 *
 * The question above the images depends on the block's EPISODE
 * (text: prompt.main.<episode>).
 *
 * Each image trial is three nodes: fixation, the pair, a blank. Only the
 * pair is recorded as block 'pairs'. Trials are self-paced: no time limit,
 * no minimum response time.
 *
 * CATCH trials show no images (catch_mode 'no_images') — see _catchNodes().
 * Their targets come from design.json (catch.targets_by_block_position),
 * the k-th catch row of a block getting the block's k-th target, so the
 * targets restart at the first one in each block.
 *
 * PRACTICE feedback outlines the chosen image. It confirms the key mapping
 * visually and says nothing about why the choice was made.
 *
 * DEV TRIAL LABEL (dev.html only, CONFIG.dev.trial_label): a small label
 * under the images. Line 1 names the block, trial, type, item, side and
 * the pair's predictor values; line 2 (not on catch rows, which show no
 * images) the contrast and colour levels of each image, read from its
 * file name, and how many levels apart they are — see _labelLines() and
 * levelsLine(). It is added to the page in
 * on_load, after jsPsych has drawn the screen, and never to the stimulus
 * HTML, because jsPsych records that HTML in the `stimulus` column.
 * ========================================================================= */

var PairsPhase = (function () {

  // Rendered size of the panels on the most recent trial, captured in
  // on_load. Confirms per trial that the images displayed at image_px.
  var _lastPanel = null;

  // -----------------------------------------------------------------------
  // Developer trial label. Only on dev.html (window.DEV_MODE) with
  // CONFIG.dev.trial_label on; validate.js refuses index.html with it on,
  // and this check keeps it off index.html regardless.
  // -----------------------------------------------------------------------
  function _labelOn() {
    return !!(window.DEV_MODE && CONFIG.dev && CONFIG.dev.trial_label);
  }

  // +1.03 / -1.71 / +0.00 (never "-0.00").
  function _sd(v) {
    if (v === null || v === undefined || isNaN(v)) return 'n/a';
    var r = Math.round(v * 100) / 100;
    if (r === 0) r = 0;
    return (r >= 0 ? '+' : '\u2212') + Math.abs(r).toFixed(2);
  }

  // -----------------------------------------------------------------------
  // Image levels, from the file name:  <scene>__c<level>__s<level>.png
  // c = contrast, s = saturation (colour); level 0 = unchanged, p1-p3 =
  // +1..+3, n1-n3 = -1..-3. validate.js checks (dev.html) that every image
  // a list or practice file shows follows this pattern.
  // -----------------------------------------------------------------------
  var LEVELS_RE = /__c(0|[pn][1-3])__s(0|[pn][1-3])\.png$/;

  function _level(t) {
    return (t === '0') ? 0 : (t.charAt(0) === 'p' ? 1 : -1) * parseInt(t.charAt(1), 10);
  }

  // 'stimuli/x__cn2__sp1.png' -> { contrast: -2, colour: 1 }, or null.
  function imageLevels(path) {
    var m = LEVELS_RE.exec(String(path || ''));
    return m ? { contrast: _level(m[1]), colour: _level(m[2]) } : null;
  }

  function _signed(n) {
    return n > 0 ? '+' + n : (n < 0 ? '\u2212' + Math.abs(n) : '0');
  }

  function _side(lv) {
    if (!lv) return 'levels unknown';
    if (lv.contrast === 0 && lv.colour === 0) return 'original';
    return 'contrast ' + _signed(lv.contrast) + ', colour ' + _signed(lv.colour);
  }

  // Line 2 of the label, e.g.
  //   Left: contrast −2, colour +1 · Right: contrast −2, colour −3 · Apart: contrast 0, colour 4 levels
  function levelsLine(row) {
    var L = imageLevels(row.left_path), R = imageLevels(row.right_path);
    return 'Left: ' + _side(L) + ' \u00b7 Right: ' + _side(R) + ' \u00b7 Apart: ' +
           ((L && R) ? 'contrast ' + Math.abs(L.contrast - R.contrast) + ', colour ' +
                       Math.abs(L.colour - R.colour) + ' levels'
                     : 'unknown');
  }

  // The label's lines: line 1 always; line 2 (levels) unless the row is a
  // catch trial without images.
  function _labelLines(row, ctx, pos, targetKey) {
    var lines = [_labelText(row, ctx, pos, targetKey)];
    if (!(row.trial_type === 'catch' && row.catch_mode === 'no_images')) {
      lines.push(levelsLine(row));
    }
    return lines;
  }

  // `pos` = { n, of } — the trial's place in the block (main: the list's
  // trial number of its 200; practice: n of the block's practice trials).
  function _labelText(row, ctx, pos, targetKey) {
    var parts = ['Block ' + ctx.position];
    if (ctx.phase === 'practice') {
      parts.push('practice ' + pos.n + '/' + pos.of);
      parts.push(row.pair_type);
    } else {
      parts.push(pos.n + '/' + pos.of);
      parts.push(row.trial_type +
                 (row.pair_type && row.pair_type !== row.trial_type
                   ? ' (' + row.pair_type + ')' : ''));
    }
    parts.push(row.item_id);
    parts.push('A on ' + (row.a_is_left ? 'left' : 'right'));
    parts.push('colour ' + _sd(row.pred_sat) + ' SD, contrast ' + _sd(row.pred_fog) + ' SD');
    if (row.trial_type === 'consistency') parts.push('repeat of trial ' + row.repeat_of);
    if (row.trial_type === 'catch') {
      var up = String(targetKey).toLowerCase() === 'arrowup';
      parts.push('target ' + (up ? '\u2191 ' : '\u2193 ') + targetKey +
                 (row.catch_mode === 'no_images' ? ' (images not shown)' : ''));
    }
    return parts.join(' \u00b7 ');
  }

  // Add the label to the screen just drawn: under the images when there
  // are any, else at the bottom of the screen (catch trials). textContent,
  // so nothing in it is ever read as HTML.
  function _showLabel(lines) {
    if (!_labelOn() || !lines || !lines.length) return;
    var el = document.createElement('div');
    el.className = 'dev-trial-label';
    el.setAttribute('aria-hidden', 'true');
    var span = document.createElement('span');
    lines.forEach(function (text) {
      var line = document.createElement('div');
      line.className = 'dev-label-line';
      line.textContent = text;
      span.appendChild(line);
    });
    el.appendChild(span);
    var row = document.querySelector('.stim-row');
    if (row) {
      row.appendChild(el);
    } else {
      el.className += ' dev-trial-label-fixed';
      document.body.appendChild(el);
    }
  }

  // Remove a fixed-position label left by a catch screen.
  function _clearLabel() {
    var old = document.querySelectorAll('.dev-trial-label-fixed');
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
  }

  // -----------------------------------------------------------------------
  // The question above the images, for an episode.
  // -----------------------------------------------------------------------
  function prompt(episode) {
    return Loader.byEpisode(Loader.text().prompt.main, episode);
  }

  // The markup of an image trial, also used by screen-check.js to measure
  // whether the real layout fits the window.
  function trialHTML(promptHTML, leftPath, rightPath) {
    return '<div class="stim-prompt">' + promptHTML + '</div>' +
           '<div class="stim-row" style="gap:' + CONFIG.display.gap_px + 'px;">' +
           _panel(leftPath) + _panel(rightPath) +
           '</div>';
  }

  // -----------------------------------------------------------------------
  // Catch trials.
  //
  // No images. Large text directly on the background — no card — so the
  // screen resembles neither a trial nor a break. The target is UP or DOWN,
  // so a reflexive left/right press fails immediately.
  //
  // Built as TWO nodes so the lockout needs no custom key handling:
  //   1. the same screen with choices 'NO_KEYS' and a fixed duration, so
  //      any press carried over from the previous trial is discarded;
  //   2. the live screen with choices 'ALL_KEYS', so a WRONG key actually
  //      registers and fails.
  //
  // No trial_duration on the live node: unlimited time, one press.
  // -----------------------------------------------------------------------
  function _catchHTML(targetKey) {
    var T = Loader.text();
    var isUp = (String(targetKey).toLowerCase() === 'arrowup');
    var name  = isUp ? T.catch.key_up : T.catch.key_down;
    var arrow = isUp ? '↑' : '↓';
    return (
      '<div class="catch-screen">' +
      '<div class="catch-lead">' + T.catch.lead + '</div>' +
      '<div class="catch-instruction">' +
      T.catch.instruction.replace('{KEYNAME}', name) +
      '</div>' +
      '<div class="catch-arrow">' + arrow + '</div>' +
      '</div>'
    );
  }

  function _catchNodes(row, ctx, targetKey, pos) {
    var html = _catchHTML(targetKey);
    var label = _labelLines(row, ctx, pos, targetKey);
    var base = Record.pairTrialData(row, ctx);
    base.catch_target = targetKey;

    return [
      // 1. Lockout — identical screen, keys inert.
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: html,
        choices: 'NO_KEYS',
        trial_duration: CONFIG.catch_trials.lockout_ms,
        data: { block: 'catch_lockout', block_position: ctx.position },
        on_load:   function () { _showLabel(label); },
        on_finish: function () { _clearLabel(); },
      },
      // 2. Live — any key ends the trial and is scored.
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: html,
        choices: 'ALL_KEYS',
        data: base,
        on_load: function () { Record.markTaskStart(); _showLabel(label); },
        on_finish: function (data) {
          _clearLabel();
          Record.finishCatchTrial(data);
          Record.markTaskEnd();
        },
      },
    ];
  }

  // -----------------------------------------------------------------------
  // One image panel, fixed at CONFIG.display.image_px.
  // -----------------------------------------------------------------------
  function _panel(relativePath, chosen) {
    return (
      '<div class="stim-panel' + (chosen ? ' chosen' : '') + '" style="' +
      'width:'  + CONFIG.display.image_px + 'px;' +
      'height:' + CONFIG.display.image_px + 'px;">' +
      (relativePath
        ? '<img src="' + Loader.imageURL(relativePath) + '" alt="">' : '') +
      '</div>'
    );
  }

  // -----------------------------------------------------------------------
  // The nodes making up one trial. `feedback` = outline the chosen image
  // afterwards (practice); `firstFeedback` = also show the one-line
  // explanation (first practice trial of the block).
  // -----------------------------------------------------------------------
  function _trialNodes(row, ctx, feedback, firstFeedback, pos) {
    var nodes = [];
    var label = _labelLines(row, ctx, pos);

    nodes.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div class="fixation">+</div>',
      choices: 'NO_KEYS',
      trial_duration: CONFIG.timing.fixation_ms,
      data: { block: 'fixation', block_position: ctx.position },
    });

    var data = Record.pairTrialData(row, ctx);
    data.practice_feedback = !!feedback;

    nodes.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: trialHTML(prompt(ctx.episode), row.left_path, row.right_path),
      choices: [CONFIG.keys.left, CONFIG.keys.right],
      // No trial_duration: responses are self-paced, with no timeout.
      data: data,
      on_load: function () {
        Record.markTaskStart();
        var el = document.querySelector('.stim-panel');
        if (el) {
          var r = el.getBoundingClientRect();
          _lastPanel = Math.round(r.width) + 'x' + Math.round(r.height);
        }
        _showLabel(label);
      },
      on_finish: function (d) {
        d.panel_rendered_px = _lastPanel;
        Record.finishPairTrial(d);
        Record.markTaskEnd();
      },
    });

    if (feedback) nodes.push(_feedbackNode(row, ctx, firstFeedback, label));

    nodes.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '',
      choices: 'NO_KEYS',
      trial_duration: CONFIG.timing.blank_ms,
      data: { block: 'blank', block_position: ctx.position },
    });

    return nodes;
  }

  // -----------------------------------------------------------------------
  // Practice feedback. Re-renders the same pair with the chosen image
  // outlined, for a fixed duration. It says nothing about WHY the choice
  // was made: the outline teaches the key mapping and nothing else.
  // -----------------------------------------------------------------------
  function _feedbackNode(row, ctx, isFirst, label) {
    return {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        var T = Loader.text();
        var last = jsPsych.data.get().filter({ block: 'pairs' }).last(1).values()[0];
        var side = last ? last.response_side : null;
        return (
          '<div class="stim-prompt">' +
          (isFirst ? T.practice.feedback_first : '&nbsp;') +
          '</div>' +
          '<div class="stim-row" style="gap:' + CONFIG.display.gap_px + 'px;">' +
          _panel(row.left_path,  side === 'left')  +
          _panel(row.right_path, side === 'right') +
          '</div>'
        );
      },
      choices: 'NO_KEYS',
      trial_duration: CONFIG.timing.practice_feedback_ms,
      data: { block: 'practice_feedback', block_position: ctx.position },
      on_load: function () { _showLabel(label); },
    };
  }

  // -----------------------------------------------------------------------
  // A text screen advanced with SPACE.
  // -----------------------------------------------------------------------
  function _screen(title, body, hint, blockName, position) {
    return {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div class="card"><h2>' + title + '</h2>' + body +
                '<p class="hint">' + hint + '</p></div>',
      choices: [' '],
      data: { block: blockName, block_position: position },
    };
  }

  // -----------------------------------------------------------------------
  // The preload gate: waits for whatever of the block's images has not
  // arrived yet (the background download started after the ID screen).
  // -----------------------------------------------------------------------
  function _preloadGate(images, position) {
    var T = Loader.text();
    return {
      type: jsPsychPreload,
      images: images,
      message: T.preload.message,
      show_progress_bar: true,
      continue_after_error: false,
      error_message: T.preload.error,
      max_load_time: 300000,          // 5 minutes
      data: { block: 'preload', block_position: position },
      on_error: function (file) {
        console.error('[Preload] Failed to load: ' + file);
      },
      on_finish: function (data) {
        if (CONFIG.debug) {
          console.log('[Preload] block ' + position + ': success ' + data.success +
                      ' | failed files: ' + (data.failed_images || []).length);
        }
      },
    };
  }

  // Replace {N} and {TOTAL}-style tokens.
  function _fill(s, map) {
    for (var k in map) {
      if (Object.prototype.hasOwnProperty.call(map, k)) {
        s = s.split('{' + k + '}').join(String(map[k]));
      }
    }
    return s;
  }

  // -----------------------------------------------------------------------
  // Build one block. `b` is Loader.block(position); `introNodes` are the
  // reinstatement screen's nodes (phases/episodes.js), shown after the
  // block starts and before the practice.
  // -----------------------------------------------------------------------
  function buildBlockNodes(jsPsych, b, introNodes) {
    var T     = Loader.text();
    var nodes = [];
    var ctx   = {
      position:      b.position,
      episode:       b.episode,
      slot:          Loader.slot(),
      assignmentRow: Loader.assignmentRowNumber(Loader.slot()),
    };
    var practice = CONFIG.blocks.practice ? b.practice : [];
    var main     = CONFIG.blocks.main     ? b.rows     : [];

    // Preload gate: only the images this block will actually show.
    var shown = { practice: practice, rows: main };
    var images = Loader.blockImageURLs(shown);
    if (images.length) nodes.push(_preloadGate(images, b.position));

    nodes.push({
      type: jsPsychCallFunction,
      func: function () { Record.markBlockStart(jsPsych, b); },
      data: { block: 'block_start', block_position: b.position, episode: b.episode },
    });

    nodes = nodes.concat(introNodes || []);

    // --- Practice --------------------------------------------------------
    if (practice.length) {
      var P = T.practice;
      var vars = { N: practice.length, QUESTION: prompt(b.episode),
                   TOTAL: b.rows.length };
      var intro = (b.position === 1)
        ? _fill(P.body, vars)
        : _fill(P.body_b2, vars) + _fill(P.question_changed, vars);
      nodes.push(_screen(P.title, intro, P.continue_hint,
                         'practice_intro', b.position));
      var pctx = Object.assign({ phase: 'practice' }, ctx);
      practice.forEach(function (row, i) {
        nodes = nodes.concat(_trialNodes(row, pctx, b.feedback, b.feedback && i === 0,
                                         { n: i + 1, of: practice.length }));
      });
      nodes.push(_screen(P.end_title,
                         _fill(b.position === 1 ? P.end_body : P.end_body_b2, vars),
                         P.end_hint, 'practice_end', b.position));
    }

    // --- Main trials -----------------------------------------------------
    if (main.length) {
      var breaks = Loader.breaksAfter();
      var mctx   = Object.assign({ phase: 'main' }, ctx);
      var k      = 0;     // catch counter, restarting in every block
      main.forEach(function (row, i) {
        // Break after `i` completed trials, if i is a break point — never
        // before the first trial or after the last one.
        if (i > 0 && breaks.indexOf(i) !== -1) {
          nodes.push(_screen(
            T.brk.title,
            _fill(T.brk.body, { DONE: i, TOTAL: main.length }),
            T.brk.hint, 'break', b.position));
        }
        if (row.trial_type === 'catch') {
          nodes = nodes.concat(_catchNodes(row, mctx, b.targets[k++],
                                           { n: row.trial, of: b.fullLength }));
        } else {
          nodes = nodes.concat(_trialNodes(row, mctx, false, false,
                                           { n: row.trial, of: b.fullLength }));
        }
      });
    }

    nodes.push({
      type: jsPsychCallFunction,
      func: function () { Record.markBlockEnd(jsPsych, b); },
      data: { block: 'block_end', block_position: b.position, episode: b.episode },
    });

    return nodes;
  }

  return {
    buildBlockNodes: buildBlockNodes,
    trialHTML:       trialHTML,
    imageLevels:     imageLevels,   // dev label; also used by the tests
    levelsLine:      levelsLine,
    prompt:          prompt,
  };
})();
