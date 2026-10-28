import { describe, expect, it } from 'vitest';
import { applySiteAnswers } from '../../scripts/lib/site-settings.mjs';
import current from '../../src/content/settings/site.json';

describe('applySiteAnswers', () => {
  const next = applySiteAnswers(
    { ...current, tracking: { ...current.tracking, gtmId: 'GTM-OLD', metaPixelId: '123456789' } },
    { name: ' Acme Dental ', url: 'https://acmedental.com/some/page', phone: '555', city: 'Austin', region: 'TX', businessType: 'Dentist' },
  );

  it('sets the new business basics', () => {
    expect(next.name).toBe('Acme Dental');
    expect(next.url).toBe('https://acmedental.com');
    expect(next.phone).toBe('555');
    expect(next.address.city).toBe('Austin');
    expect(next.businessType).toBe('Dentist');
  });

  it('clears the previous client tracking IDs and social links', () => {
    expect(Object.values(next.tracking).every((v) => v === '')).toBe(true);
    expect(next.social).toEqual([]);
  });

  it('keeps the form message and marks the site as demo until content is real', () => {
    expect(next.formSuccessMessage).toBe(current.formSuccessMessage);
    expect(next.demo).toBe(true);
  });

  it('rejects a missing name or a bad URL', () => {
    expect(() => applySiteAnswers(current, { name: '', url: 'https://a.com' })).toThrow('name');
    expect(() => applySiteAnswers(current, { name: 'A', url: 'acme.com' })).toThrow('full web address');
  });
});
