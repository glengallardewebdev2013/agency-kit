import type { SiteSettings } from '../../src/lib/types';

export function makeSettings(overrides: Partial<SiteSettings> = {}): SiteSettings {
  return {
    name: 'Acme Roofing',
    tagline: 'Roof repair in Austin',
    url: 'https://acme.example.com',
    locale: 'en-US',
    phone: '(512) 555-0100',
    email: 'hi@acme.example.com',
    address: { street: '1 Main St', city: 'Austin', region: 'TX', postalCode: '78701', country: 'US' },
    hours: 'Mon-Fri 8-5',
    businessType: 'RoofingContractor',
    social: ['https://facebook.com/acme'],
    tracking: { gtmId: '', ga4Id: '', metaPixelId: '', googleAdsId: '', googleAdsLeadLabel: '' },
    formSuccessMessage: 'Thanks',
    demo: false,
    ...overrides,
  };
}

export function emptySettings(): SiteSettings {
  return makeSettings({
    tagline: '',
    phone: '',
    email: '',
    address: { street: '', city: '', region: '', postalCode: '', country: '' },
    hours: '',
    businessType: '',
    social: [],
  });
}
