export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface Tracking {
  gtmId: string;
  ga4Id: string;
  metaPixelId: string;
  googleAdsId: string;
  googleAdsLeadLabel: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  url: string;
  locale: string;
  phone: string;
  email: string;
  address: Address;
  hours: string;
  businessType: string;
  social: string[];
  tracking: Tracking;
  formSuccessMessage: string;
  demo: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}
