# Decisions — current facts and lessons

Loaded via `CLAUDE.md`. Cap: 250 lines. Compact into `.factory/history/` when close to the cap.

## Stack (fixed by spec, session 1)

- Astro 5 (pinned `^5`, not the newer major that `pnpm add astro` resolves to by default),
  TypeScript strict, hand-written CSS with design tokens, Vitest, Playwright, ESLint flat config +
  Prettier, pnpm, Node 22. Firebase Hosting + Cloud Functions (2nd gen) + Firestore for the
  quotation path — not wired yet (session 2+).
- No Tailwind, no UI library, no CSS-in-JS. No framework for the two future islands beyond
  vanilla TS in `client:visible` Astro islands.

## Fonts — self-hosted via npm, not a CDN fetch

- `fonts.google.com` is not reachable from this environment (proxy returns 403). Inter and
  JetBrains Mono were obtained instead from the `@fontsource-variable/inter` and
  `@fontsource/jetbrains-mono` npm packages, whose Latin-subset `.woff2` files were copied into
  `public/fonts/` and the packages then removed from `package.json` (they were a one-time source
  for static files, not a runtime dependency). `@font-face` is declared once in
  `src/styles/global.css`, `font-display: swap`, preloaded in `BaseLayout.astro`.
- Inter is shipped as the single variable file (weights 400–800 via `font-variation-settings` /
  `format('woff2-variations')`); JetBrains Mono is shipped as three static weights (400/500/700)
  since Fontsource does not publish a JetBrains Mono variable build.

## Playwright — pinned to the pre-installed browser

- The sandbox pre-installs Chromium at `/opt/pw-browsers/chromium-1194` and sets
  `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`. `@playwright/test@1.63.0`'s bundled build id (1243)
  doesn't match, so `playwright.config.ts` sets
  `use.launchOptions.executablePath: '/opt/pw-browsers/chromium'` on the `chromium` project instead
  of running `playwright install`. Do not remove this — a fresh `playwright install` will not be
  reachable in this environment either.

## Astro version pin

- `pnpm add astro` resolves to Astro 7 by default (newer major already shipped). The spec fixes
  Astro 5, so the dependency is pinned `astro@^5` in `package.json`. Re-check this pin before any
  future `pnpm update`.

## Navigation is a typed module, not inline JSX

- `src/lib/nav.ts` exports `NAV_ITEMS` and `isActive()`, imported by `Header.astro` and covered by
  a Vitest unit test (`tests/unit/nav.test.ts`). This keeps the five-item order/wording from §4 of
  the spec testable without a browser, and gives `factory-check quick` something fast to run.

## No favicon / OG image yet

- Not specified for session 1. `BaseLayout.astro` ships a bare `<head>` (charset, viewport, title,
  description, font preloads). Add favicon and social meta when the asset exists.

## Session 1 scope boundary

- Home page ships only the hero (eyebrow, H1, subhead, two buttons) inside the sheet frame, per
  the brief. All 13 other routes are stubs that render the shell (header, title block, footer) so
  navigation never 404s; no page content beyond that is in scope for this session.

## 2026-09-12 — Playwright browser resolution

Session 1 ran in a cloud sandbox and hardcoded `/opt/pw-browsers/chromium` as the
Chromium executable, which fails on any other machine. The config now uses
Playwright's own managed browser by default and honours `PLAYWRIGHT_CHROMIUM_PATH`
when a preinstalled binary is available. Run `pnpm exec playwright install chromium`
once per machine.

## 2026-09-12 — pnpm 11 build approvals

pnpm 11 no longer reads the `pnpm` field in `package.json`. Build-script approvals
for `esbuild` and `sharp` live in `pnpm-workspace.yaml` under `allowBuilds`.

---

# Session 8 — integration

## Branch mapping

Sessions 2–7 ran as cloud sessions on harness-assigned branch names. The mapping,
established from `git diff --stat main...origin/<branch>`:

