/* =========================================================================
 * phases/episodes.js — episode selection, and the reinstatement screen
 * before each block. Replaces the v4 anchoring screen.
 *
 * EPISODE SELECTION (after calibration, before block 1)
 *   One screen per episode of the group, in the order design.json lists
 *   them (not the block order of the slot):
 *
 *   participant  1. derealization — "the episode you described in the
 *                   interview"
 *                2. ordinary — one in a similar setting (similar place,
 *                   time of day and lighting), from about as long ago as
 *                   the derealization episode, in which the surroundings
 *                   looked as usual. Shows the participant's own words
 *                   for the derealization episode as a reference.
 *   control      1. ordinary — an episode from the last six months
 *                2. expectation — the short description of derealization
 *                   (no questions)
 *
 *   Each RECALLED episode (not the expectation) asks:
 *     words      a few words to identify it       free text, REQUIRED
 *     when       When was it?                     free text, optional
 *     duration   How long did it last?            free text, optional
 *     where      Where were you?                  free text, optional
 *     tone       unpleasant -3 ... +3 pleasant    REQUIRED
 *     intensity  0 ... 6                          REQUIRED
 *   The optional questions carry the "(optional)" tag (episodes.
 *   optional_tag) and may be left blank. The scales have no default:
 *   Continue stays disabled until the words, the tone and the intensity
 *   are answered. There is no "Prefer not to say".
 *   Nothing about clarity, vividness or colour is asked.
 *
 * REINSTATEMENT (start of each block, built by pairs.js's caller)
 *   Names the block's episode and shows the participant's own identifying
 *   words; the expectation block repeats the description instead.
 *
 * Wording: text/<lang>/instructions.js, sections `episodes` and
 * `reinstate`, keyed by group and episode. Only participants' text may
 * mention the interview; controls never see the word.
 *
 * Anything typed is stored WITH the responses. Typed text is HTML-escaped
 * wherever it is shown again.
 *
 * OUTPUT
 *   One row per screen, block 'episode', with `episode`. On EVERY row
 *   (session properties), for each recalled episode <ep>:
 *     ep_<ep>_words                     the typed words (trimmed)
 *     ep_<ep>_when, _duration, _where   the typed text (trimmed), or ''
 *                                       (an empty cell) if left blank
 *     ep_<ep>_tone                      -3 ... 3
 *     ep_<ep>_intensity                 0 ... 6
 *   e.g. ep_derealization_words, ep_ordinary_tone.
 * ========================================================================= */

