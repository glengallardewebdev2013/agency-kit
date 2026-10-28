import { readdirSync } from 'node:fs';

/** Every built page, so new pages are checked without editing the tests. */
export function builtPages(): string[] {
  const files = readdirSync('dist/client', { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('index.html'));
  return files.map((f) => `/${f.replace(/index\.html$/, '').replace(/\\/g, '/')}`).sort();
}
