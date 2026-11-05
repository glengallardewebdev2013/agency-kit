#!/usr/bin/env node
// Fails when any picked asset lacks cleared rights, a source or alt text:
// `npm run intake:check`. Passes quietly when there is no intake/ folder.
import { readdir, readFile } from 'node:fs/promises';
import { checkManifest, parseManifest } from './lib/intake.mjs';

const at = (p) => new URL(`../${p}`, import.meta.url);
let picked;
try {
  picked = await readdir(at('intake/picked/'));
} catch {
  console.log('No intake/picked folder, nothing to check.');
  process.exit(0);
}
let rows = [];
try {
  rows = parseManifest(await readFile(at('intake/assets.csv'), 'utf8'));
} catch (err) {
  if (err?.code !== 'ENOENT') throw err;
}
const problems = checkManifest(rows, picked);
if (problems.length) {
  console.error(`Intake assets not cleared for the site (${problems.length}):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`All ${rows.length} picked asset(s) have a source, cleared rights and alt text.`);
