# PropagAfrica — implementation blueprint

The master reference for this project. Sessions after the first read this file and `CLAUDE.md`
instead of the original prompt. Keep it structured and scannable — a working document, not prose.

## 1. What this is

A 14-page marketing and catalogue site for PropagAfrica Technologies (Nairobi; sells plant-
propagation consumables to nurseries and cut-flower farms in Kenya and Ethiopia). No online sales,
no prices anywhere — every commercial path ends in a quotation request. Two future interactive
tools (sleeve selector, consumables planner) are specified in a later session; this build leaves
room for them but does not implement them.

## 2. Stack

| Layer           | Choice                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------- |
| Framework       | Astro 5, TypeScript strict                                                               |
| Styling         | Hand-written CSS, design tokens in `src/styles/tokens.css`. No Tailwind/UI lib/CSS-in-JS |
| Interactivity   | Vanilla TS in Astro islands (`client:visible`) — not built yet                           |
| Unit tests      | Vitest (`tests/unit/`)                                                                   |
| E2E / visual    | Playwright (`tests/e2e/`)                                                                |
| Lint / format   | ESLint flat config + Prettier                                                            |
| Hosting         | Firebase Hosting (not wired yet)                                                         |
| Backend         | Cloud Functions (2nd gen) + Firestore, quotation requests only (not wired yet)           |
| Package manager | pnpm, Node 22                                                                            |

## 3. Brand

### Colour tokens (`src/styles/tokens.css`)

`--paper #FFFFFF` · `--ink #0E1211` · `--ink-soft #68716E` · `--green #0A5C3C` ·
`--signal #E0521F` · `--rule #DCE2DF`.

Rules: `--signal` only on a dimension/tolerance/callout leader/figure reference, never a button or
background or decoration, target <5% of ink coverage per page. `--green` never a gradient, never a
large fill, never paired with yellow. No colour outside these six without adding it here and to
`DECISIONS.md`.

### Type

Self-hosted (see `.factory/DECISIONS.md` for the sourcing decision): Inter Variable (400–800) and
JetBrains Mono (400/500/700), Latin subset, `font-display: swap`, files in `public/fonts/`,
declared in `src/styles/global.css`.

| Role                | Face           | Weight  | Size                     | Tracking |
| ------------------- | -------------- | ------- | ------------------------ | -------- |
| Page H1             | Inter          | 800     | clamp(30px, 5vw, 56px)   | -0.037em |
| Section H2          | Inter          | 800     | clamp(22px, 3vw, 34px)   | -0.030em |
| H3                  | Inter          | 700     | clamp(18px, 2.2vw, 23px) | -0.024em |
| Body                | Inter          | 400     | 16px / 1.6               | normal   |
| Eyebrow, label      | JetBrains Mono | 400     | 9.5–10.5px UPPERCASE     | 0.13em   |
| Table, spec, figure | JetBrains Mono | 400/500 | 10.5–12px                | normal   |

Every numeric column: `font-variant-numeric: tabular-nums`.

### Logo (`src/components/Mark.astro`)

Graft-union mark: one stem, two roots, a collar across the join. Props `size`, `tone` (`ink | reverse`).
Never redrawn, no leaf, no further rounding, never in a circle/badge. Wordmark lockup
(`src/components/Wordmark.astro`): "PropagAfrica" — Inter 700, tracking -0.028em, title case,
never all-caps, one colour; "TECHNOLOGIES" — JetBrains Mono 6.8px, tracking 0.3em, capitals,
`--ink-soft`, directly beneath.

### "Blueprint" design system

- **SheetFrame.astro** — 1px `--rule` border inset 9–10px from the viewport edge, four `--signal`
  registration squares at the corners. Wraps every page once.
- **TitleBlock.astro** — bordered key/value mono block: drawing no., subject, principal SKU, key
  dimension, scale. Sits top-right of a page's hero.
- **Figure.astro** — full-width figure; graphic and caption run side by side (never a card), figure
  number, caption, optional revision mark, plus a sheet footer `FIG. 0n · SUBJECT · REV. A` /
  `SHEET 0n OF 14`.
- Density varies deliberately page to page — do not equalise section padding.
- **Forbidden permanently**: card grids with rounded corners + drop shadows, border-radius > 4px
  (except the logo collar), box-shadow, gradients, backdrop-filter, icon+title+two-line feature
  triplets, fade-up-on-scroll, animated counters, marquee logo strips, chat bubbles, 100vh hero.

