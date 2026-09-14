# Decisions — current facts and lessons

Loaded via `CLAUDE.md`. Cap: 250 lines. Compact into `.factory/history/` when close to the cap.

Sessions 1–7 build decisions (stack, fonts, toolchain) are archived in
`.factory/history/2026-09-12-sessions-1-7.md` and still apply. Session 8 integration and
the pre-restart "Blueprint" visual-rebuild lessons are archived in
`.factory/history/2026-09-13-session8-and-visual-rebuild.md` — superseded by Direction C
below, but the provisioned Firebase project/domain facts there still apply. Prompt 0's
foundations-restart session (Direction C palette/logo/type/nav lock, the pre-restart
pages it deleted) is archived in
`.factory/history/2026-09-14-prompt0-foundations-restart.md` — its decisions still hold.
Prompts 1–6 (homepage; products hub + all 7 family pages; tools hub + both calculators;
Field Notes hub + 5 articles; About/Contact + Firestore enquiry wiring) are archived in
`.factory/history/2026-09-14-prompts-1-6.md` — their decisions still hold, this file now
carries only Prompt 7.

# Session 2026-09-14 — Prompt 7: QA and production readiness (final session)

Full sweep for pre-restart leftovers, then the numbered QA checklist. All 20 pages exist
going in; no new copy or product content was added this session.

**Dead pre-restart code removed** (none of it was imported by any live page — verified by
grep before deleting): `SupplyStages.astro`, `supplies/StageNav.astro` +
`NotesBlock`/`QuotationBlock`/`SpecTable`, `tools/ConsumablesPlanner.astro` +
`SleeveSelector.astro`, `lib/tools/sleeve.ts`/`sleeve-ui.ts`/`planner.ts`/`planner-ui.ts`,
`components/Figure.astro` + `assets/figures/**` (incl. `GraftJoin.astro`), and the
`/supplies`-era product data (`tables.ts`, `prepare.ts`, `graft.ts`, `root.ts`,
`protect.ts`, `record.ts` under `src/data/products/`). Their tests
(`tests/tools/*.spec.ts`/`*.test.ts`, `tests/unit/spec-tables.test.ts`) and the
`tests/tools/fixtures/` Playwright harness (port 4322, the second `tools` project in
`playwright.config.ts`) went with them — that harness existed only to exercise the
orphaned components. `vitest.config.ts`'s `include` and `playwright.config.ts`'s
`webServer`/`projects` were trimmed to match.

**`404.astro` had never been rebuilt.** Prompt 0's own note flagged this — every other
pre-restart page was rebuilt by Prompts 1–6, but 404 was not on that list. It still linked
to the deleted `/supplies` and `/specifications` routes. Fixed to link Home/Products/
Contact; kept `PageHero` and the existing token usage (`--ink-soft`, `--rule` — both still
live, see below) rather than restyling.

**`--ink-soft`/`--signal`/`--signal-ink` are not dead, despite the "superseded" label in
`tokens.css`'s own comment.** `PageHero.astro` (used live by `about.astro` and the rebuilt
`404.astro`), `RuledRows.astro` (About), `QuoteForm.astro` (Contact) and `admin/index.astro`
all still read them. `tokens.css` is a protected file (`.factory/manifest.json`) and its
guard hook refused a comment-only correction ("ask the owner to name the exact edit") —
left as is; the tokens themselves were not touched. Did fix the one real drift the Prompt 0
note flagged as CLAUDE.md-owned: `PageHero`'s `.hero-eyebrow` was still `--f-mono` while the
sitewide `.eyebrow` utility (`global.css`) had already moved to Inter 700 — switched it to
match, and updated CLAUDE.md's invariants (mono-for-eyebrows, one-colour wordmark, bare
`--signal`) to describe Direction C instead of the superseded rule.

