// =============================================================================
// src/calibration/brightness-confirmation.js
//
// PORTED from the noise-estimation experiment, where it was tested on
// Pavlovia. What changed on the port:
//   - INSTRUCTIONS.* replaced by Loader.text().calibration.*, so the strings
//     live in text/en and text/ja like everything else participants see
//   - guarded by CONFIG.calibration.brightness
//
// WHY IT MATTERS FOR THIS EXPERIMENT
// ----------------------------------
// Haze works by lifting the shadows: lum_p05 runs from roughly 68 at the
// lowest level to 158 at the highest, so the ENTIRE haze manipulation lives
// in the dark end of the range. On a dimmed laptop those levels crush
// toward black, and a participant may not be able to distinguish the haze
// levels at all — which would look like "this person doesn't track fog"
// rather than "this person couldn't see the fog".
//
// The continue button stays disabled until BOTH checkboxes are ticked, so
// the participant has to act rather than click through.
//
// WHAT PARTICIPANTS ARE SHOWN
// ---------------------------
// The screen never mentions the pictures or how they differ (that could
// bias the answers); it gives a neutral reason ("so that the study is
// shown under similar conditions for everyone"). Below the request for
// maximum brightness, three short paragraphs:
//   - charger: devices dim the screen on battery;
//   - automatic features: switch off automatic brightness, True Tone,
//     Night Shift or night mode, blue light filters and battery saver if
//     possible (they shift brightness or colour, one of the two
//     manipulated features); participants who do not know may continue;
//   - lighting: good, steady room lighting, no changing daylight or light
//     falling on the screen, because screens adjust to room light.
// Then two required checkboxes:
//   - "My screen brightness is set to maximum."      brightness_confirmed
//   - "The room I am in has good, steady lighting."  lighting_confirmed
//
// OUTPUT (jsPsych data, session-level):
//   brightness_confirmed  bool
//   lighting_confirmed    bool
// =============================================================================

var BrightnessConfirmation = (function () {

  function getNodes(jsPsych) {

    var confirmNode = {
      type: jsPsychCallFunction,
      async: true,
      func: function (done) {

        var T = Loader.text().calibration;
        var display = jsPsych.getDisplayElement();

        display.innerHTML =
          '<div class="calibration-card">' +
          '<h2>' + T.brightness_title + '</h2>' +
          T.brightness_intro +
          '<div class="calib-note">' +
          T.brightness_charger + T.brightness_auto + T.brightness_lighting +
          '</div>' +
          '<label class="check-line">' +
          '<input type="checkbox" id="brightness-checkbox">' +
          '<span>' + T.brightness_checkbox + '</span>' +
          '</label>' +
          '<label class="check-line">' +
          '<input type="checkbox" id="lighting-checkbox">' +
          '<span>' + T.lighting_checkbox + '</span>' +
          '</label>' +
          '<div class="btn-row">' +
          '<button id="brightness-continue-btn" class="calib-btn" ' +
          'disabled style="opacity:0.35; cursor:not-allowed;">' +
          T.button_continue +
          '</button>' +
          '</div>' +
          '</div>';

        var boxB        = document.getElementById('brightness-checkbox');
        var boxL        = document.getElementById('lighting-checkbox');
        var continueBtn = document.getElementById('brightness-continue-btn');

        function update() {
          var ok = boxB.checked && boxL.checked;
          continueBtn.disabled      = !ok;
          continueBtn.style.opacity = ok ? '1' : '0.35';
          continueBtn.style.cursor  = ok ? 'pointer' : 'not-allowed';
        }
        boxB.addEventListener('change', update);
        boxL.addEventListener('change', update);

        continueBtn.addEventListener('click', function () {
          if (!(boxB.checked && boxL.checked)) return;
          jsPsych.data.addProperties({
            brightness_confirmed: boxB.checked,
            lighting_confirmed:   boxL.checked,
          });
          console.log('[Brightness] confirmed: ' + boxB.checked +
                      ', lighting: ' + boxL.checked);
          display.innerHTML = '';
          done();
        });
      },

      data: { block: 'calibration_brightness' },
    };

    return [confirmNode];
  }

  return { getNodes: getNodes };

})();
