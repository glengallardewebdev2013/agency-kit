# agency-kit

Starter kit for white label client websites. Clone it for each new client
site: it ships fast, SEO-ready, editable pages with forms, tracking and
automatic quality checks, and nothing in the built site names the kit.

- Design: [docs/superpowers/specs/2026-10-28-agency-kit-design.md](docs/superpowers/specs/2026-10-28-agency-kit-design.md)
- Build plan: [docs/superpowers/plans/2026-10-28-agency-kit.md](docs/superpowers/plans/2026-10-28-agency-kit.md)

## Start a new client site

```bash
# 1. Copy the kit into the client's own repo
git clone https://github.com/glengallardewebdev2013/agency-kit client-site
cd client-site && git remote remove origin

# 2. Install and set the basics (name, URL, phone, email, city)
npm install
npm run new-site

# 3. Replace the demo content (in the CMS, or directly in src/content)
npm run cms            # then open http://127.0.0.1:4321/keystatic
```

Apply the client's design in `src/styles/tokens.css` (every colour and font is
a token there) and in the components under `src/components`. For new designs,
use the Hallmark skill and its `sloplint` check.

## What's inside

| Area | Where |
|---|---|
| Pages | home, services, locations, about, contact, blog, landing pages (`/lp/...`), thanks, form error, 404 in `src/pages` |
| Content | `src/content`: JSON for pages and settings, Markdown for services, locations and posts |
| CMS | Keystatic at `/keystatic`: blog posts, SEO title and description overrides, site settings and tracking. GitHub mode on the live site, local mode with `npm run cms` |
| Site settings | `src/content/settings/site.json`: name, contact, address, hours, schema type, tracking IDs |
| SEO | titles, descriptions, canonical, Open Graph, sitemap, robots.txt, JSON-LD (LocalBusiness, Service, FAQ, Breadcrumb, BlogPosting) |
| Tracking | GTM, GA4, Meta Pixel, Google Ads; each loads only when its ID is set. Forms push `generate_lead` to `dataLayer` |
| Forms | `src/pages/api/lead.ts` (runs on the worker) forwards leads to a webhook; works without JavaScript; honeypot spam trap |

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | local site in the Cloudflare runtime |
| `npm run cms` | local site plus the CMS, editing files on disk |
| `npm run build` | static build into `dist/` |
| `npm run check` | type check |
| `npm test` | unit tests (SEO, schema, tracking, forms, CMS schema, new-site) |
| `npm run test:e2e` | browser tests against the build: every page, phone/tablet/desktop overflow, nav, forms, internal links, no kit branding |
| `npm run lhci` | Lighthouse budgets (90+ performance, accessibility, best practices, SEO) |
| `npm run new-site` | set the basics for a new client |
| `npm run handoff` | write an unbranded handoff pack to `handoff/` |
| `npm run deploy` | build and deploy to Cloudflare with wrangler |

CI runs all of these on every pull request.

## Deploy on Cloudflare (free plan)

Every page is prerendered and served as a static file. A small worker runs only
the CMS (`/keystatic`) and the form endpoint (`/api/lead`). No KV, no paid
Images binding, so it fits the Workers free plan.

1. Set `name` in `wrangler.jsonc` to the client's site name.
2. In Cloudflare, go to Workers & Pages > Create > Import a repository and pick
   the client's repo. Build command `npm run build`, deploy command
   `npx wrangler deploy`.
3. Add the variables below under Settings > Variables and secrets.
4. Add the client's domain under Settings > Domains & Routes.

| Variable | Where | What |
|---|---|---|
| `LEAD_WEBHOOK_URL` | secret | where form leads go (Zapier, Make, a CRM or Slack webhook) |
| `LEAD_WEBHOOK_SECRET` | secret, optional | sent as the `x-lead-secret` header |
| `PUBLIC_KEYSTATIC_GITHUB_REPO` | build variable | `owner/repo`, turns on GitHub mode for the live CMS |
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` | secrets | from the Keystatic GitHub App (below) |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | build variable | from the Keystatic GitHub App |

**Live CMS setup (once per client repo):** run
`PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo npm run cms`, open `/keystatic`, and
follow Keystatic's prompt to create a GitHub App. It writes the four
`KEYSTATIC_*` values to `.env`; copy them into Cloudflare. Agency editors sign
in with a GitHub account that has write access to the client repo.

## Content changes

Agencies publish blog posts and edit SEO fields in the CMS themselves. Design
and structure changes come in as requests and are made with Claude Code, then
go through the same checks before they're published. `npm run handoff` writes
both sets of instructions for the agency.

## Known limits

- The live CMS login (GitHub mode on Cloudflare) is set up per client and has
  not yet been tried end to end on a deployed site; local CMS editing is tested.
- WordPress builds are a separate lane, not part of this kit.
