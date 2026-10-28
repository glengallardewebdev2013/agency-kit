# Agency starter kit: design

Date: 2026-10-28 · Owner: Glen Gallarde · Status: approved by Glen 2026-10-28 (stack: Astro on Cloudflare, Keystatic CMS standard)

## Intent

Glen runs a one-person white label web agency selling to SEO and ads agencies
(see the offer: fixed-price Campaign Landing Page, 5-page Starter Site,
12-page Growth Site, plus Host / Care / Growth Care plans). The goal is six
client sites in 90 days, about two a month, with at most two builds active.

That only works if each client site starts most of the way done and ships with
the same quality checks every time. This repo is that starting point: Glen (with
Claude Code) clones it per client, applies the client's design, fills content,
and ships. Glen leads the design; AI does the production.

## Goals

- A new client site is running locally from one command, in minutes.
- Every site meets the offer's promises by default: fast (Lighthouse 90+ on
  performance, SEO, accessibility and best practices), on-page SEO and schema,
  tracking ready (GA4 / Google Tag Manager / ad pixels), mobile-first.
- Every site ships with a CMS (Keystatic) so partner SEO agencies can publish
  blog posts and manage SEO fields themselves (Glen's decision, 2026-10-28).
  Design and structural changes still come to Glen as change requests, made
  with Claude Code under the care plan.
- Content lives in plain files (`src/content`, JSON and Markdown): the CMS
  saves each edit as a Git commit, and Claude can edit the same files.
- Designs come from Glen; the kit never imposes a look. All colours and fonts
  go through design tokens so one file restyles a whole site.
- White label: nothing in the shipped site names Glen or this kit.
- Cheap to host as static files, so Care plan hosting is mostly margin.

## Non-goals (for now)

- WordPress builds. Planned as a separate lane (Sage theme) once a partner asks.
- E-commerce, logins, member areas, or app-like features.
- A visual page builder. The CMS edits content and SEO fields, not layout.
- Self-hosted hosting platform (Coolify); start on a managed static host.

## Anti-goals (a failure even if it works)

- Sites that look AI-generated or template-y. Hallmark's rules are the floor.
- Anything that leaks the kit or Glen's brand into a client deliverable.
- A kit so clever that a first-time AI-workflow user can't follow it.

## Approaches considered

1. **Astro + Tailwind + small owned components, Keystatic CMS on files.**
   Static output, best Lighthouse scores, simplest hosting, easy for Claude to
   generate and for Glen to read. Weaker for app-like features (not needed).
2. **Next.js + Payload CMS.** Full CMS and admin, great for big content sites,
   but needs a database and a server, costs more to host, and is heavier for
   5 to 12 page marketing sites.
3. **WordPress (Sage starter theme).** What many agencies already know and
   sometimes require, but slower, needs plugin upkeep, and harder to hit 90+
   scores consistently.

**Chosen: 1**, recommended by the competitor research and matching the offer
(small marketing sites, speed promises, cheap hosting). Approved by Glen.
Keystatic was briefly dropped, then made standard because SEO agencies want
to run their own blogs and SEO fields. Payload stays the upgrade path for an unusually large
Growth Site; WordPress is a separate lane later.

## What's in the kit

- **Framework:** Astro (static output), TypeScript, Tailwind CSS v4 with every
  colour and font mapped to CSS variables declared in one `tokens.css`.
- **Components:** a small set the kit owns (header/nav, footer, hero, section,
  CTA, form, FAQ, testimonial slot, image, map embed). Unstyled beyond tokens,
  so each client's design replaces the look, not the structure. shadcn-style
  copy-in components only where interactive behaviour is needed (menu, accordion).
- **Page templates:** home, service, location, about, contact, landing page,
  blog index and post, 404. Matches the three packages.
- **Content and CMS:** JSON and Markdown files in `src/content` for pages,
  services, locations, posts, landing pages, and site settings (name, phone,
  address, hours, social links, tracking IDs). Keystatic at `/keystatic` edits
  them: blog posts in full, plus SEO title and description overrides on
  services, locations and posts. On the live site it runs in GitHub mode
  (each save is a commit, which triggers a rebuild); `npm run cms` edits
  locally.
- **SEO:** per-page title/description, canonical, Open Graph, sitemap,
  robots.txt, JSON-LD schema (LocalBusiness, Service, FAQ, Breadcrumb, Article)
  generated from content, redirects file for migrations.
- **Tracking:** GTM / GA4 / Meta and Google Ads pixel IDs from site settings,
  loaded only when set; form submissions fire a conversion event.
- **Forms:** contact and lead forms that post to a configurable endpoint
  (Netlify Forms, Formspree, or a webhook the agency already uses), with
  spam protection and a real success/failure state.
- **Quality checks (CI on every push):** type check, build, Playwright
  (pages load, nav works, forms submit, no layout overflow at phone/tablet/
  desktop widths, screenshots), Lighthouse CI with 90+ budgets, broken link
  check. A failing check blocks the release.
- **Design workflow:** the Hallmark skill for the look and its `sloplint`
  check, and the superpowers skills for planning and building. Referenced as
  installed skills, not copied into client repos.
- **Handoff pack:** a script that produces an unbranded handoff folder (how to
  use the CMS, how to request other changes, hosting details, Lighthouse
  report) for the agency.
- **New-site script:** `npm run new-site` asks for the client name and basics,
  writes site settings and clears the previous client's tracking IDs.

## Hosting

Cloudflare (Glen's choice, 2026-10-28), on the free plan: Glen wants to start
at zero cost with two or three hosted clients. The site deploys as a
Cloudflare Worker with static assets: every page is prerendered and served as
a static file, and the worker only runs `/keystatic` (the CMS) and
`/api/lead` (the form endpoint), well inside the free daily request limit.
No sessions (no KV) and no Cloudflare Images (images are optimised at build
time), so nothing needs a paid add-on. Forms forward to a webhook (Zapier,
Make, a CRM or Slack), so no paid form service is needed either. Care plans
run on Glen's Cloudflare account.

## Left to the builder

Exact component APIs, folder layout, the email or webhook service the form function forwards to, and
the CI provider details (GitHub Actions assumed).

## Open questions for Glen

None. Stack and hosting are decided.
