import { absoluteUrl } from './seo';
import type { Faq, SiteSettings } from './types';

type Json = Record<string, unknown>;

/** Drops keys whose value is empty so schema never carries blank fields. */
export function compact<T extends Json>(obj: T): Json {
  const out: Json = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'object' && !Array.isArray(value)) {
      const inner = compact(value as Json);
      if (Object.keys(inner).filter((k) => k !== '@type').length === 0) continue;
      out[key] = inner;
      continue;
    }
    out[key] = value;
  }
  return out;
}

export function localBusiness(settings: SiteSettings): Json {
  const a = settings.address;
  return compact({
    '@context': 'https://schema.org',
    '@type': settings.businessType || 'LocalBusiness',
    '@id': absoluteUrl('/#business', settings.url),
    name: settings.name,
    description: settings.tagline,
    url: absoluteUrl('/', settings.url),
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    sameAs: settings.social,
  });
}

export interface ServiceInput {
  title: string;
  summary: string;
  slug: string;
}

export function serviceSchema(service: ServiceInput, settings: SiteSettings): Json {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}/`, settings.url),
    provider: { '@id': absoluteUrl('/#business', settings.url) },
    areaServed: settings.address.city,
  });
}

export function faqSchema(faqs: Faq[]): Json | null {
  const valid = faqs.filter((f) => f.question.trim() && f.answer.trim());
  if (valid.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: Crumb[], siteUrl: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteUrl),
    })),
  };
}

export interface ArticleInput {
  title: string;
  summary: string;
  slug: string;
  published: Date;
  updated?: Date;
}

export function articleSchema(post: ArticleInput, settings: SiteSettings): Json {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    url: absoluteUrl(`/blog/${post.slug}/`, settings.url),
    datePublished: post.published.toISOString(),
    dateModified: (post.updated ?? post.published).toISOString(),
    publisher: { '@id': absoluteUrl('/#business', settings.url) },
  });
}

/** Serialises JSON-LD safely for a <script> tag. */
export function toJsonLd(data: Json): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
