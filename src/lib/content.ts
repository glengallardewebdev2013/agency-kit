import { getCollection } from 'astro:content';

export async function getServices() {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getIndustries() {
  return (await getCollection('industries')).sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getPosts() {
  return (await getCollection('posts', (p) => !p.data.draft)).sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime(),
  );
}

export function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
