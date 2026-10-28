# Agency starter kit: design

Date: 2026-10-28 · Owner: Glen Gallarde · Status: draft, awaiting Glen's approval

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
- Clients can edit their own text and images without a developer.
- Designs come from Glen; the kit never imposes a look. All colours and fonts
  go through design tokens so one file restyles a whole site.
- White label: nothing in the shipped site names Glen or this kit.
- Cheap to host as static files, so Care plan hosting is mostly margin.

## Non-goals (for now)

- WordPress builds. Planned as a separate lane (Sage theme) once a partner asks.
- E-commerce, logins, member areas, or app-like features.
- A visual drag-and-drop page builder for clients.
- Self-hosted hosting platform (Coolify); start on a managed static host.

## Anti-goals (a failure even if it works)

- Sites that look AI-generated or template-y. Hallmark's rules are the floor.
- Anything that leaks the kit or Glen's brand into a client deliverable.
- A kit so clever that a first-time AI-workflow user can't follow it.

## Approaches considered

1. **Astro + Tailwind + small owned components, Keystatic for editing.**
   Static output, best Lighthouse scores, simplest hosting, easy for Claude to
   generate and for Glen to read. Weaker for app-like features (not needed).
2. **Next.js + Payload CMS.** Full CMS and admin, great for big content sites,
   but needs a database and a server, costs more to host, and is heavier for
   5 to 12 page marketing sites.
3. **WordPress (Sage starter theme).** What many agencies already know and
   sometimes require, but slower, needs plugin upkeep, and harder to hit 90+
   scores consistently.

**Chosen: 1**, recommended by the competitor research and matching the offer
(small marketing sites, speed promises, cheap hosting). This is Claude's call,
pending Glen's approval. Payload stays the upgrade path for an unusually large
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
- **Content and editing:** Keystatic (Git-based, no database) for pages,
  services, locations, posts, and site settings (name, phone, address, hours,
  social links, tracking IDs).
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
  edit content, hosting details, Lighthouse report) for the agency.
- **New-site script:** `npm run new-site` asks for the client name and basics,
  writes site settings, and clears demo content.

## Hosting

Cloudflare Pages (Glen's choice, 2026-10-28). Glen wants to start at zero
cost with two or three hosted clients, so everything must fit the free plan:
static builds, custom domains, a preview per branch, and no paid add-ons.
Forms post to a small Pages Function (on the free Workers allowance) that
forwards submissions by email or webhook, so no paid form service is needed.
Care plans run on Glen's Cloudflare account; agencies that host their own get
the static build.

## Left to the builder

Exact component APIs, folder layout, the email or webhook service the form function forwards to, and
the CI provider details (GitHub Actions assumed).

## Open questions for Glen

- Approve the stack choice (approach 1)?
