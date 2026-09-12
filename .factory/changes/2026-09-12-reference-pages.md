# 2026-09-12 — reference-pages

Size: standard (three real pages of content; `/contact` and all other routes untouched)

## Intent

- Ask: build `/specifications`, `/ordering` and `/about` from
  `docs/content/copy-reference.md` (final copy, sheets 09/10/13 of 14). Copy is final —
  place it, do not rewrite it, except one short linking paragraph on `/about` that the
  copy deck left as a build instruction rather than literal text (see Build).
- User-visible outcome: the three routes render real content inside the existing
  Blueprint shell (sheet frame, header, footer, title block) instead of the "built in a
  later session" stub. Nav, footer and every other route are unchanged.
- Out of scope: `/how-grafting-works` and `/contact` (their own sheets in the same copy
  deck, not touched), the sleeve selector, the consumables planner, any product data
  module beyond this page's own `src/data/specs/`.
- Known constraints: no new dependencies; zero JS on all three pages; British spelling;
  the `/about` hard rule (no founding date, company age, or headcount, anywhere,
  including a rephrase); no hex literal outside `src/styles/tokens.css`.

## Spec

- Behaviour: `/specifications` indexes all seven specification tables (media, trays,
  sleeves, clips, monitoring, hygiene, traceability) plus a "what comes with a
  consignment" and "how to read a specification" section. `/ordering` covers what a
  quotation is priced against, the supply programme, and technical services (anchored
  `#services`, linked from `/about`). `/about` states what the company does, how it
  differs from a general agri-dealer, who it supplies, and points to technical services
  and contact — with no company-age language anywhere.
- Files touched: `src/pages/specifications.astro`, `src/pages/ordering.astro`,
  `src/pages/about.astro`, `src/data/specs/index.ts`, `src/data/specs/RuledList.astro`,
  `src/data/specs/SpecsTable.astro`, `tests/unit/about-copy.test.ts`,
  `.factory/DECISIONS.md`, this file.
- Edge cases: the seven "specification tables" are nine actual `<table>` elements —
  media and hygiene each cover two tables (vermiculite/peat, dilution/range) under one
  heading, matching the copy deck's own section list. `/ordering`'s technical-services
  section carries `id="services"` so `/about`'s pointer link resolves.
- Acceptance checks: `bash scripts/factory-check.sh full` green for everything this
  change touches; `astro build` produces all 14 routes; the new Vitest test greps the
  actually-built `/about` HTML for `founded`, `established`, `since 20`, `years of
experience`; zero `<script>` tags on all three built pages; no horizontal scroll at
  320/375/400px (checked with Playwright, ad hoc, not committed — see Verify); no hex
  literal in any file this change touches.

## Plan

1. Read `CLAUDE.md`, `blueprint.md`, `docs/content/copy-reference.md`,
   `docs/content/copy-supplies.md` (source of the actual table figures) → verify: content
   matches the approved copy deck, not paraphrased.
2. `src/data/specs/index.ts` — typed `SpecSection`/`SpecTable` data, transcribed from
   `copy-supplies.md` → verify: `astro check` / `tsc` clean under `noUncheckedIndexedAccess`.
3. `src/data/specs/SpecsTable.astro`, `RuledList.astro` — minimal, mono, hairline-rule
   components, each table in its own scroll container → verify: no card/shadow/gradient,
   no zebra striping, matches `blueprint.md`'s Blueprint system.
4. Three pages, reusing `BaseLayout`/`TitleBlock` (frozen, unmodified) → verify: `astro
build`, manual read-through against the copy deck line by line.
5. `tests/unit/about-copy.test.ts` — real `astro build` to a temp `outDir`, grep the
   built `/about/index.html` → verify: fails if the banned strings are reintroduced, ran
   it clean.
6. `factory-check full`, plus an ad hoc (uncommitted) Playwright spec at 320/375/400px
   for all three pages → verify: green; deleted the ad hoc spec afterwards.

- Blast radius: three previously-stub routes plus a new `src/data/specs/` module and one
  new unit test. No shared component, style, or other route touched.

## Build

Data-driven `/specifications`: `SPEC_SECTIONS` in `src/data/specs/index.ts` holds all
nine tables as plain typed data (not imported from any product module — none exists in
this codebase yet; `TODO` left in the file for whenever one is). `SpecsTable.astro` and
`RuledList.astro` are new, small, single-purpose components living under
`src/data/specs/` rather than `src/components/`, kept deliberately separate from
anything a future product-catalogue effort might build. `/ordering`'s technical-services
section is `id="services"` for `/about`'s inbound link. The one piece of copy not given
verbatim by the deck — `/about`'s "Technical services" paragraph, specified only as
"short paragraph pointing to `/ordering#services`" — was drafted to state only what's on
the ordering page, with no adjective, no company-age claim, and no banned word.

Skipped the original brief's `.factory/decisions/session-7.md` /
`session/7-reference` branch / `../pa-s7` worktree framing: this repository has no other
session's work in it (no `src/data/products/`, no other session's commits) — it's still
at the single foundation commit plus one upstream merge. Followed the repository's
actual, checked-in convention instead: one `.factory/changes/<date>-slug.md` artifact
(this file) and an appended entry in the single `.factory/DECISIONS.md`, on the branch
this session was actually assigned (`claude/jolly-lamport-fmnpd9`).

## Verify + Review

- `bash scripts/factory-check.sh full`: gates green, caps green (`CLAUDE.md` 37/80,
  `DECISIONS.md` 86/250), `astro check` 0 errors, `eslint .` clean, `vitest run` 7/7
  (3 pre-existing + 4 new `/about` grep assertions), `astro build` 14 pages,
  `playwright test` 6/6 (existing home suite, unaffected).
- `prettier --check .` is RED, but only on `docs/content/copy-reference.md`,
  `copy-supplies.md` and `field-notes.md` — brought in by merging `origin/main`, already
  failing on that commit before this change touched anything, and outside this change's
  files. Not fixed here: out of scope for this change, follow-up noted in
  `DECISIONS.md`.
- Manual: `grep -o "<table" dist/specifications/index.html` → 9; every caption present;
  `grep -c "<script"` → 0 on all three built pages; grepped built `/about` HTML for the
  four banned strings → none found; ad hoc (uncommitted, deleted after) Playwright check
  at 320/375/400px on all three pages → 9/9 pass, no horizontal scroll even with each
  spec table's own internal scroll container.
- No hex literal added: confirmed with a direct grep across every file this change
  touches.

## Learn + Ship

- Learned → `.factory/DECISIONS.md`: this change's summary, and the frozen-file
  prettier follow-up.
- Commit: this commit.
- PR: not opened — not requested this session. Agents never merge.
