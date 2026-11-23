/* =========================================================================
 * phases/cds.js: four CDS items, trait format, after the word ratings.
 *
 * ONE SCREEN: the instructions, then items 2, 13, 19 and 29 of the
 * Cambridge Depersonalisation Scale, in that fixed order. The wording is
 * verbatim (text/<lang>/instructions.js, section `cds`); only "circle" is
 * replaced by "select".
 *
 * EACH ITEM
 *   frequency  0..4 (never ... all the time), no default, required.
 *   duration   1..6 (few seconds ... more than a week). Shown only when the
 *              frequency is not 0, and then required. Setting the
 *              frequency back to 0 clears and hides it.
 * Continue stays disabled until every item is complete.
 *
 * Switch: CONFIG.blocks.cds (default on). The same for both groups.
 *
 * OUTPUT
 *   One row, block 'cds', and per item (cds_q02, cds_q13, cds_q19, cds_q29):
 *     cds_<id>_freq   0..4
 *     cds_<id>_dur    1..6, or 0 when not asked (frequency 0), as in the
 *                     CDS scoring
 *     cds_<id>_score  frequency + duration, 0..10
 *   and rt (ms from the screen appearing to Continue).
 * ========================================================================= */

var CdsPhase = (function () {

  var IDS = ['q02', 'q13', 'q19', 'q29'];

  function _esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function _itemHTML(item, C) {
    var n = item.id;
    var freq = C.freq_options.map(function (lab, v) {
      return '<label class="cds-opt"><input type="radio" name="cds_' + n +
             '_freq" value="' + v + '"><span>' + lab + '</span></label>';
    }).join('');
    var dur = C.dur_options.map(function (lab, i) {
      return '<label class="cds-opt"><input type="radio" name="cds_' + n +
             '_dur" value="' + (i + 1) + '"><span>' + lab + '</span></label>';
    }).join('');
    return (
      '<div class="cds-item" data-item="' + n + '">' +
      '<p class="cds-text">' + item.label + '</p>' +
      '<div class="cds-scale cds-freq">' + freq + '</div>' +
      '<div class="cds-dur" id="cds_' + n + '_durbox" hidden>' +
      '<div class="cds-dur-heading">' + C.dur_heading + '</div>' +
      '<div class="cds-scale">' + dur + '</div>' +
      '</div>' +
      '</div>'
    );
  }

  // The answers so far: { q02: {freq, dur}, ... }, null where missing.
  function _read(display) {
    var out = {};
    IDS.forEach(function (n) {
      var f = display.querySelector('input[name="cds_' + n + '_freq"]:checked');
      var d = display.querySelector('input[name="cds_' + n + '_dur"]:checked');
      out[n] = { freq: f ? parseInt(f.value, 10) : null,
                 dur:  d ? parseInt(d.value, 10) : null };
    });
    return out;
  }

  function _complete(a) {
    return IDS.every(function (n) {
      if (a[n].freq === null) return false;
      return a[n].freq === 0 || a[n].dur !== null;
    });
  }

  function buildNodes(jsPsych) {
    var result = null;
    return [{
      type: jsPsychCallFunction,
      async: true,
      func: function (done) {
        var C = Loader.text().cds;
        var display = jsPsych.getDisplayElement();
        var t0 = performance.now();
        result = null;

        display.innerHTML =
          '<div class="card cds-card">' + C.instructions +
          '<div class="cds-list">' +
          C.items.map(function (it) { return _itemHTML(it, C); }).join('') +
          '</div>' +
          '<p class="hint cds-incomplete" id="cds-incomplete">' + C.incomplete + '</p>' +
          '<div class="btn-row"><button id="cds-continue" class="calib-btn" ' +
          'type="button" disabled>' + C.button_submit + '</button></div>' +
          '</div>';

        var btn = document.getElementById('cds-continue');
        var note = document.getElementById('cds-incomplete');
        function update() {
          var ok = _complete(_read(display));
          btn.disabled = !ok;
          note.style.visibility = ok ? 'hidden' : 'visible';
        }
        IDS.forEach(function (n) {
          var box = document.getElementById('cds_' + n + '_durbox');
          display.querySelectorAll('input[name="cds_' + n + '_freq"]').forEach(function (r) {
            r.addEventListener('change', function () {
              var zero = (r.value === '0');
              if (zero) {
                display.querySelectorAll('input[name="cds_' + n + '_dur"]')
                       .forEach(function (d) { d.checked = false; });
              }
              box.hidden = zero;
              update();
            });
          });
          display.querySelectorAll('input[name="cds_' + n + '_dur"]').forEach(function (r) {
            r.addEventListener('change', update);
          });
        });
        update();

        btn.addEventListener('click', function () {
          var a = _read(display);
          if (!_complete(a)) return;
          result = { rt: Math.round(performance.now() - t0) };
          IDS.forEach(function (n) {
            var f = a[n].freq, d = (f === 0) ? 0 : a[n].dur;
            result['cds_' + n + '_freq']  = f;
            result['cds_' + n + '_dur']   = d;
            result['cds_' + n + '_score'] = f + d;
          });
          if (CONFIG.debug) console.log('[CDS]', result);
          display.innerHTML = '';
          done();
        });
      },
      data: { block: 'cds' },
      on_finish: function (data) {
        if (!result) return;
        for (var k in result) {
          if (Object.prototype.hasOwnProperty.call(result, k)) data[k] = result[k];
        }
      },
    }];
  }

  return { buildNodes: buildNodes, IDS: IDS, _esc: _esc };
})();
