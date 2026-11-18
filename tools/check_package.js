#!/usr/bin/env node
/* =============================================================================
 * tools/check_package.js — check the stimulus package and the texts offline.
 *
 *   usage:  node tools/check_package.js [<set name>]      (default: CONFIG.data.set)
 *
 * Runs, in Node, the SAME checks the experiment runs in the browser before
 * it starts (src/validate.js: checkPackage, checkText, checkConfig, with
 * the settings index.html would use), and adds the checks the browser
 * cannot make:
 *
 *   - every image named by any list row (catch rows included) or practice
 *     row, and every path in preload.json, exists on disk;
 *   - every file in stimuli/ is listed in manifest.csv with the same
 *     SHA-256, and every manifest row has its file.
 *
 * It reads the package and never writes anything. Exit status 0 = no
 * errors (warnings are printed but do not fail), 1 = errors.
 * ========================================================================== */
'use strict';

const fs     = require('fs');
const path   = require('path');
const vm     = require('vm');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

// --- Load config.js, the texts and validate.js into one context -------------
const ctx = { console, window: { DEV_MODE: false }, module: undefined };
vm.createContext(ctx);
function load(rel) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
}
// `var` declarations become properties of the context.
load('config.js');
['text/en/instructions.js', 'text/ja/instructions.js',
 'text/en/words.js', 'text/ja/words.js', 'src/validate.js'].forEach(load);
const { CONFIG, Validate } = ctx;

const setName = process.argv[2] || CONFIG.data.set;
const DIR = path.join(ROOT, CONFIG.data.sets_dir, setName);
const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(DIR, rel), 'utf8'));

const errors = [];
const warnings = [];
function add(r, label) {
  r.errors.forEach((e) => errors.push(label + ': ' + e));
  r.warnings.forEach((w) => warnings.push(label + ': ' + w));
}

// --- The package, as the loader reads it ------------------------------------
let pkg;
try {
  const design = readJSON('design.json');
  const lists = {};
  Object.keys(design.lists).forEach((id) => { lists[id] = readJSON(design.lists[id].file); });
  const practice = {};
  Object.values(design.practice).forEach((f) => { practice[f] = readJSON(f); });
  pkg = {
    design,
    assignment: readJSON((design.assignment && design.assignment.file) || 'assignment.json'),
    lists,
    practice,
    preload: readJSON('preload.json'),
  };
} catch (e) {
  console.error('Could not read the package in ' + DIR + ':\n  ' + e.message);
  process.exit(1);
}

// --- The browser's checks ----------------------------------------------------
add(Validate.checkPackage(pkg, CONFIG), 'package');
add(Validate.checkText({
  TEXT_EN: ctx.TEXT_EN, TEXT_JA: ctx.TEXT_JA,
  WORDS_EN: ctx.WORDS_EN, WORDS_JA: ctx.WORDS_JA,
}, CONFIG, pkg.design, { production: false, contactStorage: 'datapipe' }), 'text');
add(Validate.checkConfig(CONFIG, pkg, { devMode: false }), 'config');

// --- Files on disk -------------------------------------------------------------
const named = new Set();
Object.values(pkg.lists).concat(Object.values(pkg.practice)).forEach((rows) => {
  rows.forEach((r) => { named.add(r.left_path); named.add(r.right_path); });
});
pkg.preload.forEach((p) => named.add(p));
const missing = [...named].filter((p) => !fs.existsSync(path.join(DIR, p)));
if (missing.length) {
  errors.push('files: ' + missing.length + ' image(s) named by the package are not on ' +
              'disk, e.g. ' + missing.slice(0, 3).join(', '));
}

// --- manifest.csv ----------------------------------------------------------------
const manifest = {};
const lines = fs.readFileSync(path.join(DIR, 'manifest.csv'), 'utf8').trim().split(/\r?\n/);
const head = lines[0].split(',');
const iName = head.indexOf('filename'), iSha = head.indexOf('sha256');
lines.slice(1).forEach((l) => {
  const c = l.split(',');
  manifest[c[iName]] = c[iSha];
});
const onDisk = fs.readdirSync(path.join(DIR, 'stimuli'));
let bad = 0, unlisted = 0;
onDisk.forEach((f) => {
  if (!manifest[f]) { unlisted++; return; }
  const sha = crypto.createHash('sha256')
    .update(fs.readFileSync(path.join(DIR, 'stimuli', f))).digest('hex');
  if (sha !== manifest[f]) {
    bad++;
    if (bad <= 3) errors.push('files: ' + f + ' does not match its SHA-256 in manifest.csv.');
  }
});
if (bad > 3) errors.push('files: ' + bad + ' files in all do not match manifest.csv.');
if (unlisted) errors.push('files: ' + unlisted + ' file(s) in stimuli/ are not in manifest.csv.');
const notOnDisk = Object.keys(manifest).filter((f) => onDisk.indexOf(f) === -1);
if (notOnDisk.length) {
  errors.push('files: ' + notOnDisk.length + ' manifest row(s) have no file, e.g. ' +
              notOnDisk.slice(0, 3).join(', '));
}

// --- Report ----------------------------------------------------------------------
console.log('Package ' + setName + ' (' + (pkg.design.version || '?') + '): ' +
            Object.keys(pkg.lists).length + ' lists, ' +
            Object.keys(pkg.practice).length + ' practice files, ' +
            pkg.preload.length + ' preload paths, ' + onDisk.length +
            ' files in stimuli/ checked against manifest.csv.');
warnings.forEach((w) => console.log('  WARNING: ' + w));
errors.forEach((e) => console.log('  ERROR:   ' + e));
console.log(errors.length ? 'FAIL (' + errors.length + ' error(s))'
                          : 'PASS (' + warnings.length + ' warning(s))');
process.exit(errors.length ? 1 : 0);
