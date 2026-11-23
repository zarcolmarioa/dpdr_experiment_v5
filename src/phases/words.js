/* =========================================================================
 * phases/words.js — the word rating task.
 *
 * WHERE IT RUNS
 *   Once, after block 2 and before the CDS items (see main.js for the
 *   session order). Participants rate the derealization episode (the
 *   episode they described in the interview, named with their own
 *   identifying words, whichever block came last); controls rate their
 *   expectation of how the surroundings look to someone experiencing
 *   derealization.
 *
 * TWO SCREENS
 *   1. Instructions, with a Continue button.
 *   2. The rating grid: a one-line question, then ten rows.
 *
 * Splitting them is what makes the grid fit without scrolling. The whole
 * grid must be visible at once, so the participant can compare their
 * answers across words. The grid itself is phases/rating-grid.js, shared
 * by no other screen now (the CDS items have their own layout).
 *
 * GROUP
 *   The instruction and the one-line question are the only group-dependent
 *   strings (text/<lang>/words.js, keyed participant / control). In the
 *   participant version, {WORDS} is replaced by the participant's own
 *   identifying words for the derealization episode.
 *
 * ORDER
 *   The ten words are shown in a random order per participant (Fisher-
 *   Yates), and the order shown is recorded as word_order.
 *
 * OUTPUT
 *   One row, block 'word_ratings' (the grid screen's own row): word_<id>
 *   for each of the ten words, plus word_order, word_range, word_mean, rt.
 *   The instruction screen before it is a row of its own,
 *   block 'word_instructions', holding no responses.
 *   record.js promotes the two targets, foggy and faded, to session-level
 *   columns (rating_foggy, rating_faded) so they sit on every row.
 * ========================================================================= */

var WordsPhase = (function () {

  function words() {
    return Loader.words();
  }

  // Participants rate the DEREALIZATION episode, whichever block came last;
  // the instruction names it and shows their own identifying words
  // ({WORDS}, HTML-escaped). Controls rate their expectation (no {WORDS}).
  function _fillWords(s) {
    return String(s).split('{WORDS}').join(EpisodesPhase.wordsHTML('derealization'));
  }

  // Fisher-Yates, so presentation order does not favour the targets.
  function _shuffled(items) {
    var a = items.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // -----------------------------------------------------------------------
  // Screen 1: instructions.
  // -----------------------------------------------------------------------
  function _instructionNode() {
    var W = words();
    return {
      type: jsPsychHtmlButtonResponse,
      // A function, so the participant's words (entered on the episode
      // screens, after this node was built) are filled in when it shows.
      stimulus: function () {
        return '<div class="card word-intro"><h2>' + W.title + '</h2>' +
               _fillWords(Loader.byGroup(W.instruction)) + '</div>';
      },
      choices: [W.button_begin],
      data: { block: 'word_instructions' },
    };
  }

  // -----------------------------------------------------------------------
  // Screen 2: the grid.
  //
  // Built with call-function/async rather than a plugin, so the markup and
  // the enable-on-complete behaviour are under direct control.
  // -----------------------------------------------------------------------
  //
  // The ratings are copied onto the node's OWN row in on_finish, so the
  // screen is exactly one row, block 'word_ratings'. (jsPsych.data.write
  // is not used: it merges the current trial's `data` over the written
  // object, which relabelled the ratings row as the grid screen's block.)
  function _gridNode(jsPsych) {
    var W      = words();
    var order  = _shuffled(W.items);
    var result = null;

    return {
      type: jsPsychCallFunction,
      async: true,
      func: function (done) {
        var display = jsPsych.getDisplayElement();

        RatingGrid.render(display, {
          question:    _fillWords(Loader.byGroup(W.question_short)),
          items:       order,
          anchor_low:  W.anchor_low,
          anchor_high: W.anchor_high,
          button:      W.button_submit,
          progress:    W.progress,
        }, function (ratings, rt) {
          var vals = order.map(function (i) { return ratings[i.id]; })
                          .filter(function (v) { return v !== null; });

          var data = {
            word_order: order.map(function (i) { return i.id; }).join(','),
            rt:         rt,
          };
          order.forEach(function (item) {
            data['word_' + item.id] = ratings[item.id];
          });

          // Someone who gives every word the same value is not describing
          // an experience, and their target ratings carry no information.
          data.word_range = vals.length
            ? Math.max.apply(null, vals) - Math.min.apply(null, vals) : null;
          data.word_mean = vals.length
            ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : null;

          result = data;
          Record.stampWordRatings(jsPsych, ratings);

          if (CONFIG.debug) {
            console.log('[Words] ratings:', ratings,
                        '| range:', data.word_range,
                        '| rt:', data.rt + 'ms');
          }

          display.innerHTML = '';
          done();
        });
      },
      data: { block: 'word_ratings' },
      on_finish: function (data) {
        if (!result) return;
        for (var k in result) {
          if (Object.prototype.hasOwnProperty.call(result, k)) data[k] = result[k];
        }
      },
    };
  }

  function buildNodes(jsPsych) {
    return [_instructionNode(), _gridNode(jsPsych)];
  }

  return { buildNodes: buildNodes, words: words };
})();
