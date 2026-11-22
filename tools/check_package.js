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
 *   - the image names follow <scene>__c<level>__s<level>.png (a dev.html
 *     check, for the trial label; validate.js checkImageNames);
 *   - every image named by any list row (catch rows included) or practice
 *     row, and every path in preload.json, exists on disk;
 *   - every file in stimuli/ is listed in manifest.csv with the same
 *     SHA-256, and every manifest row has its file;
 *   - every file in stimuli/ is shown by a list or practice row or belongs
 *     to a catch row (warning otherwise);
 *   - items.csv has design.json's items.rows rows, unique item_ids, and
 *     every item_id of every list and practice row.
 *
 * It prints the image count: shown (= preload.json) + catch-only = total,
 * and the number of scenes.
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
add(Validate.checkImageNames(pkg), 'image names');   // dev check (the trial label)

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

// --- Images: shown, catch-only, unused ---------------------------------------
const shown = new Set(), catchOnly = new Set();
Object.values(pkg.lists).concat(Object.values(pkg.practice)).forEach((rows) => {
  rows.forEach((r) => {
    const noImages = (r.trial_type === 'catch' && r.catch_mode === 'no_images');
    [r.left_path, r.right_path].forEach((p) => (noImages ? catchOnly : shown).add(p));
  });
});
shown.forEach((p) => catchOnly.delete(p));
const scenes = new Set([...shown, ...catchOnly].map((p) =>
  path.basename(p).split('__c')[0]));

// --- items.csv -------------------------------------------------------------------
{
  const itemsFile = (pkg.design.items && pkg.design.items.file) || 'items.csv';
  const lines = fs.readFileSync(path.join(DIR, itemsFile), 'utf8').trim().split(/\r?\n/);
  const head = lines[0].split(',');
  const iId = head.indexOf((pkg.design.items && pkg.design.items.key) || 'item_id');
  const ids = lines.slice(1).map((l) => l.split(',')[iId]);
  const want = pkg.design.items && pkg.design.items.rows;
  if (iId === -1) errors.push('items: ' + itemsFile + ' has no item_id column.');
  if (typeof want === 'number' && ids.length !== want) {
    errors.push('items: ' + itemsFile + ' has ' + ids.length + ' rows; design.json items.rows ' +
                'says ' + want + '.');
  }
  const idSet = new Set(ids);
  if (idSet.size !== ids.length) errors.push('items: ' + itemsFile + ' repeats some item_ids.');
  const missingItems = new Set();
  Object.values(pkg.lists).concat(Object.values(pkg.practice)).forEach((rows) => {
    rows.forEach((r) => { if (!idSet.has(r.item_id)) missingItems.add(r.item_id); });
  });
  if (missingItems.size) {
    errors.push('items: ' + missingItems.size + ' item_id(s) of list or practice rows are not ' +
                'in ' + itemsFile + ' (responses could not be joined), e.g. ' +
                [...missingItems].slice(0, 3).join(', '));
  }
  var itemsRows = ids.length;
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

const unusedFiles = onDisk.filter((f) => !shown.has('stimuli/' + f) && !catchOnly.has('stimuli/' + f));
if (unusedFiles.length) {
  warnings.push('files: ' + unusedFiles.length + ' file(s) in stimuli/ are not used by any ' +
                'list or practice row, e.g. ' + unusedFiles.slice(0, 3).join(', '));
}

// --- Report ----------------------------------------------------------------------
console.log('Package ' + setName + ' (' + (pkg.design.version || '?') + '): ' +
            Object.keys(pkg.lists).length + ' lists, ' +
            Object.keys(pkg.practice).length + ' practice files, ' +
            itemsRows + ' items in items.csv.');
console.log('Images: ' + shown.size + ' shown (preload.json: ' + pkg.preload.length + ') + ' +
            catchOnly.size + ' only on catch rows = ' + (shown.size + catchOnly.size) +
            '; ' + onDisk.length + ' files in stimuli/, checked against manifest.csv; ' +
            scenes.size + ' scenes.');
warnings.forEach((w) => console.log('  WARNING: ' + w));
errors.forEach((e) => console.log('  ERROR:   ' + e));
console.log(errors.length ? 'FAIL (' + errors.length + ' error(s))'
                          : 'PASS (' + warnings.length + ' warning(s))');
process.exit(errors.length ? 1 : 0);
