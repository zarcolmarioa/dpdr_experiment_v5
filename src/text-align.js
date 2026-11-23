/* =========================================================================
 * text-align.js — centre text that fits on one line, justify the rest.
 *
 * The rule for participant text (both languages):
 *   - titles, buttons and the question above the images: always centred
 *     (CSS);
 *   - paragraphs, hints, notes and checkbox sentences: CENTRED when they
 *     fit on one line in this participant's window, JUSTIFIED when they
 *     wrap.
 * CSS cannot tell a one-line paragraph from a wrapped one, so this script
 * counts the rendered lines of each candidate and adds the class
 * `one-line` to those with a single line (css/experiment.css centres
 * them; everything else in a card is justified).
 *
 * BEFORE THE SCREEN IS SHOWN. The script runs from a MutationObserver. Its
 * callback runs as a microtask straight after jsPsych (or a phase) writes
 * a screen's HTML and before the browser paints it, and line breaks do not
 * depend on the alignment, so measuring and setting the class there means
 * the text appears already aligned and never visibly moves. On a window
 * resize (entering full screen, for example) the visible screen is
 * measured again.
 *
 * FORM LAYOUTS are left as they are: the episode questions (.aq-list) and
 * the rating grids (.wr-wrap) keep their alignment. The catch screen is
 * centred by its own CSS.
 *
 * Nothing here is recorded in the data.
 * ========================================================================= */

(function () {

  // Text blocks the rule applies to, inside the text-screen containers.
  var CANDIDATES = [
    '.card p', '.card .hint', '.card li',
    '.calibration-card p', '.calibration-card .hint', '.calibration-card li',
    '.check-line span',
  ].join(', ');

  // Containers whose content keeps its own form alignment.
  var EXEMPT = '.aq-list, .wr-wrap';

  // Number of rendered lines of an element's text: the distinct line boxes
  // of its inline content.
  function _lines(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var rects = range.getClientRects();
    var tops = [];
    for (var i = 0; i < rects.length; i++) {
      var r = rects[i];
      if (r.width < 1 || r.height < 1) continue;
      var t = Math.round(r.top + r.height / 2);
      var seen = false;
      for (var j = 0; j < tops.length; j++) {
        if (Math.abs(tops[j] - t) < r.height / 2) { seen = true; break; }
      }
      if (!seen) tops.push(t);
    }
    return tops.length;
  }

  function _apply(el) {
    if (!el || el.nodeType !== 1 || !el.isConnected) return;
    if (el.closest(EXEMPT)) return;
    var n = _lines(el);
    if (n === 0) return;                       // hidden or empty: leave it
    el.classList.toggle('one-line', n === 1);
    el.classList.toggle('multi-line', n > 1);
  }

  function _scan(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.matches && root.matches(CANDIDATES)) _apply(root);
    var list = root.querySelectorAll ? root.querySelectorAll(CANDIDATES) : [];
    for (var i = 0; i < list.length; i++) _apply(list[i]);
  }

  // Re-measure the candidate that contains a changed node (text replaced
  // inside a paragraph, for example the rest screen's countdown note).
  function _scanAround(node) {
    var el = (node.nodeType === 1) ? node : node.parentElement;
    if (!el) return;
    var host = el.closest ? el.closest(CANDIDATES) : null;
    if (host) _apply(host);
  }

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === 'childList') {
        for (var j = 0; j < m.addedNodes.length; j++) _scan(m.addedNodes[j]);
        _scanAround(m.target);
      } else if (m.type === 'characterData') {
        _scanAround(m.target);
      }
    }
  });

  function _start() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    _scan(document.body);
    var pending = false;
    window.addEventListener('resize', function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () { pending = false; _scan(document.body); });
    });
  }

  if (document.body) _start();
  else document.addEventListener('DOMContentLoaded', _start);

  // For the tests and the dev tools.
  window.TextAlign = { scan: _scan, lines: _lines };
})();
