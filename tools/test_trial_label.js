#!/usr/bin/env node
/* =============================================================================
 * tools/test_trial_label.js — browser test of the developer trial label.
 *
 *   node tools/test_trial_label.js
 *
 * Serves the repository on a local port, drives the experiment in headless
 * Chromium and checks:
 *
 *   1. index.html, the config as shipped: a real session (consent, full
 *      screen, ID, brightness, gamma, episodes, block 1 practice and its
 *      first 11 main trials, which include a catch trial). No label on any
 *      trial, feedback or catch screen, and none in the recorded data —
 *      even though the test switches CONFIG.dev.trial_label on in the page
 *      once the session has started (the label must also depend on
 *      dev.html itself, not only on the setting).
 *   2. index.html with CONFIG.dev.trial_label = true in config.js: the
 *      session is refused (validation report with debug on, the neutral
 *      error screen with debug off); the consent screen never appears.
 *   3. dev.html, the "Trial label" box on (its default): both blocks with
 *      practice, 42 main trials each (slot 11: a catch at trial 32 and a
 *      consistency repeat at 42 in block 1). Every practice, feedback, main
 *      and catch screen shows exactly the expected label, worked out here
 *      from the package's own JSON files; nothing of it reaches the data.
 *   4. dev.html, the box off: no label anywhere, and the same columns and
 *      the same `stimulus` HTML as with it on.
 *
 * Needs Node 18+ and Playwright with its Chromium. Install them OUTSIDE the
 * repository, so nothing is added to it (or synced to Pavlovia):
 *
 *   npm install --prefix ~/.cache/dpdr-test playwright
 *   npx --prefix ~/.cache/dpdr-test playwright install chromium
 *   NODE_PATH=~/.cache/dpdr-test/node_modules node tools/test_trial_label.js
 *
 * Takes about 5 minutes. Exit status 0 = all checks passed, 1 = a failure.
 * Nothing is uploaded: every request that is not to the local server is
 * blocked, and the dev runs save locally.
 * ========================================================================== */
'use strict';

const fs   = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PKG  = path.join(ROOT, 'data/sets/v5b_180/');
const TEST_ID = 'Z_21121989';

// --- A static server for the repository ------------------------------------
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
                '.json': 'application/json', '.png': 'image/png', '.csv': 'text/csv' };
function serve() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end(); return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

// --- The expected label, worked out independently from the package --------
const read = (rel) => JSON.parse(fs.readFileSync(path.join(PKG, rel), 'utf8'));
const design = read('design.json');
const assignment = read('assignment.json');

function sd(v) {
  let r = Math.round(v * 100) / 100;
  if (r === 0) r = 0;
  return (r >= 0 ? '+' : '−') + Math.abs(r).toFixed(2);
}
function expectedLabel(row, position, practice) {
  const parts = ['Block ' + position];
  if (practice) {
    parts.push('practice ' + practice.n + '/' + practice.of, row.pair_type);
  } else {
    parts.push(row.trial + '/' + design.main_trials_per_block,
               row.trial_type + (row.pair_type !== row.trial_type ? ' (' + row.pair_type + ')' : ''));
  }
  parts.push(row.item_id, 'A on ' + (row.a_is_left ? 'left' : 'right'),
             'colour ' + sd(row.pred_sat) + ' SD, contrast ' + sd(row.pred_fog) + ' SD');
  if (row.trial_type === 'consistency') parts.push('repeat of trial ' + row.repeat_of);
  if (row.trial_type === 'catch') {
    const k = (catchCount[position] = (catchCount[position] || 0) + 1) - 1;
    const t = design.catch.targets_by_block_position[position][k];
    parts.push('target ' + (t === 'ArrowUp' ? '↑ ' : '↓ ') + t + ' (images not shown)');
  }
  return parts.join(' · ');
}
let catchCount = {};

// The rows of block `position` for a group and slot, as assignment.json says.
function blockRows(group, slot, position) {
  const rowNo = ((slot - 1) % assignment.slots_per_group) + 1;
  const a = assignment.groups[group].find((r) => r.slot === rowNo);
  const b = a.blocks.find((x) => x.position === position);
  return { list: read(design.lists[b.list].file), practice: read(b.practice).slice(0, 3) };
}

