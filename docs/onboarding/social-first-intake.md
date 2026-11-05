# Social-first intake

Many small businesses have no website and no brand kit, but they do have a
Facebook page, an Instagram grid, a TikTok or a YouTube channel full of
photos, prices, reviews and their own way of talking. This process turns those
profiles into a first website draft in a day, so the client sees their site
before they've gathered anything new. Better photos and copy replace the
social ones later.

## At a glance

| When | Step | Output |
|---|---|---|
| Day 0 | Client gives profile links (intake form or chat) and says yes to using them | permission record |
| Day 0 | `npm run intake -- <links>` | `intake/` folder, links in site settings |
| Day 0-1 | Collect: client export or shared folder first, then careful manual capture | `intake/raw/<platform>/` |
| Day 1 | Claude fills the brief and picks assets (`social-brand-brief` skill) | `intake/brief.md`, `intake/picked/`, `intake/assets.csv` |
| Day 1 | `npm run intake:check` | every picked asset cleared |
| Day 1-3 | Build the draft: tokens from the brief, content from the facts | preview site |
| Later | Client sends better photos, logo files, missing facts | swap in, re-run the check |

## 1. Ask for links and permission

Get every profile link: Facebook, Instagram, LinkedIn, YouTube, TikTok, plus
Google Business Profile if they have one (it often has the best hours and
reviews). Send `templates/intake/permission-message.md` and keep their written
yes. Without it, stop: the page owner has to agree before we reuse their
photos and words.

## 2. Start the intake folder

```bash
npm run intake -- facebook.com/acmedental ig:@acmedental tiktok:@acmedental
```

This creates:

```
intake/
  sources.json        profile links and start date
  brief.md            the brand brief to fill (from templates/intake/brief.md)
  assets.csv          one row per asset we plan to use (file, source, rights, use, alt)
  raw/<platform>/     everything collected, not committed (gitignored)
  raw/client-uploads/ what the client sends directly, plus the permission screenshot
  picked/             the shortlist that goes on the site (committed)
```

It also adds the links to `src/content/settings/site.json`, so they appear in
the footer and in the LocalBusiness `sameAs` schema.

## 3. Collect, in this order

1. **The client's own export (best).** Full-resolution files, no grey areas.
   - Facebook page: Settings > Download your information > choose the Page >
     Photos and videos (page admin only).
   - Instagram: Accounts Center > Your information and permissions > Download
     your information.
   - YouTube: the owner downloads their own videos from YouTube Studio, or
     uses Google Takeout.
   - TikTok: Settings > Account > Download your data, or save single videos in
     the app.
   - Or simply: "send your logo and 10 favourite photos to this Drive folder".
2. **Manual capture, low volume.** Open the public profile in a browser and
   save the specific posts, the profile picture, the cover photo and the About
   details. Claude in Chrome on the agency computer can do this reading and
   note-taking with us. Take screenshots of the grid and best posts for the
   look and voice, even when you don't save the images themselves.
3. **Embed instead of download** for video. A YouTube or TikTok embed keeps the
   view counts and needs no file rights; only download when the client sends
   the file.

**Don't** run bulk scrapers or downloaders (Apify actors, browser extensions
that save whole profiles, yt-dlp on someone else's channel) and don't log in
with the client's password. Meta's, TikTok's and YouTube's terms ban automated
collection, accounts get flagged, and the client's export gives better files
anyway.

## 4. Brief and shortlist

In Claude Code, ask: *"run the social brand brief skill"*
(`.claude/skills/social-brand-brief/SKILL.md`). It reads `intake/raw/`, the
profile links and the screenshots, then:

- fills `intake/brief.md` with sourced facts, voice, colours and photo style,
  and lists unknowns as questions for the client,
- copies the best 6 to 12 images into `intake/picked/` with a row each in
  `intake/assets.csv`,
- proposes `src/styles/tokens.css` values and first-draft page content.

Review the brief before building. It is a draft from public posts, and the
client corrects it.

## 5. Check rights, then build

```bash
npm run intake:check
```

Fails if any picked file has no row, no source, no alt text, or rights other
than `client-owned`, `client-licensed`, `stock-licensed` or `ours`. Fix the
rows (or remove the file) before the preview goes out.

Then build the draft the usual way: tokens in `src/styles/tokens.css`,
content in `src/content`, images moved from `intake/picked/` into the pages.

## Things to watch

- **Photo quality.** Facebook and Instagram shrink and recompress uploads
  (roughly 1080-2048px). Fine for cards and galleries, often soft for a full
  width hero. Mark those for replacement in the brief.
- **Logos.** Profile pictures are small, cropped to a circle and compressed.
  Ask for the original; if there is none, redraw it as SVG and get the client's
  OK on the redraw.
- **People in photos.** Staff are usually fine with the owner's OK. Customers,
  and especially patients (before/after shots in clinics), are personal data
  under the Philippine Data Privacy Act (RA 10173): use them only when the
  client confirms those people agreed to it. Mark them in `notes`.
- **Other people's content.** Reposts, memes, stock-looking images and photos
  credited to a photographer aren't the client's to give. Leave them out, or
  get the photographer's OK.
- **Prices and promos** in posts go stale. Confirm with the client before they
  go on a page.
- **Reviews.** Quote them with the reviewer's first name and date, from a
  public review only, and link the source profile.

## Later: swapping in better assets

When the client sends new photos, put them in `intake/raw/client-uploads/`,
copy the keepers into `intake/picked/`, add rows with rights `client-owned`,
replace the social versions in the pages, and re-run `npm run intake:check`.