**Redirects added** for the four deleted routes named in the brief
(`astro.config.mjs`'s `redirects`): `/supplies → /products/`, `/how-grafting-works →
/field-notes/`, `/ordering` and `/specifications → /contact/`. The sitemap filter excludes
these stub pages and `/admin` — `sitemap-0.xml` carries exactly the 20 canonical pages.

**Favicon/app icons were pre-restart assets, never regenerated after the Direction C logo
change** — `git log` showed them last touched in the old Session 8 integration commit,
depicting the old glyph on a white background with drawing-sheet corner marks. Regenerated
every size from `public/images/logo/mark.svg` (light tone) via a new
`scripts/generate-favicons.mjs` (favicon.svg/-16/-32/apple-touch-icon/icon-192/icon-512,
plus a hand-built PNG-frame `.ico`); `site.webmanifest`'s theme/background colours moved
from white to `--paper`. `BaseLayout.astro` now links the 16px PNG explicitly alongside the
existing SVG/32px/ICO/apple-touch/manifest tags.

**OG default image was also a pre-restart asset** (`public/og-default.png` — old logo, old
copy, the forbidden drawing-sheet border) — deleted; replaced by a hand-built
`public/images/og/og-default.jpg` (1200×630, brand palette, mark + two-tone wordmark, no
tagline — avoided inventing new copy) via `scripts/generate-og-default.mjs`, wired as
`Seo.astro`'s new default. Per-page share images: all 20 pages now pass a dedicated
`/images/og/og-<slug>.jpg` to `BaseLayout`'s `image` prop (the 9 pages that previously had
no `BaseLayout image` at all — they only passed `image` to `FamilyHero`/`ToolIntro` for the
on-page hero photo, a different prop — silently fell back to the generic default; now every
page has its own). Placeholders for all 20 generated by extending
`scripts/generate-placeholders.mjs`'s `ENTRIES`, documented in `docs/image-manifest.md`
same as every other row — swap the file in place for real photography later.
`sitemap.xml`/`robots.txt`: already correctly wired from Prompt 0 (`@astrojs/sitemap` +
`robots.txt` pointing at `/sitemap-index.xml`) — verified, not rebuilt.

**Accessibility fixes found by a full-repo audit** (axe already passed every route before
this — these are misses axe's `alt` rule doesn't catch, since `alt=""` is valid for a
genuinely decorative image, not a content photo): four content images had `alt=""` — the
homepage/products-hub product-grid photos (now `families.ts`'s new `imgAlt` field, copied
from each family's own `imageAlt`) and the Field Notes hub/article cover photos (now a
`coverAlt` frontmatter field per article, added to `FieldNoteFrontmatter` in both
`articles.ts` and `[slug].astro`). One real contrast bug: `Carousel.astro`'s figcaption
used `--ink-overlay` (0.55 opacity) instead of the tested-safe `--ink-overlay-strong` (0.72)
that `PageHero`/`FamilyHero` use for the same over-photo-text case — affects the grid-variant
Propagation Journey and Facilities-in-use carousels on the homepage. Fixed. Extended
`tests/unit/contrast.test.ts` to cover `--soft` (the token Direction C pages actually use,
vs. the already-tested legacy `--ink-soft`), `--gold-ink` (footer credit link) and
`--green-dark` (Monitoring spotlight) — all clear AA, previously untested. Also found and
fixed a trailing-slash inconsistency: Field Notes links were built as `/field-notes/<slug>`
(no trailing slash) everywhere else in the codebase uses one — not a 404 under Astro's
`trailingSlash: 'ignore'`, but inconsistent; normalised.

**Lighthouse**: `scripts/lighthouse.mjs`'s route list was stale (`/about` "standing in"
for pages that now exist) and mobile-only. Updated to the brief's four routes (home, one
product family, one tool, one Field Note) and added a desktop pass via lighthouse's
`desktopConfig`. All 8 runs (4 routes × 2 form factors) score 97–100 across all four
categories — nothing needed fixing.

**`/verify` (factory-check full) is green**: all 7 manifest gates, typecheck, lint,
format, 27 unit tests, 103 e2e tests (2 Firestore-emulator tests skip, as before — no
emulator running), build, and the Lighthouse pass above.
