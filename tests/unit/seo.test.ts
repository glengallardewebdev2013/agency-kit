import { describe, expect, it } from 'vitest';
import { absoluteUrl, buildMeta, truncate } from '../../src/lib/seo';
import { makeSettings } from './fixtures';

describe('buildMeta', () => {
  const settings = makeSettings();

  it('appends the business name to inner page titles', () => {
    const meta = buildMeta({ title: 'Roof repair', description: 'Fix it', path: '/services/roof-repair/' }, settings);
    expect(meta.title).toBe('Roof repair | Acme Roofing');
    expect(meta.canonical).toBe('https://acme.example.com/services/roof-repair/');
    expect(meta.robots).toBe('index, follow');
    expect(meta.locale).toBe('en_US');
  });

  it('leaves the home page title alone', () => {
    expect(buildMeta({ title: 'Acme Roofing in Austin', description: 'x', path: '/' }, settings).title).toBe(
      'Acme Roofing in Austin',
    );
  });

  it('marks noindex pages and makes image URLs absolute', () => {
    const meta = buildMeta({ title: 'Thanks', description: 'x', path: '/thanks/', noindex: true, image: '/og.png' }, settings);
    expect(meta.robots).toBe('noindex, nofollow');
    expect(meta.image).toBe('https://acme.example.com/og.png');
  });
});

describe('truncate', () => {
  it('keeps short text and cuts long text on a word boundary', () => {
    expect(truncate('  short   text ')).toBe('short text');
    const long = 'word '.repeat(60);
    const out = truncate(long);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('word…')).toBe(true);
  });
});

describe('absoluteUrl', () => {
  it('works with or without a trailing slash on the site URL', () => {
    expect(absoluteUrl('/a/', 'https://x.com')).toBe('https://x.com/a/');
    expect(absoluteUrl('/a/', 'https://x.com/')).toBe('https://x.com/a/');
  });
});
