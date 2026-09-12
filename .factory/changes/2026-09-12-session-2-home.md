# 2026-09-12 — session-2-home

Size: standard (home page content build, no critical path touched)

## Intent

- Ask: build the complete home page from `docs/content/copy-home.md` (final copy, placed as
  written) — six new sections below the existing hero: what we supply, the first four weeks
  (with a hand-authored graft-join drawing), the specification promise, how ordering works, a
  Field Notes teaser, and the closing quotation block.
- User-visible outcome: `/` now reads as a complete page — hero (unchanged) followed by the six
  deck sections, ending in the full-width green quotation block.
- Out of scope: rewriting the deck's words, adding sections/testimonials/stats/newsletter/logo
  strip not in the deck, editing any file outside `src/pages/index.astro`,
  `src/components/home/**`, `src/assets/figures/home/**`, and this session's own `.factory` files.
- Known constraints: no new dependency; zero JS on `/`; six-token colour system; no
  border-radius/box-shadow/gradient outside what the deck's own graft-join drawing calls for
  (a rounded-rectangle sleeve, which is illustration content the deck specifies, not UI chrome).

## Spec

- Behaviour: six new `src/components/home/*.astro` components, assembled in `index.astro` in deck
  order. `SupplyStages` — five ruled rows, mono numbers, no cards, no icons. `FourWeeks` — deck
  head copy + a reused `<Figure>` holding the new `GraftJoin` drawing, stacking through 900px.
  `SpecPromise`/`OrderingSummary` — head copy + hairline-ruled mono fact rows. `FieldNotesTeaser` —
  three ruled rows, hard-coded (see decisions file — `src/data/field-notes/` isn't built yet).
  `QuoteBlock` — the page's one large `--green` area.
- Files touched: `src/pages/index.astro` (assembles the six sections; hero left untouched);
  `src/components/home/{SupplyStages,FourWeeks,SpecPromise,OrderingSummary,FieldNotesTeaser,
QuoteBlock}.astro`; `src/assets/figures/home/GraftJoin.astro`; this file and
  `.factory/decisions/session-2.md`.
- Edge cases: `src/data/field-notes/` absent → hard-coded fallback with a `TODO(session-8)`.
  `Figure.astro`'s own breakpoint (800px) is below the 900px this section needs → closed with a
  scoped override, not an edit to the frozen component. Deck's `|` title separator vs.
  `BaseLayout.astro`'s fixed `·` → flagged in decisions, not resolved by editing the frozen layout.
- Acceptance checks: see Verify + Review below — all the brief's checks except the two the
  environment couldn't run (see decisions file).

## Plan

1. Merge `origin/main` to pick up `docs/content/copy-home.md` (missing at session start) →
   verify: file present, `pnpm install` clean.
2. Read the deck, `blueprint.md`, and the shared components (`Figure`, `TitleBlock`, `SheetFrame`,
   `Header`, `Footer`, tokens) to match existing conventions → verify: none, research step.
3. Hand-author the graft-join drawing → verify: rendered screenshot, dimensions/leaders legible,
   `role="img"` + `aria-label` present.
4. Build the six components + wire them into `index.astro` → verify: `astro check`, `eslint`,
   `prettier --write` on the files I own.
5. Full check pass → verify: `factory-check.sh full`, hex-literal grep, built-HTML script grep,
   manual Playwright viewport/H1 check, screenshots at desktop and mobile width.

- Blast radius: `/` only; no shared component, token, or route outside `/` was touched.

## Build

Six new components under `src/components/home/`, one new drawing component under
`src/assets/figures/home/`, `index.astro` updated to import and place them in deck order. No new
dependency, no client-side script anywhere in the new files. Full reasoning for each non-obvious
call (drawing-as-component, the Figure breakpoint override, the field-notes fallback, the title
separator, what didn't get checked and why) is in `.factory/decisions/session-2.md`.

## Verify + Review

- `bash scripts/factory-check.sh quick` → **GREEN**.
- `bash scripts/factory-check.sh full` → **RED**, but only on `prettier --check .` for four files
  this session never touched and doesn't own (`.factory/DECISIONS.md`,
  `docs/content/copy-reference.md`, `docs/content/copy-supplies.md`,
  `docs/content/field-notes.md`) — all arrived via the `origin/main` merge. Confirmed with
  `git status` that this session's diff doesn't include them. Every other full-check step (astro
  check, eslint, vitest, astro build, playwright) passed.
- `grep -rn "#[0-9a-fA-F]{3,6}" src/components/home src/pages/index.astro` → no matches.
- Built `/index.html` → no `<script>` tag.
- Manual Playwright check (throwaway script, not committed) at 320/375/400/768/900/901/1280px →
  no horizontal scroll at any width; H1 text matches the deck exactly
  ("Propagation supplies for nurseries and flower farms.").
- Screenshots at 1280px and 390px reviewed by hand: sections render in deck order, the drawing
  stacks above its words on mobile ("figure first"), the quote block is the only large green area.
- Lighthouse: not run (no CLI in this environment, installing one was out of scope) — manual
  substitute in the decisions file (zero JS, no raster images, preloaded self-hosted fonts,
  semantic headings, computed contrast ≥6.3:1 on every new text/background pairing).
- Reviewer agent: not run as a separate pass this session.

## Learn + Ship

- → `.factory/decisions/session-2.md` (this session owns that file, not the shared
  `.factory/DECISIONS.md`, which was left untouched per the brief).
- Commit: this commit.
- PR: not opened — not requested, and agents never merge.
