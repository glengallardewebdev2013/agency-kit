#!/usr/bin/env node
// Starts a social-first intake: `npm run intake -- <profile links...>`
// Creates intake/ (brief, asset list, folders per platform) and saves the
// profile links to site settings so they show up in the footer and schema.
// The process is in docs/onboarding/social-first-intake.md.
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { argv, stdin, stdout } from 'node:process';
import { MANIFEST_COLUMNS, csvLine, normalizeProfiles } from './lib/intake.mjs';

const root = new URL('../', import.meta.url);
const at = (p) => new URL(p, root);
const exists = (p) => access(p).then(() => true, () => false);

let links = argv.slice(2);
if (links.length === 0) {
  const rl = createInterface({ input: stdin, output: stdout });
  console.log('Paste the client\'s profile links (Facebook, Instagram, LinkedIn, YouTube, TikTok), one per line. Empty line to finish.');
  for (;;) {
    const line = (await rl.question('> ')).trim();
    if (!line) break;
    links.push(line);
  }
  rl.close();
}

const { profiles, rejected } = normalizeProfiles(links);
if (rejected.length) console.warn(`Skipped (not a Facebook, Instagram, LinkedIn, YouTube or TikTok profile): ${rejected.join(', ')}`);
if (profiles.length === 0) {
  console.error('No profile links to work from. Example: npm run intake -- facebook.com/acmedental ig:@acmedental');
  process.exit(1);
}

await mkdir(at('intake/picked/'), { recursive: true });
for (const p of new Set(profiles.map((x) => x.platform))) await mkdir(at(`intake/raw/${p}/`), { recursive: true });
await mkdir(at('intake/raw/client-uploads/'), { recursive: true });

await writeFile(at('intake/sources.json'), `${JSON.stringify({ started: new Date().toISOString().slice(0, 10), profiles }, null, 2)}\n`);
if (!(await exists(at('intake/assets.csv')))) await writeFile(at('intake/assets.csv'), `${csvLine(MANIFEST_COLUMNS)}\n`);
if (!(await exists(at('intake/brief.md')))) await copyFile(at('templates/intake/brief.md'), at('intake/brief.md'));

const settingsUrl = at('src/content/settings/site.json');
const settings = JSON.parse(await readFile(settingsUrl, 'utf8'));
settings.social = [...new Set([...(settings.social ?? []), ...profiles.map((p) => p.url)])];
await writeFile(settingsUrl, `${JSON.stringify(settings, null, 2)}\n`);

console.log(`\nIntake started with ${profiles.length} profile(s):`);
for (const p of profiles) console.log(`  ${p.platform.padEnd(9)} ${p.url}`);
console.log(`
Next:
  1. Send the client the permission message (templates/intake/permission-message.md).
  2. Put what you collect in intake/raw/<platform>/ (exports, saves, screenshots).
  3. Ask Claude Code: "run the social brand brief skill" to fill intake/brief.md
     and pick the best assets into intake/picked/ with rows in intake/assets.csv.
  4. npm run intake:check  (every picked asset needs cleared rights and alt text)`);