| Session | Branch                          | Scope                                                                                       |
| ------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| 2       | `claude/vibrant-gauss-st1orq`   | Home page                                                                                   |
| 3       | `claude/lucid-sagan-9f6d6y`     | Supplies stage pages                                                                        |
| 4       | `claude/nice-hypatia-rgq275`    | Sleeve selector, consumables planner                                                        |
| 5       | `claude/laughing-hopper-ne2aig` | How grafting works, Field Notes                                                             |
| 6       | `claude/practical-tesla-m1pila` | Quotation form, Firestore, Cloud Functions                                                  |
| 7       | —                               | **Never delivered.** `/specifications`, `/ordering` and `/about` were written in session 8. |

Merged in the planned order (home, supplies, tools, words, reference, quotation).
Zero conflicts — the disjoint-ownership rule held.

## Specification tables now have one source of truth

`src/data/products/tables.ts` is the registry: one descriptor per table carrying its
id, stage, caption, columns and rows. `/specifications` and all five stage pages
import from it, so a table cannot say one thing in one place and another elsewhere.
`src/data/specs/` was never created, so there was nothing to delete.

Proved two ways: `tests/unit/spec-tables.test.ts` asserts the registry holds the same
array _instance_ the stage data exports (a copy would pass deep equality and still be
able to drift), and `tests/e2e/site.spec.ts` reads the rendered sleeve and clip tables
from both `/supplies/graft` and `/specifications` and asserts the cells are identical.

The `/specifications` title block reads its table count from the registry, so it can
never disagree with the page beneath it. The copy deck said 7; the built data is 9.

## The planner → quotation query contract

Session 4 emitted a `pt_*` parameter namespace. Nothing read it: session 6's prefill
reader is generic over `QUOTATION_FIELDS` and looks for parameters named after the
form's own fields. Session 4's side was the wrong one. `buildQuotationQuery` now emits
`annualVolume` (the yearly total) and `notes` (the worked quantities and every stated
assumption), both real form fields, truncated to the field's own `maxLength`.

## Two real bugs the mount surfaced

- **Horizontal scroll at 320 px on `/supplies/graft` and `/ordering`.** A `fieldset`
  defaults to `min-width: min-content` and refused to shrink below the widest toggle
  row. Session 4 tested the tools against a static fixture at desktop width, so this
  only appeared once they were mounted on a real page. Fixed with `min-width: 0` on
  the fieldsets and their flex ancestors.
- **`--signal` orange fails WCAG AA as text**: 3.89:1 on white, flagged by axe on
  `/how-grafting-works`. The brand orange stays as a _graphic_ colour (leaders, tick
  marks, rules); a new `--signal-ink` (`#c1471b`, same hue, 5.02:1) carries any
  `--signal` used as text, including dimension labels inside the drawings.
  `tests/unit/contrast.test.ts` reads the tokens from `tokens.css` and checks every
  pair the site actually uses.

## SEO, metadata and icons

- `site` is now `https://propag.navac.co.ke` — the mapped host agreed for launch.
  It drives canonical URLs, Open Graph URLs and the sitemap. One place to change.
- `@astrojs/sitemap` generates `sitemap-index.xml` at build, filtering `/admin`.
  `public/robots.txt` disallows `/admin` and points at the sitemap.
- `src/components/Seo.astro` emits canonical, Open Graph, Twitter card and optional
  JSON-LD, wired through `BaseLayout`.
- `src/lib/seo.ts` builds `Organization` (home) and `Article` (each Field Note) JSON-LD.
  No founding date, no headcount, no rating, no publication date — none is stated in the
  client material. The `no-founding-date` gate now covers `.ts` too, so adding one fails
  the build.
- Favicon, apple-touch-icon and the 192/512 PWA icons are generated from the Mark,
  single colour on white. `public/og-default.png` is a typographic share card in the
  house style — the twelve photographs in `docs/images/nano-banana-prompts.md` are
  still to be generated, and nothing in the layout depends on them.

## Gates added

