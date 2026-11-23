/* =========================================================================
 * phases/rest.js — the fixed rest between the two blocks.
 *
 * One screen with a countdown from CONFIG.timing.rest_ms (60 s). The
 * Continue button appears only when the countdown reaches zero, so the
 * rest is the same length for everyone (it can be longer, never shorter).
 *
 * The countdown is computed from the clock, not by counting ticks, so a
 * busy or throttled tab still ends it on time.
 *
 * OUTPUT
 *   One row, block 'rest'. On every row (session properties):
 *     rest_start     when the rest screen appeared (UTC, ISO 8601)
 *     rest_end       when Continue was pressed
 *   On the rest row: rest_ms (the fixed length) and rest_extra_ms (how long
 *   Continue was on screen before it was pressed).
 * ========================================================================= */

var RestPhase = (function () {

  function _mmss(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60);
    s = s % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function buildNodes(jsPsych) {
    var result = null;
    var resumedLeft = null;

    return [{
      type: jsPsychCallFunction,
      async: true,
      func: function (done) {
        var R = Loader.text().rest;
        var total = CONFIG.timing.rest_ms;
        var start = new Date();
        var shownAt = null;
        // Resumed at the rest: only the time that remained, and rest_start
        // keeps its first value.
        var already = Progress.takeRestElapsed();
        var restStart = start;
        if (already !== null) {
          resumedLeft = Math.max(0, total - already.elapsed);
          total = resumedLeft;
          if (already.start) restStart = new Date(already.start);
        }
        Record.markRest(jsPsych, 'start', restStart);
        var lastBeat = 0;

        var display = jsPsych.getDisplayElement();
        display.innerHTML =
          '<div class="card rest-card"><h2>' + R.title + '</h2>' + R.body +
          '<p class="rest-clock" id="rest-clock">' + _mmss(total) + '</p>' +
          '<p class="hint" id="rest-wait">' + R.wait + '</p>' +
          '<div class="btn-row"><button id="rest-continue" class="calib-btn" ' +
          'type="button" style="display:none">' + R.button + '</button></div>' +
          '</div>';

        var clock = document.getElementById('rest-clock');
        var wait  = document.getElementById('rest-wait');
        var btn   = document.getElementById('rest-continue');

        var timer = setInterval(function () {
          var spent = Date.now() - start.getTime();
          var left = total - spent;
          clock.textContent = _mmss(left);
          // The rest's elapsed time, saved every second for a resume.
          if (spent - lastBeat >= 1000 && left > 0) {
            lastBeat = spent;
            Progress.restHeartbeat((CONFIG.timing.rest_ms - total) + spent,
                                   restStart.toISOString());
          }
          if (left <= 0) {
            clearInterval(timer);
            shownAt = new Date();
            clock.textContent = _mmss(0);
            wait.innerHTML = R.done;
            btn.style.display = '';
            btn.focus();
          }
        }, 200);

        btn.addEventListener('click', function () {
          var end = new Date();
          Record.markRest(jsPsych, 'end', end);
          result = {
            rest_ms:       CONFIG.timing.rest_ms,
            // On a resumed rest: the time that remained when it resumed.
            rest_resumed_left_ms: resumedLeft,
            rest_extra_ms: shownAt ? end.getTime() - shownAt.getTime() : null,
          };
          if (CONFIG.debug) console.log('[Rest] done', result);
          display.innerHTML = '';
          done();
        }, { once: true });
      },
      data: { block: 'rest' },
      on_finish: function (data) {
        if (!result) return;
        for (var k in result) {
          if (Object.prototype.hasOwnProperty.call(result, k)) data[k] = result[k];
        }
      },
    }];
  }

  return { buildNodes: buildNodes };
})();
