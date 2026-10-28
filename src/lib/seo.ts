import type { SiteSettings } from './types';

export interface MetaInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  robots: string;
  type: 'website' | 'article';
  siteName: string;
  locale: string;
}

const MAX_DESCRIPTION = 160;

export function absoluteUrl(path: string, siteUrl: string): string {
  return new URL(path, siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`).toString();
}

export function truncate(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:]$/, '')}…`;
}

export function buildMeta(input: MetaInput, settings: SiteSettings): Meta {
  const isHome = input.path === '/' || input.path === '';
  const title = isHome || input.title === settings.name ? input.title : `${input.title} | ${settings.name}`;
  return {
    title,
    description: truncate(input.description),
    canonical: absoluteUrl(input.path, settings.url),
    image: input.image ? absoluteUrl(input.image, settings.url) : undefined,
    robots: input.noindex ? 'noindex, nofollow' : 'index, follow',
    type: input.type ?? 'website',
    siteName: settings.name,
    locale: settings.locale.replace('-', '_'),
  };
}