// --- Driving the experiment -------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LABELLED = ['pairs', 'practice_feedback', 'catch_lockout'];

async function state(page) {
  return page.evaluate(() => {
    if (typeof jsPsych === 'undefined' || !jsPsych.getCurrentTrial) return null;
    const t = jsPsych.getCurrentTrial();
    if (!t) return null;
    const d = (typeof t.data === 'function') ? t.data() : (t.data || {});
    return {
      block: d.block, is_catch: d.is_catch, catch_target: d.catch_target,
      block_trial: d.block_trial, phase: d.phase, block_position: d.block_position,
      end: !!document.querySelector('.end-card'),
      label: (document.querySelector('.dev-trial-label') || {}).textContent || null,
      drawn: !!document.querySelector('.stim-row, .catch-screen'),
    };
  });
}

// Runs until the completion screen, or until `stopAfterMain` main trials
// have been answered. Returns every labelled screen seen, with its label.
async function autopilot(page, opts = {}) {
  const screens = [];
  let last = null, lastAt = 0, main = 0;
  const deadline = Date.now() + (opts.timeoutMs || 8 * 60 * 1000);
  while (Date.now() < deadline) {
    let s = await state(page);
    if (!s) { await sleep(40); continue; }
    if (s.end) return screens;
    if (opts.onState) await opts.onState(s);
    const sig = JSON.stringify([s.block, s.block_trial, s.phase, s.block_position]);
    if (sig === last && Date.now() - lastAt < 400) { await sleep(25); continue; }
    if (sig !== last && LABELLED.includes(s.block)) {
      // The label is added in on_load, just after the screen is drawn.
      if (!s.drawn) { await sleep(25); continue; }
      await sleep(40);
      s = await state(page);
      screens.push({ block: s.block, position: s.block_position, phase: s.phase,
                     trial: s.block_trial, label: s.label });
    }
    last = sig; lastAt = Date.now();
    try {
      switch (s.block) {
        case 'consent':
          await page.click('#consent-checkbox'); await page.click('#consent-agree'); break;
        case 'fullscreen':
          await page.click('#jspsych-fullscreen-btn'); break;
        case 'participant_id':
          await page.click('#jspsych-survey-html-form-next'); break;
        case 'calibration_brightness':
          await page.click('#brightness-checkbox'); await page.click('#brightness-continue-btn'); break;
        case 'episode':
          await page.waitForSelector('#episode-continue');
          if (await page.$('#aq_words')) {
            await page.fill('#aq_words', 'test words');
            await page.fill('#aq_when', 'last month');
            await page.click('#aq_duration_pn');
            await page.fill('#aq_where', 'at home');
            await page.click('input[name="aq_tone"][value="0"]');
            await page.click('input[name="aq_intensity"][value="3"]');
          }
          await page.click('#episode-continue'); break;
        case 'reinstate':
          await page.click('.jspsych-btn'); break;
        case 'practice_intro': case 'practice_end': case 'break':
          await page.keyboard.press('Space'); break;
        case 'pairs':
          await page.keyboard.press(s.is_catch ? s.catch_target
                                   : (s.block_trial % 2 ? 'ArrowLeft' : 'ArrowRight'));
          if (s.phase === 'main' && ++main >= (opts.stopAfterMain || Infinity)) return screens;
          break;
        case 'rest':
          await page.waitForSelector('#rest-continue', { state: 'visible', timeout: 120000 });
          await page.click('#rest-continue'); break;
        default: {
          // Gamma: the instruction screen, then three slider matches.
          const did = await page.evaluate(() => {
            const sl = document.getElementById('gamma-slider');
            const ok = document.getElementById('gamma-confirm-btn');
            if (sl && ok) {
              sl.value = String((Number(sl.min) + Number(sl.max)) / 2 + 3);
              sl.dispatchEvent(new Event('input', { bubbles: true }));
              if (!ok.disabled) { ok.click(); return true; }
              return true;
            }
            const b = document.querySelector('.ne-continue-btn');
            if (b && document.querySelector('.calibration-card')) { b.click(); return true; }
            return false;
          });
          await sleep(did ? 150 : 30);
        }
      }
    } catch (e) {
      await sleep(50);            // the screen changed under us; look again
    }
  }
  throw new Error('timed out at ' + last);
}

