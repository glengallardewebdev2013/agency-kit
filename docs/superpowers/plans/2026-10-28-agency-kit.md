# Agency starter kit implementation plan

> **For agentic workers:** use superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [x]`) syntax.

**Goal:** a cloneable Astro starter that ships a fast, SEO-ready, white label client site with editing, forms, tracking and quality gates.

**Architecture:** static Astro site; content in `src/content` (JSON and Markdown files, edited through Keystatic or by Claude); pure helpers in `src/lib` (SEO, schema, tracking, lead handling) with unit tests; an on-demand `/api/lead` route for forms; deployed as a Cloudflare Worker with static assets; Playwright and Lighthouse CI against the static build.

**Tech stack:** Astro 7.3.8, TypeScript 5.9, Tailwind CSS 4 (`@tailwindcss/vite`), `@astrojs/cloudflare` 14.3.4, Keystatic (`@keystatic/core`, `@keystatic/astro`, `@astrojs/react`), `@astrojs/sitemap`, Vitest, Playwright, `@lhci/cli`, wrangler. Node 22.

**Spec:** `docs/superpowers/specs/2026-10-28-agency-kit-design.md`

## Global constraints

- Every colour and font is a CSS variable in `src/styles/tokens.css`; no literal colours elsewhere.
- Nothing in built output names GallarDesign, Glen or the kit (no credit links, no generator tag).
- Every page is prerendered (`output: 'static'`); only `/keystatic` and `/api/lead` run on the worker. Fits the Cloudflare Workers free plan (no KV, no Images binding).
- Lighthouse budgets: performance, accessibility, best practices, SEO each >= 0.9.
- Tracking scripts load only when their ID is set in site settings.
- Every interactive element has `:focus-visible`; every animation honours `prefers-reduced-motion`.
- Demo content never invents testimonials, ratings or metrics.

## Review focus

1. Empty optional settings (no phone, no address, no tracking IDs) → pages still build, schema omits the missing fields, no empty tags.
2. Form submitted with JavaScript off → still reaches the function and lands on a thank-you page.
3. Form spam (honeypot filled) → silently accepted, never forwarded.
4. Webhook down → visitor sees a real error with the phone/email fallback, not a fake thank-you.
5. Long words and narrow phones (320px) → no horizontal scroll.

---

### Task 1: Scaffold, tokens and base layout
Files: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/{tokens,global}.css`, `src/layouts/Base.astro`, `src/content/settings/site.json`, `src/lib/settings.ts`, `tests/e2e/smoke.spec.ts`, `playwright.config.ts`.
- [x] Failing e2e: home returns 200 and has `<html lang>` and one `<h1>`.
- [x] Implement scaffold; `npm run build && npm run test:e2e` passes. Commit.

### Task 2: SEO, schema and tracking helpers
Files: `src/lib/{seo,schema,tracking}.ts`, `tests/unit/*.test.ts`, `src/components/{Seo,JsonLd,Tracking}.astro`, `public/robots.txt` generator.
Produces: `buildMeta(input, settings) -> Meta`, `localBusiness(settings)`, `serviceSchema(svc, settings)`, `faqSchema(faqs)`, `breadcrumbSchema(items, siteUrl)`, `articleSchema(post, settings)`, `trackingConfig(settings)`.
- [x] Unit tests for each, including the empty-settings case (review focus 1). Implement. Commit.

### Task 3: Components and page templates
Files: `src/components/*`, `src/pages/{index,about,contact,thanks,404}.astro`, `src/pages/services/[slug].astro`, `src/pages/locations/[slug].astro`, `src/pages/lp/[slug].astro`, `src/pages/blog/{index,[slug]}.astro`, `src/content.config.ts`, demo content.
- [x] E2E: every page 200, nav reaches each page, no horizontal overflow at 320/768/1280 (review focus 5). Implement. Commit.

### Task 4: Lead form and endpoint
Files: `src/lib/lead.ts`, `src/pages/api/lead.ts`, `src/components/LeadForm.astro`, `tests/unit/lead.test.ts`, `tests/e2e/form.spec.ts`.
Produces: `handleLead(request, env, fetchImpl) -> Response`.
- [x] Unit: valid → forwards JSON to `LEAD_WEBHOOK_URL`, 200; honeypot → 200 not forwarded; missing fields → 400; webhook failure → 502; no-JS (`accept: text/html`) → 303 to `/thanks/` (review focus 2–4).
- [x] E2E with mocked API: success message and `generate_lead` dataLayer event; failure shows fallback contact. Implement. Commit.

### Task 5: Keystatic CMS
Files: `keystatic.config.ts`, `astro.config.mjs`, `wrangler.jsonc`, `src/pages/api/lead.ts`, `tests/unit/keystatic.test.ts`.
- [x] Unit: the Keystatic reader parses every singleton and collection entry, so CMS saves can't break the build.
- [x] `npm run cms` (Node, local mode) lists and saves posts as `.md`; the live site uses GitHub mode via `PUBLIC_KEYSTATIC_GITHUB_REPO`.
- [x] Form endpoint moved from a Pages Function into an Astro route, since the adapter's worker replaces `functions/`. E2E proves the real endpoint runs on the worker.

### Task 6: New-site and handoff scripts
Files: `scripts/new-site.mjs`, `scripts/handoff.mjs`, `scripts/lib/site-settings.mjs`, `tests/unit/site-settings.test.ts`.
- [x] Unit: `applySiteAnswers(settings, answers)` sets name/url/contact and clears tracking IDs. Implement scripts. Commit.

### Task 7: CI quality gates
Files: `.github/workflows/ci.yml`, `lighthouserc.json`, `README.md`.
- [x] CI runs check, unit, build, e2e (including an internal link check), Lighthouse CI. Run all locally green. Commit.
