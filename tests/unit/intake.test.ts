import { describe, expect, it } from 'vitest';
import { checkManifest, csvLine, MANIFEST_COLUMNS, normalizeProfiles, parseManifest } from '../../scripts/lib/intake.mjs';

describe('normalizeProfiles', () => {
  it('cleans links from every supported platform', () => {
    const { profiles, rejected } = normalizeProfiles([
      'facebook.com/acmedental/',
      'https://m.facebook.com/acmedental?ref=share',
      'ig:@acme.dental',
      'https://www.linkedin.com/company/acme-dental/',
      'yt:@acmedental',
      'tiktok:acmedental',
      'https://example.com/acme',
      'facebook.com',
    ]);
    expect(profiles).toEqual([
      { platform: 'facebook', url: 'https://www.facebook.com/acmedental' },
      { platform: 'instagram', url: 'https://www.instagram.com/acme.dental' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/acme-dental' },
      { platform: 'youtube', url: 'https://www.youtube.com/@acmedental' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@acmedental' },
    ]);
    expect(rejected).toEqual(['https://example.com/acme', 'facebook.com']);
  });

  it('keeps the id on Facebook profile.php links', () => {
    const { profiles } = normalizeProfiles(['https://web.facebook.com/profile.php?id=10001234']);
    expect(profiles[0].url).toBe('https://www.facebook.com/profile.php?id=10001234');
  });
});

describe('asset manifest', () => {
  const header = csvLine(MANIFEST_COLUMNS);
  const csv = [
    header,
    csvLine(['hero-clinic.jpg', 'facebook 2026-09-01', 'https://www.facebook.com/x', 'client-owned', 'hero', 'Front desk, "smiling" staff', '']),
    csvLine(['meme.png', 'facebook repost', '', 'unknown', 'gallery', 'A meme', '']),
    csvLine(['pattern.svg', 'ours', '', 'ours', 'decorative', '', '']),
  ].join('\n');

  it('round-trips quoted fields', () => {
    const rows = parseManifest(csv);
    expect(rows[0].alt).toBe('Front desk, "smiling" staff');
    expect(rows).toHaveLength(3);
  });

  it('passes cleared assets and flags the rest', () => {
    const problems = checkManifest(parseManifest(csv), ['hero-clinic.jpg', 'meme.png', 'pattern.svg', 'new.webp', '.DS_Store']);
    expect(problems).toEqual([
      expect.stringContaining('meme.png: rights "unknown"'),
      'new.webp is in picked/ but not in assets.csv.',
    ]);
  });

  it('flags rows without files and missing alt text', () => {
    const rows = parseManifest([header, csvLine(['gone.jpg', 'client upload', '', 'client-owned', 'gallery', 'x', '']), csvLine(['team.jpg', 'ig', '', 'client-owned', 'team', '', ''])].join('\n'));
    expect(checkManifest(rows, ['team.jpg'])).toEqual([
      'team.jpg: add alt text, or set use to "decorative".',
      'gone.jpg is in assets.csv but not in picked/.',
    ]);
  });

  it('rejects a manifest without the expected columns', () => {
    expect(() => parseManifest('file,rights\na.jpg,ours')).toThrow('missing the column');
  });
});