async function recorded(page) {
  return page.evaluate(() => jsPsych.data.get().values());
}

// --- Checks -------------------------------------------------------------------
const results = [];
function check(name, ok, detail) {
  results.push(!!ok);
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok || detail === undefined ? '' : '\n       ' + detail));
}
// Nothing of the label in any recorded value.
function labelInData(rows, labels) {
  const hits = [];
  rows.forEach((r, i) => Object.keys(r).forEach((k) => {
    const v = (typeof r[k] === 'string') ? r[k] : JSON.stringify(r[k]);
    if (/dev-trial-label/.test(k) || /dev-trial-label/.test(v || '') ||
        labels.some((l) => l && (v || '').indexOf(l) !== -1)) hits.push(i + ':' + k);
  }));
  return hits;
}

(async () => {
  const server = await serve();
  const BASE = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch({ args: ['--disable-background-timer-throttling',
                                                 '--disable-renderer-backgrounding'] });
  const config = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');

  async function open(url, configBody) {
    const ctx = await browser.newContext({ viewport: { width: 1400, height: 950 },
                                           acceptDownloads: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.route('**/*', (route) => {
      const u = route.request().url();
      if (!u.startsWith(BASE)) return route.abort();
      if (configBody && u.split('?')[0].endsWith('/config.js')) {
        return route.fulfill({ contentType: 'application/javascript', body: configBody });
      }
      return route.continue();
    });
    await page.goto(BASE + url);
    page.errors = errors;
    return page;
  }

  try {
    // 1. index.html as shipped, with the setting switched on mid-session.
    console.log('\n1. index.html (config as shipped; CONFIG.dev.trial_label forced on in the page)');
    {
      const page = await open('index.html?group=participant&slot=3&pid=' + TEST_ID);
      let forced = false;
      const screens = await autopilot(page, {
        stopAfterMain: 11,
        onState: async (s) => {
          if (!forced && s.block === 'consent') {
            await page.evaluate(() => { CONFIG.dev = CONFIG.dev || {}; CONFIG.dev.trial_label = true; });
            forced = true;
          }
        },
      });
      const rows = await recorded(page);
      const kinds = screens.reduce((a, s) => { a[s.block + '/' + s.phase] = (a[s.block + '/' + s.phase] || 0) + 1; return a; }, {});
      check('the session reached practice, feedback, main and catch screens',
            kinds['pairs/practice'] === 3 && kinds['practice_feedback/undefined'] === 3 &&
            kinds['pairs/main'] === 11 && kinds['catch_lockout/undefined'] === 1,
            JSON.stringify(kinds));
      check('CONFIG.dev.trial_label was on in the page', forced &&
            await page.evaluate(() => CONFIG.dev.trial_label === true));
      const shown = screens.filter((s) => s.label !== null);
      check('no label on any of the ' + screens.length + ' trial screens', !shown.length,
            JSON.stringify(shown.slice(0, 3)));
      check('no .dev-trial-label element in the page',
            !(await page.$('.dev-trial-label')));
      check('nothing of a label in the recorded data', !labelInData(rows, []).length);
      check('no page errors', !page.errors.length, page.errors.join('\n'));
      await page.context().close();
    }

    // 2. index.html refuses a config with the label on.
    console.log('\n2. index.html with dev.trial_label = true in config.js');
    for (const debug of [true, false]) {
      const body = config.replace(/trial_label:\s*false/, 'trial_label: true')
                         .replace(/debug:\s*(true|false),/, 'debug: ' + debug + ',');
      if (body === config) throw new Error('could not switch the label on in config.js');
      const page = await open('index.html?group=participant&slot=3&pid=' + TEST_ID, body);
      await sleep(1500);
      const text = await page.evaluate(() => document.body.innerText);
      const consent = /Consent to take part/.test(text);
      check('debug ' + debug + ': refused before the consent screen' +
            (debug ? ', naming CONFIG.dev.trial_label' : ' (neutral error screen)'),
            !consent && (debug ? /Validation failed[\s\S]*CONFIG\.dev\.trial_label/.test(text)
                               : /Something went wrong/.test(text)),
            text.slice(0, 300));
      await page.context().close();
    }

    // 3 and 4. dev.html with the box on, then off.
    const GROUP = 'participant', SLOT = 11, N = 42;
    let onRows = null;
    for (const on of [true, false]) {
      console.log('\n' + (on ? '3' : '4') + '. dev.html, trial label ' + (on ? 'on (default)' : 'off') +
                  ', slot ' + SLOT + ', ' + N + ' main trials per block');
      const page = await open('dev.html?group=' + GROUP + '&slot=' + SLOT + '&pid=' + TEST_ID);
      await page.waitForSelector('#dev-run-custom');
      check('the "Trial label" box is ' + (on ? 'on by default' : 'switched off'),
            await page.isChecked('#dev-trial-label') === true);
      if (!on) await page.uncheck('#dev-trial-label');
      // Custom session: practice and main trials of both blocks only.
      await page.evaluate(() => {
        document.querySelectorAll('.dev-switches input').forEach((b) => {
          const k = b.getAttribute('data-block');
          b.checked = (k === 'practice' || k === 'main' || b.hasAttribute('data-position'));
        });
      });
      await page.fill('#dev-n', String(N));
      await page.click('#dev-run-custom');
      catchCount = {};
      const screens = await autopilot(page);
      const rows = await recorded(page);

      if (on) {
        const want = [];
        [1, 2].forEach((p) => {
          const { list, practice } = blockRows(GROUP, SLOT, p);
          practice.forEach((r, i) => {
            const l = expectedLabel(r, p, { n: i + 1, of: practice.length });
            want.push(['pairs', p, l], ['practice_feedback', p, l]);
          });
          list.slice(0, N).forEach((r) => {
            const l = expectedLabel(r, p);
            if (r.trial_type === 'catch') want.push(['catch_lockout', p, l]);
            want.push(['pairs', p, l]);
          });
        });
        const got = screens.map((s) => [s.block, s.position, s.label]);
        const bad = [];
        want.forEach((w, i) => {
          if (JSON.stringify(w) !== JSON.stringify(got[i])) bad.push({ i, want: w, got: got[i] });
        });
        check('every screen shows the expected label (' + want.length + ' screens: 2 x (3 practice' +
              ' + 3 feedback + ' + N + ' main + catch lockouts))',
              !bad.length && got.length === want.length,
              bad.length ? JSON.stringify(bad.slice(0, 3)) : got.length + ' vs ' + want.length);
        const sample = (t) => (screens.find((s) => s.label && s.label.indexOf(t) !== -1) || {}).label;
        console.log('     e.g. ' + sample('/200 \u00b7 sat_only') + '\n          ' + sample('consistency') +
                    '\n          ' + sample('catch') + '\n          ' + sample('practice'));
        check('a consistency label names the repeated trial', /repeat of trial \d+$/.test(sample('consistency') || ''));
        check('a catch label names the target', /target [↑↓] Arrow(Up|Down)/.test(sample('catch') || ''));
        check('nothing of a label in the recorded data',
              !labelInData(rows, screens.map((s) => s.label)).length,
              labelInData(rows, screens.map((s) => s.label)).slice(0, 5).join(', '));
        onRows = rows;
      } else {
        check('no label on any of the ' + screens.length + ' trial screens',
              screens.length > 0 && screens.every((s) => s.label === null));
        const cols = (rs) => [...new Set(rs.flatMap((r) => Object.keys(r)))].sort().join(',');
        check('the same columns as with the label on', cols(rows) === cols(onRows));
        const stim = (rs) => rs.filter((r) => r.block === 'pairs').map((r) => r.stimulus).join('\n');
        check('the same recorded stimulus HTML as with the label on', stim(rows) === stim(onRows));
      }
      check('no page errors', !page.errors.length, page.errors.join('\n'));
      await page.context().close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  const failed = results.filter((r) => !r).length;
  console.log('\n' + (failed ? 'FAIL: ' + failed + ' of ' + results.length + ' checks failed'
                             : 'PASS: all ' + results.length + ' checks'));
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
