/**
 * Applies a new client's basics to site settings. Tracking IDs are always
 * cleared so one client's pixels can never end up on another client's site.
 *
 * @param {Record<string, any>} settings current site.json contents
 * @param {{ name: string, url: string, phone?: string, email?: string, city?: string, region?: string, businessType?: string }} answers
 * @returns {Record<string, any>}
 */
export function applySiteAnswers(settings, answers) {
  const name = answers.name?.trim();
  if (!name) throw new Error('A business name is required.');
  let url;
  try {
    url = new URL(answers.url.trim()).origin;
  } catch {
    throw new Error(`"${answers.url}" is not a full web address, for example https://example.com`);
  }
  return {
    ...settings,
    name,
    tagline: '',
    url,
    phone: answers.phone?.trim() ?? '',
    email: answers.email?.trim() ?? '',
    address: { street: '', city: answers.city?.trim() ?? '', region: answers.region?.trim() ?? '', postalCode: '', country: settings.address?.country || 'US' },
    hours: '',
    businessType: answers.businessType?.trim() || 'LocalBusiness',
    social: [],
    tracking: { gtmId: '', ga4Id: '', metaPixelId: '', googleAdsId: '', googleAdsLeadLabel: '' },
    demo: true,
  };
}
