import { describe, expect, it } from 'vitest';
import { articleSchema, breadcrumbSchema, faqSchema, localBusiness, serviceSchema, toJsonLd } from '../../src/lib/schema';
import { emptySettings, makeSettings } from './fixtures';

describe('localBusiness', () => {
  it('includes contact details and address', () => {
    const s = localBusiness(makeSettings());
    expect(s['@type']).toBe('RoofingContractor');
    expect(s.telephone).toBe('(512) 555-0100');
    expect(s.address).toMatchObject({ addressLocality: 'Austin', postalCode: '78701' });
    expect(s.sameAs).toEqual(['https://facebook.com/acme']);
  });

  it('omits every empty field instead of shipping blanks', () => {
    const s = localBusiness(emptySettings());
    expect(s['@type']).toBe('LocalBusiness');
    expect(s).not.toHaveProperty('telephone');
    expect(s).not.toHaveProperty('email');
    expect(s).not.toHaveProperty('address');
    expect(s).not.toHaveProperty('sameAs');
    expect(s).not.toHaveProperty('description');
    expect(s.name).toBe('Acme Roofing');
  });
});

describe('serviceSchema', () => {
  it('links the service to the business', () => {
    const s = serviceSchema({ title: 'Roof repair', summary: 'We fix roofs', slug: 'roof-repair' }, makeSettings());
    expect(s.url).toBe('https://acme.example.com/services/roof-repair/');
    expect(s.provider).toEqual({ '@id': 'https://acme.example.com/#business' });
    expect(s.areaServed).toBe('Austin');
  });
});

describe('faqSchema', () => {
  it('returns null when there are no usable questions', () => {
    expect(faqSchema([])).toBeNull();
    expect(faqSchema([{ question: ' ', answer: 'x' }])).toBeNull();
  });

  it('maps questions to FAQPage entities', () => {
    const s = faqSchema([{ question: 'How fast?', answer: 'Same day.' }]);
    expect(s?.mainEntity).toEqual([
      { '@type': 'Question', name: 'How fast?', acceptedAnswer: { '@type': 'Answer', text: 'Same day.' } },
    ]);
  });
});

describe('breadcrumbSchema', () => {
  it('numbers items from 1 with absolute URLs', () => {
    const s = breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }], 'https://x.com');
    expect(s.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://x.com/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://x.com/services/' },
    ]);
  });
});

describe('articleSchema', () => {
  it('uses the published date when there is no update date', () => {
    const published = new Date('2026-01-02T00:00:00Z');
    const s = articleSchema({ title: 'T', summary: 'S', slug: 't', published }, makeSettings());
    expect(s.datePublished).toBe('2026-01-02T00:00:00.000Z');
    expect(s.dateModified).toBe('2026-01-02T00:00:00.000Z');
  });
});

describe('toJsonLd', () => {
  it('escapes < so content cannot close the script tag', () => {
    expect(toJsonLd({ name: '</script><script>alert(1)</script>' })).not.toContain('</script>');
  });
});
