// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import site from './src/content/settings/site.json' with { type: 'json' };

// `npm run cms` runs the CMS in local mode, which edits files on disk. That
// needs Node, so it skips the Cloudflare runtime used everywhere else.
const localCms = process.env.LOCAL_CMS === '1';

// Every page is prerendered to static HTML. Only the CMS (/keystatic) and the
// lead form endpoint (/api/lead) run on Cloudflare Workers, inside the free plan.
export default defineConfig({
  site: site.url,
  output: 'static',
  // No sessions (no KV needed) and images optimised at build time (no paid
  // Cloudflare Images binding), so the whole site stays on the free plan.
  adapter: localCms ? undefined : cloudflare({ imageService: 'compile', prerenderEnvironment: 'node' }),
  session: false,
  // Keystatic's routes don't use trailing slashes; pages are still built as
  // folders, so their URLs end in a slash.
  trailingSlash: 'ignore',
  integrations: [
    sitemap({ filter: (page) => !/\/(thanks|form-error|lp|keystatic)\//.test(page) }),
    react(),
    keystatic(),
  ],
  vite: { plugins: [tailwindcss()] },
});
