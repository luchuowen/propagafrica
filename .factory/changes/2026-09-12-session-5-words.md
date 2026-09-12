# 2026-09-12 — session-5-words

Size: standard (page + five-article content build; no critical path touched)

## Intent

- Ask: Session 5 of the factory build — "Words". Build `/how-grafting-works` from the final copy
  in `docs/content/copy-reference.md`, and the Field Notes: split `docs/content/field-notes.md`
  into five article files, build the index and article template, and draw two of the five figures
  the articles reference.
- User-visible outcome: `/how-grafting-works` renders the final copy in the site's drawing-sheet
  style; `/field-notes` lists all five articles as ruled rows in source order; each
  `/field-notes/[slug]` renders its article in a measured column with a mono header block, its
  figure where session 5 owns it, and prev/next links.
- Out of scope: rewriting any article prose, adding or removing articles, author names or
  publication dates, the three figures owned by session 3/session 8, anything outside the paths
  this session owns.
- Known constraints: copy is final (place it, don't author it); no new dependencies; owned paths
  only (`src/pages/how-grafting-works.astro`, `src/pages/field-notes/**`,
  `src/data/field-notes/**`, `src/assets/figures/words/**`, `.factory/decisions/session-5.md`,
  this file) — everything else frozen, including `TitleBlock.astro`.

## Spec

- Behaviour: `/how-grafting-works` — eyebrow, H1, standfirst, title block, then the six copy
  sections (what grafting is, why roses differ, the four-week timeline, what "take" means, a
  linked list of the five supply stages, grafted vegetables). `/field-notes` — ruled index rows
  (mono category, title, standfirst, reading time), ordered as in the source file.
  `/field-notes/[slug]` — mono header block (category, reading time) via `TitleBlock`, the article
  body rendered from markdown (hairline rule above each H2, 68ch measure, tables in a mono
  `overflow-x: auto` container), the two owned figures inlined where their slug matches, and
  prev/next links at the foot.
- Files touched: see diff — `src/pages/how-grafting-works.astro`,
  `src/pages/field-notes/index.astro`, `src/pages/field-notes/[slug].astro`,
  `src/data/field-notes/*.md` (five articles) + `order.ts`,
  `src/assets/figures/words/{graft-union-stages,bore-fit}.svg`, `tests/unit/field-notes.test.ts`
  (see `.factory/decisions/session-5.md` for why this one file sits outside the listed paths),
  this change file and the session decisions file.
- Edge cases: the three not-yet-drawn figures (`traceability-chain`, `dilution`, `cell-section`)
  render nothing and carry a `TODO(session-8)` marker rather than a broken image or a reference
  into session 3's folder; the first and last articles in source order get a prev/next link back
  to `/field-notes` instead of a missing neighbour.
- Acceptance checks: `bash scripts/factory-check.sh full` green; zero JS shipped on every article
  page (static markdown + inlined SVG, no client script); no horizontal scroll at 320/375/400px;
  every article's front matter renders (title, standfirst, category, reading time); a Vitest test
  asserts exactly five articles with unique slugs; Lighthouse Accessibility 100 on one article
  page.

## Plan

1. Fast-forward the branch onto `origin/main` to pick up the copy decks that hadn't landed here
   yet → verify: `git log` shows the docs commit, `docs/content/copy-reference.md` and
   `field-notes.md` present.
2. Read `blueprint.md`, the copy-reference `/how-grafting-works` section, and all five
   `field-notes.md` articles in full → verify: nothing paraphrased, exact text captured.
3. Split `field-notes.md` into five files under `src/data/field-notes/`, diffed programmatically
   against the source to confirm zero prose drift → verify: Python diff of extracted source body
   vs. each written file, byte-for-byte identical.
4. Build `/how-grafting-works` → verify: `astro check`, visual read-through against the copy deck.
5. Build the Field Notes index and article template, wire `import.meta.glob` for the markdown
   data, add `order.ts` for a single source of truth on article order → verify: `astro build`
   produces all five article routes plus the index.
6. Draw the two owned SVG figures inline (hex literals, not CSS vars, since `.svg` isn't inlined
   through `tokens.css`) → verify: visual read of the built HTML, `no-hardcoded-tokens` gate
   (scoped to `.astro`/`.css`/`.ts`, doesn't apply to `.svg`) still green.
7. Add `tests/unit/field-notes.test.ts` → verify: `vitest run` passes (5 articles, unique slugs).
8. Run `factory-check full`, fix format/typecheck issues in owned files only → verify: green,
   confirmed the four remaining format warnings pre-exist on `main` and aren't in owned paths.
9. Lighthouse Accessibility check on one article page.
- Blast radius: the six owned paths only; no shared component, token, or another session's file
  touched.

## Build

Five Field Notes articles split verbatim from `docs/content/field-notes.md` into
`src/data/field-notes/*.md`, each front-matter block preserved and the body unchanged except that
the source's own `# Title` line is dropped in favour of the page's real `<h1>` (see decisions doc).
`order.ts` holds the canonical article order. `/field-notes/index.astro` renders it as ruled rows.
`/field-notes/[slug].astro` loads the matching markdown module via `import.meta.glob`, renders its
compiled `<Content />` inside a 68ch measured column with hairline rules above H2s and a mono/
`overflow-x: auto` table treatment, a `TitleBlock`-based mono header (category + reading time), the
two owned figures inlined by raw SVG import where the frontmatter names them, a `TODO(session-8)`
marker for the other three, and prev/next links built from `order.ts`. `/how-grafting-works.astro`
carries the final copy from `copy-reference.md` verbatim inside the drawing-sheet page structure.
`graft-union-stages.svg` and `bore-fit.svg` hand-drawn as inline technical diagrams per the brief's
panel descriptions, using the brand's literal hex values.

## Verify + Review

- `bash scripts/factory-check.sh full` output: gates, typecheck, lint, format (owned files clean;
  four pre-existing warnings on unowned `docs/content/*.md` + `.factory/DECISIONS.md`, confirmed
  present on `main` before this session's changes), unit tests (7 passed, including the new
  five-articles/unique-slugs test), build (all 18 routes including the five article pages), e2e —
  all green.
- Reviewer findings and fixes: n/a this pass.
- Domain reviewer (critical only): n/a — no critical path touched.

## Learn + Ship

- 0–3 bullets → `.factory/DECISIONS.md`: see `.factory/decisions/session-5.md` for the session's
  own decision log (branch, source-doc, TitleBlock-mapping and figure-ownership notes); nothing
  added to the shared `DECISIONS.md` cap this session, per the paths this session owns.
- Commit: this diff.
- PR: not opened — agents never merge.