## 4. Information architecture (14 pages)

| Route                 | Status (session 1)                                        |
| --------------------- | --------------------------------------------------------- |
| `/`                   | Hero built per §5 copy below; rest of the page waits      |
| `/supplies`           | Stub                                                      |
| `/supplies/prepare`   | Stub                                                      |
| `/supplies/graft`     | Stub                                                      |
| `/supplies/root`      | Stub                                                      |
| `/supplies/protect`   | Stub                                                      |
| `/supplies/record`    | Stub                                                      |
| `/how-grafting-works` | Stub                                                      |
| `/specifications`     | Stub                                                      |
| `/ordering`           | Stub                                                      |
| `/field-notes`        | Stub (index)                                              |
| `/field-notes/[slug]` | Template, `getStaticPaths` returns none (no articles yet) |
| `/about`              | Stub                                                      |
| `/contact`            | Stub — will hold the quotation form (critical path)       |

Primary nav, fixed order/wording: Supplies · How grafting works · Specifications · Ordering ·
Field Notes, plus a persistent "Ask for a quotation" button. No blog, news, careers, newsletter.

## 5. Copy rules

No founding date/company age/"newly established" anywhere. Plain English first, technical terms
defined on first use, no adjective without a figure+unit, every research result carries its
country, vegetable grafting in Kenya is "emerging" never "widespread". Banned words: empowering,
transforming, unlocking, seamless, cutting-edge, revolutionary, world-class, best-in-class,
one-stop shop, "Welcome to", "Why choose us", "at scale", bare "solutions". British spelling.

**Home hero (built, do not rewrite):**
Eyebrow `NAIROBI · SUPPLYING KENYA AND ETHIOPIA` — H1 "Propagation supplies for nurseries and
flower farms." — Subhead as specified in the original brief — buttons "Ask for a quotation"
(primary) / "See what we supply" (outline).

## 6. Accessibility / performance floor

WCAG 2.1 AA, full keyboard reachability + visible focus, `prefers-reduced-motion: reduce` disables
motion, meaningful SVGs get `role="img"` + `aria-label`, decorative ones `aria-hidden="true"`.
Lighthouse targets on the built home page: Performance ≥95, Accessibility 100, Best Practices ≥95,
SEO ≥95 (mobile). No horizontal scroll at 320/375/400px. Zero JS shipped on the home page at this
stage (no islands yet).

## 7. Component inventory

| Component  | Path                              | Notes                                 |
| ---------- | --------------------------------- | ------------------------------------- |
| Mark       | `src/components/Mark.astro`       | protected path                        |
| Wordmark   | `src/components/Wordmark.astro`   | uses Mark                             |
| SheetFrame | `src/components/SheetFrame.astro` | wraps every page via BaseLayout       |
| TitleBlock | `src/components/TitleBlock.astro` | drawing-number key/value block        |
| Figure     | `src/components/Figure.astro`     | full-width figure + sheet footer      |
| Header     | `src/components/Header.astro`     | nav from `src/lib/nav.ts`             |
| Footer     | `src/components/Footer.astro`     | four columns + baseline row           |
| BaseLayout | `src/layouts/BaseLayout.astro`    | head, fonts, SheetFrame/Header/Footer |

Supporting: `src/lib/nav.ts` (typed nav model + `isActive`, unit tested).

## 8. Footer content

Four columns: Supplies (five stages) · Tools (sleeve selector, consumables planner, ordering) ·
Documents (product data sheets, safety data sheets, certificates of analysis, Field Notes) ·
PropagAfrica Technologies (Nairobi, Kenya · +254 722 861 682 · info@propagafrica.com · Kenya and
Ethiopia). Baseline row (mono, `--ink-soft`): "Specifications held to batch · Safety data sheets
and certificates of analysis issued with consignment · © 2026." No founding year, no registration
number (none supplied).

## 9. What's deliberately not in session 1

- No page content beyond the home hero.
- No sleeve selector, no consumables planner (later session; components should leave room but not
  pre-build them).
- No Firebase/Firestore/Cloud Functions wiring — `/contact` is a stub, listed as a critical path in
  `.factory/manifest.json` for when it's built.
- No Field Notes articles.
- No favicon / social meta image.
