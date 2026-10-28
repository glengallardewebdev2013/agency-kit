import type { Tracking } from './types';

const PATTERNS = {
  gtmId: /^GTM-[A-Z0-9]+$/,
  ga4Id: /^G-[A-Z0-9]+$/,
  metaPixelId: /^\d{6,20}$/,
  googleAdsId: /^AW-\d+$/,
} as const;

export interface TrackingConfig {
  gtmId?: string;
  ga4Id?: string;
  metaPixelId?: string;
  googleAdsId?: string;
  googleAdsLeadLabel?: string;
  any: boolean;
}

/** Keeps only well-formed IDs, so a typo never ships a broken script. */
export function trackingConfig(tracking: Tracking): TrackingConfig {
  const pick = (key: keyof typeof PATTERNS) => {
    const value = tracking[key]?.trim();
    return value && PATTERNS[key].test(value) ? value : undefined;
  };
  const config = {
    gtmId: pick('gtmId'),
    ga4Id: pick('ga4Id'),
    metaPixelId: pick('metaPixelId'),
    googleAdsId: pick('googleAdsId'),
    googleAdsLeadLabel: tracking.googleAdsLeadLabel?.trim() || undefined,
  };
  return { ...config, any: Boolean(config.gtmId || config.ga4Id || config.metaPixelId || config.googleAdsId) };
}
