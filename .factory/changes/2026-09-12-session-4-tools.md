# 2026-09-12 — session-4-tools

Size: standard (two self-contained components + their pure logic; no critical path touched)

## Intent

- Ask: build the sleeve selector and consumables planner as two self-contained, vanilla-TS Astro
  islands per the session 4 brief — pure/fully-tested logic modules, `client:visible`-equivalent
  hydration, no framework, no new dependencies. Not mounted on any page (session 8's job).
- User-visible outcome: none yet directly — these components aren't referenced by any route. Once
  session 8 mounts them, a visitor gets a sleeve-fit calculator (crop + measured stem → SKU, to-
  scale bore drawing, fit note) and a consumables planner (programme → quantities, with a
  quotation-prefill link and permanently printed assumptions).
- Out of scope: mounting either component on a page, the `/contact` form's prefill handling
  (session 6), any styling/copy beyond what the brief specifies.
- Known constraints: owned paths only (`src/components/tools/**`, `src/lib/tools/**`,
  `tests/tools/**`, plus the two documents below); `src/pages/**` off-limits; no new dependencies;
  Vitest must cover every branch of both pure modules including the named boundaries; a Playwright
  test must drive each tool by keyboard alone.

## Spec

- Behaviour: `selectSleeve(crop, stemDiameter)` in `sleeve.ts` returns the SKU/spec/fit-note for
  one of four crops; `planConsumables(inputs)` in `planner.ts` derives eight quantities from a
  grafts/cycles/tray programme, each with its working shown and its assumption printed. Both
  ship an SSR default state (no empty shell without JS) and a same-file `<script>` that re-renders
  the same DOM nodes on `change`/`input` once the tool scrolls into view.
- Files touched: see the diff — `src/lib/tools/{sleeve,sleeve-ui,planner,planner-ui,visible}.ts`,
  `src/components/tools/{SleeveSelector,ConsumablesPlanner}.astro`,
  `tests/tools/{sleeve,planner}.test.ts`, `tests/tools/{sleeve-selector,consumables-planner}.spec.ts`,
  `tests/tools/fixtures/{serve.mjs,sleeve-selector.html,consumables-planner.html}`,
  `.factory/decisions/session-4.md`, this file. Plus two small additive edits to shared config that
  no other session owns: `vitest.config.ts` (widened `include`) and `playwright.config.ts` (a
  second `webServer`/project so the tools' Playwright specs actually run) — see
  `.factory/decisions/session-4.md` for why these were necessary.
- Edge cases: rose stems below the first band (< 3.0 mm) clamp to `PRO-ROSE 35`; vegetable/
  cucurbit/tree bores clamp the stem into their single-SKU range for the gap calculation; fruit
  tree always shows the scion/rootstock note regardless of gap; the ±0.6 mm fit-note boundary is
  inclusive of the "target fit" bucket. All documented in `.factory/decisions/session-4.md`.
- Acceptance checks: `bash scripts/factory-check.sh full` green; Vitest covers every branch of
  `sleeve.ts`/`planner.ts` including the boundaries at 3.0, 3.9, 4.0, 7.9, 8.0 and 12.0 mm;
  Playwright drives both tools by keyboard alone (Tab into the crop/tray radio group, arrow keys
  to change selection, Tab to the range/number inputs, keyboard edits) against a static fixture
  harness; no hex literal anywhere in the session's files.

## Plan

1. Pure logic first: `sleeve.ts` (rose bands + single-SKU ranges + fit-note thresholds) and
   `planner.ts` (eight derived quantities + row/assumption text + the quotation query-string
   contract) → verify: Vitest, every branch including the six named boundaries.
2. DOM wiring (`sleeve-ui.ts`, `planner-ui.ts`) queries the SSR markup by id and re-renders in
   place; `visible.ts` gates the first call behind `IntersectionObserver` → verify: `astro check`
   (strict, `noUncheckedIndexedAccess` forced non-null assertions at every array-index access that
   is provably safe).
3. The two `.astro` components: SSR a real default state from the pure functions, native
   radio/range/number controls with visible labels and a manual `:focus-visible` outline (the
   native ring is hidden because the input itself is visually hidden behind its label) → verify:
   `eslint`, `prettier`, gate `no-hardcoded-tokens`/`no-forbidden-ui`.
4. Playwright harness: since Container API needs Vite (only reachable via a Vitest config, which
   gives no live browser) and `src/pages/` is off-limits, build `tests/tools/fixtures/serve.mjs`
   (Node core modules + the existing `typescript` devDependency) plus two static fixture pages →
   verify: manual `curl` of the transpiled `/lib/*.js` routes before wiring Playwright to them.
5. Two Playwright projects (`chromium` unchanged, new `tools` project) → verify: `playwright test`
   — all 6 pre-existing e2e tests plus 7 new keyboard-driven tests green.
6. `.factory/decisions/session-4.md` (query-param contract, gap-logic decisions, harness
   rationale) and this change record.

- Blast radius: `src/components/tools/**`, `src/lib/tools/**`, `tests/tools/**` (new), plus
  additive-only edits to `vitest.config.ts` and `playwright.config.ts`. No existing page, style
  token, or other component touched.

## Build

See the diff. Two pure, fully-branch-tested TS modules; two thin DOM-wiring modules; one shared
`onVisible` helper; two Astro components that are correct with JS disabled and progressively
enhanced with it; a from-scratch Playwright fixture harness (static HTML + a tiny on-the-fly TS→JS
transpile server) so the components are keyboard-tested for real, in a real browser, without
touching `src/pages/`.

## Verify + Review

- `bash scripts/factory-check.sh full` → **GREEN**: gates (`no-hardcoded-tokens`,
  `no-founding-date`, `no-banned-words`, `no-forbidden-ui`) pass; caps pass; `astro check` 0
  errors; `eslint .` clean; `prettier --check .` clean; `vitest run` 45/45 (covers rose bands at
  every named boundary, the three fit-note branches at their ±0.6 mm edges, all four crops' bore
  clamping, and every `planConsumables`/`plannerRows`/`buildQuotationQuery` branch); `astro build`
  13 pages (unchanged — neither tool is mounted); `playwright test` 13/13 (6 pre-existing e2e + 7
  new: both tools' default-state rendering, full keyboard traversal of the crop/tray radio groups
  with live re-render assertions, range-input keyboard adjustment, number-input keyboard editing).
- Manual re-grep for hex literals across every file this session touched (including the fixture
  HTML, which the `no-hardcoded-tokens` gate doesn't scan since it isn't under `src/`): none —
  fixture CSS uses named colours (`black`/`white`/`lightgray`/`dimgray`/`seagreen`) instead.
- No domain reviewer run — no critical path (`src/pages/contact.astro`, `functions/**`, etc.) was
  touched.

## Learn + Ship

- Learned → `.factory/decisions/session-4.md`: the query-parameter contract for session 6/8, three
  gap-logic decisions the brief left implicit, and why the Playwright harness is a static fixture
  server rather than a mounted page.
- Commit: this commit.
- PR: not opened — not requested this session; agents never merge.
