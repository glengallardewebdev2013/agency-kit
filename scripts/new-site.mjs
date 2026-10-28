#!/usr/bin/env node
// Sets this copy of the kit up for a new client: `npm run new-site`.
// Writes the basics into site settings; page content lives in src/content.
import { readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { applySiteAnswers } from './lib/site-settings.mjs';

const SETTINGS = new URL('../src/content/settings/site.json', import.meta.url);

const rl = createInterface({ input: stdin, output: stdout });
const ask = async (q, fallback = '') => (await rl.question(fallback ? `${q} (${fallback}): ` : `${q}: `)).trim() || fallback;

try {
  const current = JSON.parse(await readFile(SETTINGS, 'utf8'));
  const answers = {
    name: await ask('Business name'),
    url: await ask('Website address', 'https://example.com'),
    phone: await ask('Phone'),
    email: await ask('Email'),
    city: await ask('City'),
    region: await ask('State or region'),
    businessType: await ask('schema.org business type', 'LocalBusiness'),
  };
  const next = applySiteAnswers(current, answers);
  await writeFile(SETTINGS, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`\nSaved settings for ${next.name}.`);
  console.log('Next: replace the demo content in src/content (pages, services, locations, posts) and run `npm run dev` to check it.');
} catch (err) {
  console.error(`\n${err instanceof Error ? err.message : err}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