var EpisodesPhase = (function () {

  var TEXT_QUESTIONS = ['when', 'duration', 'where'];   // optional
  var REQUIRED = ['words', 'tone', 'intensity'];
  var TONE   = [-3, -2, -1, 0, 1, 2, 3];
  var INTENS = [0, 1, 2, 3, 4, 5, 6];
  var RECALLED = ['derealization', 'ordinary'];   // expectation is not recalled

  // The answers of this session, by episode. Read by the reinstatement
  // screens and the word ratings.
  var _answers = {};

  function _esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function _textMax() {
    return (CONFIG.episodes && CONFIG.episodes.text_max) || 200;
  }

  // The identifying words for an episode, escaped for display. On a dev
  // run that skipped the episode screens there are none; a marked dev
  // value stands in (never seen by participants: index.html always runs
  // the episode screens).
  function wordsHTML(episode) {
    var a = _answers[episode];
    if (a && a.words) return _esc(a.words);
    return '[dev: episode screens skipped]';
  }

  function answers(episode) { return _answers[episode] || null; }

  // ---------------------------------------------------------------------
  // Markup.
  // ---------------------------------------------------------------------
  function _wordsHTML(E) {
    return (
      '<fieldset class="aq aq-words" data-q="words">' +
      '<legend><label for="aq_words">' + E.words.label + '</label></legend>' +
      '<div class="aq-field">' +
      '<input type="text" class="aq-text aq-text-wide" id="aq_words" ' +
      'maxlength="' + _textMax() + '" autocomplete="off">' +
      '<span class="aq-hint">' + E.words.hint + '</span>' +
      '</div></fieldset>'
    );
  }

  // An optional text question: the field and its example hint. The label
  // carries the optional tag.
  function _textHTML(name, Q, E) {
    return (
      '<fieldset class="aq aq-optional" data-q="' + name + '">' +
      '<legend><label for="aq_' + name + '">' + Q.label +
      ' <span class="aq-optional-tag">' + E.optional_tag + '</span>' +
      '</label></legend>' +
      '<div class="aq-field">' +
      '<input type="text" class="aq-text" id="aq_' + name + '" ' +
      'maxlength="' + _textMax() + '" autocomplete="off">' +
      '<span class="aq-hint">' + Q.hint + '</span>' +
      '</div></fieldset>'
    );
  }

  // A required scale question: radio points with the end labels, none
  // selected at first.
  function _scaleHTML(name, Q, E, points) {
    var cells = '';
    points.forEach(function (v) {
      var shown = (v > 0 && name === 'tone') ? '+' + v
                : (v < 0) ? '−' + Math.abs(v) : String(v);
      cells += '<label class="aq-scale-pt"><input type="radio" name="aq_' + name +
               '" value="' + v + '"><span>' + shown + '</span></label>';
    });
    return (
      '<fieldset class="aq" data-q="' + name + '">' +
      '<legend>' + Q.label + '</legend>' +
      '<div class="aq-scale">' +
      '<span class="aq-anchor">' + Q.anchor_low + '</span>' + cells +
      '<span class="aq-anchor">' + Q.anchor_high + '</span>' +
      '</div></fieldset>'
    );
  }

  // ---------------------------------------------------------------------
  // Reading the form. Returns the answers: null for a required question
  // not yet answered, '' for an optional question left blank (saved as an
  // empty cell, not "null").
  // ---------------------------------------------------------------------
  function _read(display) {
    var out = {};
    var w = display.querySelector('#aq_words');
    out.words = w ? (String(w.value || '').trim() || null) : null;
    TEXT_QUESTIONS.forEach(function (name) {
      var f = display.querySelector('#aq_' + name);
      out[name] = f ? String(f.value || '').trim() : '';
    });
    ['tone', 'intensity'].forEach(function (name) {
      var el = display.querySelector('input[name="aq_' + name + '"]:checked');
      out[name] = el ? parseInt(el.value, 10) : null;
    });
    return out;
  }

  // Complete when the three required answers are given.
  function _complete(a) {
    for (var i = 0; i < REQUIRED.length; i++) {
      var v = a[REQUIRED[i]];
      if (v === null || v === undefined || v === '') return false;
    }
    return true;
  }

  // ---------------------------------------------------------------------
  // One episode screen.
  // ---------------------------------------------------------------------
  function _episodeNode(jsPsych, episode) {
    var result = null;
    var recalled = (RECALLED.indexOf(episode) !== -1);

    return {
      type: jsPsychCallFunction,
      async: true,
      func: function (done) {
        var E = Loader.text().episodes;
        var S = Loader.byGroup(E.screens)[episode];
        var display = jsPsych.getDisplayElement();

        var body = S.body.split('{DR_WORDS}').join(wordsHTML('derealization'));
        var qs = '';
        if (recalled) {
          qs += _wordsHTML(E);
          TEXT_QUESTIONS.forEach(function (n) { qs += _textHTML(n, E.questions[n], E); });
          qs += _scaleHTML('tone', E.questions.tone, E, TONE);
          qs += _scaleHTML('intensity', E.questions.intensity, E, INTENS);
        }

        display.innerHTML =
          '<div class="card episode-card">' +
          '<h2>' + S.title + '</h2>' + body +
          (qs ? '<p class="aq-intro">' + E.questions_intro + '</p>' +
                '<div class="aq-list">' + qs + '</div>' : '') +
          (recalled ? '<p class="hint aq-incomplete" id="aq-incomplete">' +
                      E.incomplete + '</p>' : '') +
          '<div class="btn-row">' +
          '<button id="episode-continue" class="calib-btn" type="button"' +
          (recalled ? ' disabled' : '') + '>' + E.button + '</button></div>' +
          '</div>';

        var btn = document.getElementById('episode-continue');

        if (recalled) {
          var update = function () {
            var ok = _complete(_read(display));
            btn.disabled = !ok;
            var note = document.getElementById('aq-incomplete');
            if (note) note.style.visibility = ok ? 'hidden' : 'visible';
          };
          display.addEventListener('input', update);
          display.addEventListener('change', update);
          update();
        }

        btn.addEventListener('click', function () {
          var props = {};
          if (recalled) {
            var a = _read(display);
            if (!_complete(a)) return;          // belt and braces
            _answers[episode] = a;
            ['words'].concat(TEXT_QUESTIONS, ['tone', 'intensity']).forEach(function (k) {
              props['ep_' + episode + '_' + k] = a[k];
            });
            jsPsych.data.addProperties(props);
          }
          result = props;
          if (CONFIG.debug) {
            console.log('[Episodes] ' + Loader.group() + ' / ' + episode +
                        (recalled ? ' | ' + JSON.stringify(_answers[episode]) : ''));
          }
          display.innerHTML = '';
          done();
        });
      },
      data: { block: 'episode', episode: episode },
      on_finish: function (data) {
        if (!result) return;
        for (var k in result) {
          if (Object.prototype.hasOwnProperty.call(result, k)) data[k] = result[k];
        }
      },
    };
  }

  // The selection screens, one per episode of the group.
  function buildNodes(jsPsych) {
    return Loader.episodes().map(function (ep) { return _episodeNode(jsPsych, ep); });
  }

  // ---------------------------------------------------------------------
  // The reinstatement screen at the start of a block. `b` is
  // Loader.block(position).
  // ---------------------------------------------------------------------
  function reinstateNodes(jsPsych, b) {
    return [{
      type: jsPsychHtmlButtonResponse,
      stimulus: function () {
        var R = Loader.text().reinstate;
        var title = R.title.split('{N}').join(String(b.position))
                           .split('{TOTAL}').join('2');
        var body  = Loader.byEpisode(R.body, b.episode)
                      .split('{WORDS}').join(wordsHTML(b.episode));
        return '<div class="card reinstate-card"><h2>' + title + '</h2>' +
               body + '</div>';
      },
      choices: [Loader.text().reinstate.button],
      data: { block: 'reinstate', block_position: b.position, episode: b.episode },
    }];
  }

  return {
    buildNodes:     buildNodes,
    reinstateNodes: reinstateNodes,
    wordsHTML:      wordsHTML,
    answers:        answers,
  };
})();
