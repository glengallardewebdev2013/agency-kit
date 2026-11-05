/**
 * Helpers for the social-first intake (`npm run intake`, `npm run intake:check`).
 * See docs/onboarding/social-first-intake.md for the process these support.
 */

/** Platforms we read a client's brand from, keyed by the hosts they use. */
export const PLATFORMS = {
  facebook: ['facebook.com', 'fb.com', 'm.facebook.com', 'web.facebook.com'],
  instagram: ['instagram.com'],
  linkedin: ['linkedin.com'],
  youtube: ['youtube.com', 'youtu.be', 'm.youtube.com'],
  tiktok: ['tiktok.com'],
};

/**
 * Where an asset came from and what we may do with it. Only these values let
 * an asset onto the site; anything else (including "unknown") blocks the build
 * check until the client confirms.
 */
export const RIGHTS = {
  'client-owned': 'The client made it or owns it (their own photos, logo, videos).',
  'client-licensed': 'The client holds a licence that covers web use (paid shoot, stock they bought).',
  'stock-licensed': 'Stock or AI image we sourced under a licence that covers this use.',
  'ours': 'We made it (our photos, illustrations, icons, mock-ups).',
};

/**
 * Turns pasted profile links into clean, de-duplicated entries.
 * Accepts links with or without https://, and @handles prefixed with a platform
 * ("ig:@clinic", "tiktok:@clinic").
 *
 * @param {string[]} inputs
 * @returns {{ profiles: { platform: string, url: string }[], rejected: string[] }}
 */
export function normalizeProfiles(inputs) {
  const profiles = [];
  const rejected = [];
  const seen = new Set();
  for (const raw of inputs.map((s) => s.trim()).filter(Boolean)) {
    const url = toUrl(raw);
    const platform = url && platformOf(url);
    if (!url || !platform || url.pathname.replace(/\/+$/, '') === '') {
      rejected.push(raw);
      continue;
    }
    url.hash = '';
    url.search = platform === 'facebook' && url.pathname.startsWith('/profile.php') ? url.search : '';
    url.hostname = canonicalHost(platform, url.hostname);
    const clean = url.toString().replace(/\/+$/, '');
    if (seen.has(clean.toLowerCase())) continue;
    seen.add(clean.toLowerCase());
    profiles.push({ platform, url: clean });
  }
  return { profiles, rejected };
}

const SHORTHANDS = {
  fb: 'https://www.facebook.com/',
  ig: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/@',
  tt: 'https://www.tiktok.com/@',
  yt: 'https://www.youtube.com/@',
  li: 'https://www.linkedin.com/company/',
};

function toUrl(raw) {
  const short = raw.match(/^(fb|ig|tiktok|tt|yt|li):@?([\w.\-]+)$/i);
  const text = short ? SHORTHANDS[short[1].toLowerCase()] + short[2] : raw;
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    return url.protocol === 'https:' || url.protocol === 'http:' ? Object.assign(url, { protocol: 'https:' }) : null;
  } catch {
    return null;
  }
}

function platformOf(url) {
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  return Object.keys(PLATFORMS).find((p) => PLATFORMS[p].includes(host)) ?? null;
}

function canonicalHost(platform, host) {
  if (platform === 'youtube' && host.endsWith('youtu.be')) return host;
  return `www.${PLATFORMS[platform][0]}`;
}

/** Column order of intake/assets.csv. */
export const MANIFEST_COLUMNS = ['file', 'source', 'source_url', 'rights', 'use', 'alt', 'notes'];

/**
 * Parses intake/assets.csv (simple CSV: commas, double-quoted fields, "" escapes).
 * @param {string} text
 * @returns {Record<string, string>[]}
 */
export function parseManifest(text) {
  const rows = parseCsv(text).filter((r) => r.some((c) => c.trim() !== ''));
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  const missing = MANIFEST_COLUMNS.filter((c) => !header.includes(c));
  if (missing.length) throw new Error(`assets.csv is missing the column(s): ${missing.join(', ')}`);
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

function parseCsv(text) {
  const rows = [[]];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { rows.at(-1).push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      rows.at(-1).push(field); field = ''; rows.push([]);
    } else field += ch;
  }
  rows.at(-1).push(field);
  return rows;
}

/** Writes one CSV line, quoting where needed. */
export function csvLine(values) {
  return values.map((v) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',');
}

const IMAGE_OR_VIDEO = /\.(jpe?g|png|webp|avif|gif|svg|mp4|mov|webm)$/i;

/**
 * Checks that every picked asset is listed in the manifest with cleared rights
 * and alt text, and that every manifest row points at a real file.
 *
 * @param {Record<string, string>[]} rows from parseManifest
 * @param {string[]} pickedFiles file names inside intake/picked
 * @returns {string[]} problems, empty when everything is cleared
 */
export function checkManifest(rows, pickedFiles) {
  const problems = [];
  const media = pickedFiles.filter((f) => IMAGE_OR_VIDEO.test(f));
  const byFile = new Map();
  for (const row of rows) {
    if (!row.file) { problems.push('A row in assets.csv has no file name.'); continue; }
    if (byFile.has(row.file)) problems.push(`${row.file} is listed twice in assets.csv.`);
    byFile.set(row.file, row);
  }
  for (const file of media) {
    const row = byFile.get(file);
    if (!row) { problems.push(`${file} is in picked/ but not in assets.csv.`); continue; }
    if (!(row.rights in RIGHTS)) {
      problems.push(`${file}: rights "${row.rights || 'blank'}" is not cleared. Use one of: ${Object.keys(RIGHTS).join(', ')}.`);
    }
    if (!row.source) problems.push(`${file}: say where it came from (source).`);
    if (!row.alt && !/\.(mp4|mov|webm)$/i.test(file) && row.use !== 'decorative') {
      problems.push(`${file}: add alt text, or set use to "decorative".`);
    }
  }
  for (const file of byFile.keys()) {
    if (!media.includes(file)) problems.push(`${file} is in assets.csv but not in picked/.`);
  }
  return problems;
}
