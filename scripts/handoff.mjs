#!/usr/bin/env node
// Builds an unbranded handoff folder for the agency: `npm run handoff`.
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const out = new URL('handoff/', root);
const settings = JSON.parse(await readFile(new URL('src/content/settings/site.json', root), 'utf8'));

if (settings.demo) {
  console.warn('Warning: site settings still say "demo": true. Set it to false in src/content/settings/site.json once real content is in.');
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const changes = `# Updating ${settings.name}

## Blog posts and SEO (do it yourself)

Open ${settings.url}/keystatic and sign in.

- **Blog posts:** add, edit or unpublish posts (tick Draft to hide one).
- **SEO fields:** every service, industry and post has an optional SEO title
  and SEO description that override what shows in search results.
- **Tracking:** Site settings > Tracking holds the Tag Manager, Analytics,
  Meta Pixel and Google Ads IDs.

Each save goes live automatically within a few minutes.

## Everything else (send a request)

Design, layout, new pages and other changes are handled for you under the
care plan. Send:

1. The page address (for example ${settings.url}/services/).
2. What should change, with any new text or images attached.
3. When you need it live.

Every change is checked for speed, SEO and layout before it's published.
`;

const hosting = `# Hosting ${settings.name}

- Live site: ${settings.url}
- Host: Cloudflare Workers (static pages plus a small worker for the CMS and forms).
  Build with \`npm run build\`, deploy with \`npx wrangler deploy\`.
- Contact forms post to \`/api/lead\` (\`src/pages/api/lead.ts\`).
  Set these in Cloudflare > Workers & Pages > this worker > Settings > Variables and secrets:
  - \`LEAD_WEBHOOK_URL\`: where leads are sent (Zapier, Make, a CRM or Slack webhook).
  - \`LEAD_WEBHOOK_SECRET\` (optional): sent as the \`x-lead-secret\` header.
- The CMS at /keystatic saves to the GitHub repo set in \`PUBLIC_KEYSTATIC_GITHUB_REPO\`.
- Tracking IDs are set in the CMS under Site settings > Tracking.
`;

await writeFile(new URL('CHANGES.md', out), changes);
await writeFile(new URL('HOSTING.md', out), hosting);

const reports = new URL('.lighthouseci/', root);
if (existsSync(reports)) {
  const files = (await readdir(reports)).filter((f) => f.endsWith('.html'));
  if (files.length) {
    await mkdir(new URL('quality-report/', out), { recursive: true });
    for (const f of files) await cp(new URL(f, reports), new URL(`quality-report/${f}`, out));
  }
} else {
  console.log('No Lighthouse reports found. Run `npm run build && npm run lhci` first to include them.');
}

console.log('Handoff pack written to handoff/');