`wordmark-case` (no `PROPAGAFRICA`, `Propagafrica` or `propagAfrica` anywhere),
`no-placeholder-copy` (lorem, "coming soon", a leftover `TODO(session…)`, stub text),
`no-prices`. `no-founding-date` widened to `established 20`, `since 20`,
`years of experience`, `foundingDate`, `numberOfEmployees`; `no-banned-words` widened
to `empower`, `transform`, `unlock`, `one-stop`, `state-of-the-art`, `game-chang`,
`industry-leading` (`transform` is anchored so it does not match `text-transform`);
`no-forbidden-ui` now also fails any `border-radius` above 4px.

`factory-check full` additionally runs `scripts/lighthouse.mjs` — mobile audits of
`/`, `/supplies/graft`, `/field-notes/how-a-graft-knits-together` and `/contact`
against Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO ≥ 95.

## What session 8 wired up

- `SleeveSelector` mounted on `/supplies/graft` under **Find the right sleeve**; the
  in-page link points at it.
- `ConsumablesPlanner` mounted on `/ordering` under **Work out what a cycle consumes**.
- The home page's Field Notes teaser reads from `src/data/field-notes/articles.ts`
  (new shared module: the glob and the fixed order, once) instead of three hard-coded
  rows, and links each title to its article.
- The three figures session 5 left pending — `traceability-chain`, `dilution`,
  `cell-section` — are wired into `[slug].astro` from session 3's folder. The
  parallel-run rule that kept that page out of that folder applied only while the
  sessions ran side by side.
- `/404` in the house style: sheet frame, `PA-404 / SHEET NOT FOUND` title block, a
  plain sentence, three links. No illustration, no joke.

## Session 7 delivered late, on `claude/jolly-lamport-fmnpd9` — not merged

Session 7 pushed its reference pages 28 minutes after session 8 had already
written them. Its branch was cut from `main` before the integration, so it never
saw `src/data/products/`, and it re-typed all nine specification tables into a
new `src/data/specs/index.ts` with its own local table and list components —
exactly the duplication the integration brief said to remove. Merging it would
have reintroduced that duplication and conflicted on all three pages.

Kept instead of merged. Three things were taken from it:

1. **Its best idea, generalised.** It tested `/about` by running a full
   `astro build` inside a unit test and grepping the built HTML, on the correct
   reasoning that a manifest gate is a regex over _source_ and a rephrase can
   dodge it. `tests/e2e/site.spec.ts` now greps the **rendered text** of every
   route against the banned-phrase list, plus a stricter set of patterns on
   `/about` — without a three-minute build inside a unit test.
2. **A missing CTA.** `/specifications` closes with the copy deck's
   `Ask for a specification sheet →`, not the generic quotation block.
3. **A real find the new check surfaced**: the footer read `© 2026`, which
   quietly dates the company — the exact thing the owner ruled out. The year is
   gone; the notice is now `© PropagAfrica Technologies`.

If that branch is ever wanted, take the copy from it and not the data layer.

## Cloud project and domain — provisioned

- Firebase / GCP project: **`propagafrica`**. Gemini in Firebase and Google Analytics were both
  declined at creation: neither is needed, and the Gemini disclaimer says prompts may be used to
  train the model. Either can be enabled later from the console.
- Firestore: `(default)`, **Standard edition, Native mode, `eur3` (Belgium and Netherlands)**,
  started in production mode so client reads and writes are denied until `firestore.rules` is
  deployed. **The location is permanent — Firestore cannot be moved between regions.**
- Hosting site `propagafrica` → `propagafrica.web.app` / `propagafrica.firebaseapp.com`.
- Custom domain **`propag.navac.co.ke`** added in Hosting. DNS at HOSTAFRICA (DirectAdmin,
  `da10.host-ww.net:2222`) now carries `CNAME propag → propagafrica.web.app.` TTL 3600 — the same
  pattern as the existing `crm`, `bms` and `insureflow` subdomains on this zone. Public resolvers
  answer `199.36.158.100`, the same Firebase edge IP those use.
- **The project is on the Spark (no-cost) plan.** Hosting and Firestore work on Spark; Cloud
  Functions 2nd gen does not. `firebase deploy` will fail on the `functions` target until the
  project is upgraded to Blaze, so the quotation form's backend cannot go live before that.
  Deploy hosting alone with `firebase deploy --only hosting` in the meantime.
