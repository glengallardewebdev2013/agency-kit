import { describe, expect, it } from 'vitest';
import { trackingConfig } from '../../src/lib/tracking';

const blank = { gtmId: '', ga4Id: '', metaPixelId: '', googleAdsId: '', googleAdsLeadLabel: '' };

describe('trackingConfig', () => {
  it('loads nothing when no IDs are set', () => {
    expect(trackingConfig(blank)).toEqual({
      gtmId: undefined,
      ga4Id: undefined,
      metaPixelId: undefined,
      googleAdsId: undefined,
      googleAdsLeadLabel: undefined,
      any: false,
    });
  });

  it('keeps valid IDs and trims whitespace', () => {
    const c = trackingConfig({ ...blank, gtmId: ' GTM-AB12CD ', metaPixelId: '1234567890', googleAdsId: 'AW-123' });
    expect(c.gtmId).toBe('GTM-AB12CD');
    expect(c.metaPixelId).toBe('1234567890');
    expect(c.googleAdsId).toBe('AW-123');
    expect(c.any).toBe(true);
  });

  it('drops malformed IDs so a typo never ships a broken script', () => {
    const c = trackingConfig({ ...blank, gtmId: 'gtm 123', ga4Id: 'UA-1', metaPixelId: 'abc' });
    expect(c.any).toBe(false);
  });
});
