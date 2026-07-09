# Archangel Frequencies — Static Authority Site

Astro static site for archangelfrequencies.com. 131 pages: 107 angel number pages, 4 calculators, pillar hubs, 3 money pages, EEAT pages. Builds in under 2 seconds.

## Commands

```
npm install        # once
npm run catalog    # regenerate src/data/catalog.json from scripts/generate-catalog.mjs
npm run dev        # local preview at localhost:4321
npm run build      # static build to dist/
```

## Project structure

```
scripts/generate-catalog.mjs   Catalog generator (digit banks + overrides + top-100 list)
src/data/catalog.json          Generated angel number catalog (the content database)
src/lib/site.ts                Site constants — REVEAL_URL lives here
src/lib/schema.ts              JSON-LD helpers (Article, FAQ, Breadcrumb, Review, ItemList, WebApplication, Org, WebSite)
src/layouts/Base.astro         SEO metadata system: title/description/canonical/OG/schema injection
src/components/                Breadcrumbs (visual + schema), Cta (funnel block), NumberSeal (signature element)
src/pages/angel-numbers/[number].astro   THE PAGE GENERATOR — one template, 107 pages
src/pages/angel-numbers/               hub, meanings index, calculator
src/pages/calculators/                 hub, life-path, personal-year, mirror-hour
src/pages/reviews/ /best/ /vs/         affiliate engine
src/pages/{numerology,archangels,frequency,manifestation,glossary}/  pillar hubs
src/pages/reveal/                      funnel forwarder (noindex)
public/robots.txt, public/_redirects, public/favicon.svg
```

## The catalog workflow (this is the moat)

`scripts/generate-catalog.mjs` composes every page from digit meaning banks + pattern logic, with hand-tuned overrides for the famous numbers (1111, 444, 222, 333, 555, 777). Every generated entry is marked `"draft": true`.

To swap in the real 1,015-entry house catalog:
1. Keep the JSON shape (number, slug, title, tags, spiritual, love, money, twinFlame, biblical, action, faqs, related).
2. Replace generated text field-by-field with house-voice copy (use Claude Code against the Humanizing Style Reference).
3. Add new numbers by appending to the TOP100 list (or replacing the generator's data source with the master catalog file). Rebuild — pages, links, sitemap, and schema all regenerate.

Staged release: publish remaining numbers in weekly batches of ~150 by extending the list, per the Phase 1 plan.

## Deploy to Cloudflare Pages

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build settings: framework preset **Astro**, build command `npm run build`, output directory `dist`.
4. Deploy, then Custom domains → add `archangelfrequencies.com` (and `www`, redirected to apex). Cloudflare handles DNS + SSL since the domain can sit on Cloudflare nameservers.

Every push to main auto-deploys. No servers, no cost at this traffic level.

## Wire the funnel (do this once)

The funnel is untouched and remains the conversion endpoint. Current state: every CTA on the site points to `/reveal/`, which forwards to the Systeme.io URL.

1. In Systeme.io: Settings → Custom domains → add `go.archangelfrequencies.com`.
2. In Cloudflare DNS: add the CNAME Systeme.io gives you for `go`.
3. In `src/lib/site.ts`: set `REVEAL_URL` to `https://go.archangelfrequencies.com`.
4. Optional cleaner redirect: uncomment the line in `public/_redirects` for a server-side 302 instead of the meta-refresh page.
5. Keep running ads to the funnel URL directly — nothing about the ad flow changes.

## Post-launch checklist

- Google Search Console: add property, submit `https://archangelfrequencies.com/sitemap-index.xml`.
- GA4: add the snippet to `src/layouts/Base.astro` head.
- Replace `[DRAFT]` and `TODO(Liz)` blocks: About story, 248 Frequency page, Numerologist review first-hand section + screenshots, Amazon links in the books roundup.
- Post the three calculators to the AF Facebook and Instagram audiences for first traffic and engagement signals.
