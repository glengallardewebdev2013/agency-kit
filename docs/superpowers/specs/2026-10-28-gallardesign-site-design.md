# GallarDesign agency website: design

Date: 2026-10-28. Owner: Glen Gallarde. Built on the agency kit (this repo, `design/agency-kit`), to move to its own repo `gallardesign-site`.

## Intent

GallarDesign's own website. It sells websites directly to small businesses, with white label work for agencies as a second line. It is also the first real site built on the kit, so it proves the kit works.

Glen asked Claude to make the open calls after competitor research ([decisions doc](https://claude.ai/artifact/48aWAX8b7HK2VPjjArKLCR)). The decisions below come from that doc.

## Goals

- A business owner understands the offer in one screen: a human-designed website, live in 14 days, $0 down, and the client owns it.
- Every page ends on one action: start a project (the contact form).
- Pricing is public and plain, which competitors (Thryv, Hibu) don't do.
- Niche pages for med spas and aesthetic clinics, then home-improvement contractors, lead with the outcome and terms.
- A separate page for agencies with wholesale prices.
- Fast and accessible by default (Lighthouse 90+), because that's part of the pitch.

## Non-goals

- No client portfolio or case studies yet. Glen has no niche work to show, and nothing gets invented. Concept sites, clearly labelled, show the style; the founding offer stands in for proof.
- No booking or payment system. The contact form sends leads to a webhook.
- No roofing, HVAC, plumbing, dentist or lawyer pages for now.

## Anti-goals

- A site that looks AI-generated, the exact complaint the offer answers.
- Invented facts: no client counts, reviews, results or years of experience that Glen hasn't confirmed.

## Decisions

| Area | Decision |
|---|---|
| Look | Revised 2026-10-28 at Glen's request: the look of **Hallmark's own site** (usehallmark.com), not one of its themes. Cool paper #FAFAF9, ink #0F0F0E, one orange #FC4C02. Newsreader 400 heads over Geist, Geist Mono for small technical bits. 14px radius on every surface, a full pill on every control, soft layered shadows, faint orange column guides behind the hero, an ink close joined to the footer. The first build used the Grid theme; Glen didn't like it. |
| Logo | A monogram, at Glen's request: G and D in Fraunces split by an orange slash (the Hallmark "/" idea), beside "GallarDesign" in Fraunces. Option A of three; files in `brand/`, outlined. The favicon is the monogram on an ink tile. |
| Hero | Hallmark's "dealt hand": the head centred over a fan of concept sites in desktop and phone frames. |
| Concept work | Four made-up businesses (med spa, painter, remodeler, landscaper) stand in for a portfolio. Every place they appear says they are concepts, not client work. Photos are from Wikimedia Commons via the Hallmark repo, credited on the home page. |
| Tagline | "Human-designed websites, built at AI speed." |
| Plans (12 months, $0 down) | Starter $149, Business $299, Growth $549 a month |
| Upfront instead | $1,500 / $3,000 / $5,000 |
| Care from month 13 | Starter $79, Business $129. Growth stays at $549 as an SEO plan, or drops to Business care. |
| Founding offer | The first 6 clients keep their price for life in return for a testimonial and a case study. |
| Guarantee | Live 14 days after we have your content, or month one is free. Full refund within 30 days. |
| Ownership | Clients own their content and domain from day one, and the site after month 12 or by buyout. Buyout is the months left times the build part: $70 Starter, $170 Business, $300 Growth. |
| Edits | Within two business days. Clients edit blog posts themselves in the CMS. |
| White label | Wholesale builds $950 / $2,400 / $4,500. Subscriptions $99 / $199 / $349 a month. Care $49 to $199 a month. |
| Stack | The kit as is: Astro 7, Tailwind 4 with tokens, Keystatic, Cloudflare Workers free plan. |

## Pages

- `/`: centred hero over the fan of concept sites, live in 14 days (four steps, each over a small drawing), concept work, why owners pick GallarDesign, plans, founding offer, industries, ownership, FAQ, closing call to action.
- `/pricing/`: three plans, upfront prices, care after year one, the buyout rule, founding offer, guarantee, and a pricing FAQ.
- `/services/` and three service pages: website design and build, local SEO (Growth), care and hosting.
- `/industries/` and two niche pages: med spas and aesthetic clinics, home-improvement contractors. This replaces the kit's `locations` collection; GallarDesign sells by niche, not by area.
- `/agencies/`: white label, with wholesale prices, how handover works, and no-poaching.
- `/about/`: Glen and the human-led, AI-driven way of working, with no unconfirmed claims.
- `/blog/` (Keystatic), `/contact/` (lead form), `/thanks/`, `/form-error/`, `/404`.
- `/lp/start/`: an ads landing page for the founding offer.

Med spa note: forms ask only for name, business, email, phone, website and a message, with no health details.

## Builder's calls (Claude)

- Contact email `hello@gallardesign.com`, since the domain isn't bought yet. No phone or street address until Glen gives them, so the business schema is `ProfessionalService` with no address.
- Fonts are self-hosted and subset (Newsreader pinned to 400, Fraunces cut to the letters of the name) so the site makes no Google Fonts requests and stays at Lighthouse 98 to 100.
- One starter blog post, built from the competitor research: what a $0-down website plan should include.

## Left open

- Glen's photo and real bio facts for `/about/`
- Glen's portfolio link
- A phone number and city
- The tracking IDs
