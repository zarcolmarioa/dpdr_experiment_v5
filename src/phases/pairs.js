/* =========================================================================
 * pairs.js — one block of image-pair trials, driven entirely by the
 * package: the block's list (lists/<list>.json) and practice file.
 *
 * A block (main.js builds one per block position, 1 and 2):
 *   preload gate  -> waits for the block's images (usually instant, since
 *                    downloading started in the background earlier)
 *   block start   -> block<p>_start is stamped
 *   reinstatement -> names the block's episode (phases/episodes.js)
 *   practice intro, keyed by the block's episode (block 1: what the
 *     pictures are, the task, the arrow keys; block 2: the second part
 *     works the same way, the question has changed, the task again)
 *   the practice trials (design.json: 3), each followed by feedback when
 *     the block has it (design.json: practice_feedback_by_block_position,
 *     practice_feedback_trials)
 *   practice end (no trial count or duration)
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
 * PRACTICE FEEDBACK
 *   First practice trial of each block: a left arrow under the left image
 *   and a right arrow under the right one while the participant chooses
 *   (arrows_shown). When the block has feedback, after the response only
 *   the CHOSEN image stays (the other one disappears, its space kept, no
 *   outline), and the question is replaced, at the same size, by a message
 *   keyed by episode (practice.first_feedback.<episode>) confirming that
 *   this is the picture the participant chose. It is never presented as a
 *   correct answer. After CONFIG.timing.first_feedback_ms the next
 *   practice trial starts. feedback_display = 'chosen_only'.
 *   Other practice trials with feedback: the chosen image is outlined for
 *   CONFIG.timing.practice_feedback_ms. feedback_display = 'outline'.
 *   The question area keeps the same height on the trial and on its
 *   chosen-only screen (_reservePrompt), so the image does not move.
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
  // whether the real layout fits the window. opts.arrows: the arrow keys
  // under the images (first practice trial of a block). The arrows are
  // positioned absolutely under each panel, so the layout does not move.
  function trialHTML(promptHTML, leftPath, rightPath, opts) {
    var arrows = !!(opts && opts.arrows);
    return _promptDiv(promptHTML) +
           '<div class="stim-row' + (arrows ? ' has-keys' : '') +
           '" style="gap:' + CONFIG.display.gap_px + 'px;">' +
           _panel(leftPath,  false, arrows ? '&#8592;' : null) +
           _panel(rightPath, false, arrows ? '&#8594;' : null) +
           '</div>';
  }

  // The text above the images. Never wider than the two images, so a line
  // wraps at the same place on every screen of a trial (the question, and
  // the message that replaces it after the first practice trial).
  function _promptDiv(html, extraClass) {
    var w = 2 * CONFIG.display.image_px + CONFIG.display.gap_px;
    return '<div class="stim-prompt' + (extraClass ? ' ' + extraClass : '') +
           '" style="max-width:' + w + 'px;">' + html + '</div>';
  }

  // Give the question area the height of the tallest of `htmls` at the
  // current width, so a trial and the screen that replaces its question
  // with a message have the same layout and the image stays in place. Runs
  // in on_load, before the screen is painted.
  function _reservePrompt(htmls) {
    var el = document.querySelector('.stim-prompt');
    if (!el || !el.parentNode) return;
    var w = el.getBoundingClientRect().width;
    var h = 0;
    htmls.forEach(function (html) {
      var c = el.cloneNode(false);
      c.innerHTML = html;
      c.style.position   = 'absolute';
      c.style.visibility = 'hidden';
      c.style.left = '0'; c.style.top = '0';
      c.style.width = w + 'px';
      c.style.minHeight = '0';
      el.parentNode.appendChild(c);
      h = Math.max(h, c.getBoundingClientRect().height);
      c.parentNode.removeChild(c);
    });
    if (h > 0) el.style.minHeight = h + 'px';
  }

  // The message after the first practice response, for an episode.
  function firstFeedback(episode) {
    return Loader.byEpisode(Loader.text().practice.first_feedback, episode);
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
  // `chosen`: true = outlined, 'hidden' = not shown (its space kept).
  // `key`: an arrow shown under the panel.
  function _panel(relativePath, chosen, key) {
    var cls = 'stim-panel' + (chosen === 'hidden' ? ' stim-panel-hidden'
                            : chosen ? ' chosen' : '');
    return (
      '<div class="' + cls + '" style="' +
      'width:'  + CONFIG.display.image_px + 'px;' +
      'height:' + CONFIG.display.image_px + 'px;">' +
      (relativePath
        ? '<img src="' + Loader.imageURL(relativePath) + '" alt="">' : '') +
      (key ? '<div class="stim-key" aria-hidden="true">' + key + '</div>' : '') +
      '</div>'
    );
  }

  // -----------------------------------------------------------------------
  // The nodes making up one trial. `mode` (practice only):
  //   mode.arrows    the arrow keys under the images while choosing
  //   mode.feedback  'chosen_only' (first practice trial: only the chosen
  //                  image stays, with the message), 'outline' (the chosen
  //                  image outlined) or '' (none: main trials)
  // -----------------------------------------------------------------------
  function _trialNodes(row, ctx, mode, pos) {
    var nodes = [];
    var label = _labelLines(row, ctx, pos);
    var arrows   = !!(mode && mode.arrows);
    var feedback = (mode && mode.feedback) || '';
    var chosenOnly = (feedback === 'chosen_only');

    nodes.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div class="fixation">+</div>',
      choices: 'NO_KEYS',
      trial_duration: CONFIG.timing.fixation_ms,
      data: { block: 'fixation', block_position: ctx.position },
    });

    var data = Record.pairTrialData(row, ctx);
    data.practice_feedback = !!feedback;
    data.feedback_display  = feedback;
    data.arrows_shown      = arrows;

    nodes.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: trialHTML(prompt(ctx.episode), row.left_path, row.right_path,
                          { arrows: arrows }),
      choices: [CONFIG.keys.left, CONFIG.keys.right],
      // No trial_duration: responses are self-paced, with no timeout.
      data: data,
      on_load: function () {
        Record.markTaskStart();
        if (chosenOnly) _reservePrompt([prompt(ctx.episode), firstFeedback(ctx.episode)]);
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

    if (chosenOnly)  nodes.push(_chosenOnlyNode(row, ctx, label));
    else if (feedback) nodes.push(_feedbackNode(row, ctx, label));

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
  // The side chosen on the most recent image trial.
  function _lastSide() {
    var last = jsPsych.data.get().filter({ block: 'pairs' }).last(1).values()[0];
    return last ? last.response_side : null;
  }

  // Practice feedback. Re-renders the same pair with the chosen image
  // outlined, for a fixed duration. It says nothing about WHY the choice
  // was made: the outline teaches the key mapping and nothing else.
  // -----------------------------------------------------------------------
  function _feedbackNode(row, ctx, label) {
    return {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        var side = _lastSide();
        return (
          _promptDiv('&nbsp;') +
          '<div class="stim-row" style="gap:' + CONFIG.display.gap_px + 'px;">' +
          _panel(row.left_path,  side === 'left')  +
          _panel(row.right_path, side === 'right') +
          '</div>'
        );
      },
      choices: 'NO_KEYS',
      trial_duration: CONFIG.timing.practice_feedback_ms,
      data: { block: 'practice_feedback', block_position: ctx.position,
              feedback_display: 'outline' },
      on_load: function () { _showLabel(label); },
    };
  }

  // First practice trial of a block: only the chosen image stays, in its
  // place, with no outline; the other disappears (its space kept). The
  // question is replaced, at the same size, by the episode's message
  // confirming the participant's own choice. Then the next practice trial.
  function _chosenOnlyNode(row, ctx, label) {
    return {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        var side = _lastSide();
        return (
          _promptDiv(firstFeedback(ctx.episode), 'stim-message') +
          '<div class="stim-row" style="gap:' + CONFIG.display.gap_px + 'px;">' +
          _panel(row.left_path,  side === 'left'  ? false : 'hidden') +
          _panel(row.right_path, side === 'right' ? false : 'hidden') +
          '</div>'
        );
      },
      choices: 'NO_KEYS',
      trial_duration: CONFIG.timing.first_feedback_ms,
      data: { block: 'practice_feedback', block_position: ctx.position,
              feedback_display: 'chosen_only' },
      on_load: function () {
        _reservePrompt([prompt(ctx.episode), firstFeedback(ctx.episode)]);
        _showLabel(label);
      },
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
      var vars = { N: practice.length, QUESTION: prompt(b.episode) };
      var intro = (b.position === 1)
        ? Loader.byEpisode(P.body, b.episode) + P.keys_line +
          _fill(P.count_line, vars)
        : P.intro_b2 + _fill(P.question_changed, vars) +
          Loader.byEpisode(P.body_b2, b.episode) + _fill(P.count_line, vars);
      nodes.push(_screen(P.title, intro, P.continue_hint,
                         'practice_intro', b.position));
      var pctx = Object.assign({ phase: 'practice' }, ctx);
      practice.forEach(function (row, i) {
        // Arrows under the images on the first practice trial. Feedback on
        // the first b.feedbackTrials practice trials (design.json:
        // practice_feedback_trials; 0 when the block has no feedback): the
        // chosen-only display on the first, the outline on the others.
        var fb = (i < b.feedbackTrials) ? (i === 0 ? 'chosen_only' : 'outline') : '';
        nodes = nodes.concat(_trialNodes(row, pctx, { arrows: i === 0, feedback: fb },
                                         { n: i + 1, of: practice.length }));
      });
      nodes.push(_screen(P.end_title,
                         b.position === 1 ? P.end_body : P.end_body_b2,
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
          nodes = nodes.concat(_trialNodes(row, mctx, null,
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
    firstFeedback:   firstFeedback,
  };
})();
