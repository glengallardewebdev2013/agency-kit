import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ question: z.string(), answer: z.string() });

// Optional overrides for search results, set by agencies in the CMS.
const seo = { seoTitle: z.string().optional(), seoDescription: z.string().optional() };

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().default(100),
    faqs: z.array(faq).default([]),
    ...seo,
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/locations' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    mapQuery: z.string().default(''),
    ...seo,
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    ...seo,
  }),
});

const landing = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/landing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    headline: z.string(),
    subhead: z.string(),
    points: z.array(z.string()).default([]),
    formHeading: z.string().default('Get your free quote'),
    submitLabel: z.string().default('Get my quote'),
  }),
});

export const collections = { services, locations, posts, landing };
