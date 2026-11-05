---
name: social-brand-brief
description: Use when a client site starts from their social media (Facebook, Instagram, LinkedIn, YouTube, TikTok) - fills intake/brief.md, picks assets into intake/picked with rights rows, and proposes tokens and first-draft content.
---

# Social brand brief

Turns what was collected in `intake/` into a brand brief and a shortlist of
assets for the first draft. Process and rules:
`docs/onboarding/social-first-intake.md`. Read it first.

## Before you start

- `intake/sources.json` must exist. If not, ask for the profile links and run
  `npm run intake -- <links>`.
- There must be a permission record (`intake/raw/client-uploads/permission.*`
  or the person telling you the client agreed in writing). If not, stop and
  say so; offer `templates/intake/permission-message.md`.
- Never use a scraper, a bulk downloader or the client's login. If a browser
  tool is available, you may open the public profile pages and read them like
  a visitor, saving only specific images.

## Steps

1. **Inventory.** List everything in `intake/raw/` by platform: images,
   videos, exports (Meta exports are JSON plus media folders; read the JSON
   for captions, dates and the About info). Look at the images.
2. **Facts.** Fill the Business facts table in `intake/brief.md`. Every value
   gets a source in brackets. Never invent hours, prices, addresses or
   credentials; write `unknown`.
3. **Voice.** Read 15 to 30 recent captions and replies. Describe the voice in
   three words, note language mix (English, Tagalog, Bisaya), emoji habits and
   repeated phrases. Quote real lines.
4. **Look.** From the logo and the best-performing or most typical posts:
   - Sample colours as hex values (use Python with Pillow if installed, or
     read them from SVG/logo files). Choose primary/secondary/accent from the
     logo and recurring brand graphics, not from one-off promos.
   - Name the type feel and photo style.
   - Map them to the variables in `src/styles/tokens.css` and write the
     proposed values in the brief. Check text/background contrast is at least
     4.5:1; adjust shades if not.
5. **Pick assets.** Choose 6 to 12 images that are sharp, on-brand and show
   the actual business (place, team, work, products). Prefer the largest
   copy. Skip reposts, memes, other brands' graphics, and photos of
   customers or patients unless the client confirmed consent.
   - Copy each to `intake/picked/` with a descriptive kebab-case name
     (`clinic-reception-front-desk.jpg`).
   - Add a row to `intake/assets.csv`: `file`, `source` (platform + post date
     or "client upload"), `source_url`, `rights` (`client-owned` for the
     client's own posts with permission; leave `unknown` when unsure),
     `use` (hero, gallery, team, service:<slug>, logo, decorative), `alt`
     (what is in the photo, plainly), `notes` (low-res, replace later,
     consent needed, and so on).
6. **First draft.** In the brief's First draft plan: pages, a hero line in
   their voice, the main call to action (match how they actually take
   enquiries: Messenger, call, booking link), and which picked image goes
   where.
7. **Questions.** Fill "Still needed from the client" with every unknown and
   every asset marked for replacement.
8. Run `npm run intake:check` and fix what it reports.

## Report back

Tell the person, briefly: the voice in three words, the proposed colours, how
many assets were picked and how many need replacing, and the top questions
for the client. Then wait for their go-ahead before editing tokens and pages.
