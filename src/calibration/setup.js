// =============================================================================
// src/calibration/setup.js
//
// SET-UP SCREEN, shown straight before the brightness screen (switch:
// CONFIG.calibration.setup). One screen, no checkbox, a Continue button:
//   - position: the computer on a desk or table, ideally with the screen
//     at about eye level; otherwise the same position and distance
//     throughout;
//   - distractions: no phone or other devices during the study, including
//     the breaks;
//   - for laptops and desktops alike.
// The wording is in Loader.text().calibration.setup_title / setup_body,
// followed by the reload warning (session.reload_warning).
// Like the other set-up screens it never mentions the pictures.
//
// OUTPUT: one row with block = 'setup' (its rt is the time on the screen).
// Nothing else is recorded.
// =============================================================================

var SetupScreen = (function () {

  function getNodes(jsPsych) {
    var node = {
      type: jsPsychCallFunction,
      async: true,
      func: function (done) {
        var T = Loader.text().calibration;
        var display = jsPsych.getDisplayElement();
        var t0 = performance.now();

        display.innerHTML =
          '<div class="calibration-card">' +
          '<h2>' + T.setup_title + '</h2>' +
          T.setup_body +
          // Do not reload or close the page (also before block 1's practice).
          Loader.text().session.reload_warning +
          '<div class="btn-row">' +
          '<button id="setup-continue-btn" class="calib-btn">' +
          T.button_continue + '</button>' +
          '</div>' +
          '</div>';

        document.getElementById('setup-continue-btn').addEventListener('click', function () {
          var rt = Math.round(performance.now() - t0);
          display.innerHTML = '';
          done({ rt: rt });
        }, { once: true });
      },
      data: { block: 'setup' },
    };
    return [node];
  }

  return { getNodes: getNodes };

})();
