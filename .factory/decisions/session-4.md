# Session 4 — Tools: decisions

Session-specific log, per the session prompt. Read alongside `.factory/DECISIONS.md`.

## Scope built

- `src/lib/tools/sleeve.ts` + `sleeve-ui.ts` + `src/components/tools/SleeveSelector.astro`.
- `src/lib/tools/planner.ts` + `planner-ui.ts` + `src/components/tools/ConsumablesPlanner.astro`.
- `src/lib/tools/visible.ts` — a tiny `onVisible(el, cb)` IntersectionObserver helper shared by
  both islands, standing in for a `client:visible` directive (which only applies to UI-framework
  components in Astro, not the vanilla-TS components this brief specifies).
- Both components are self-contained: the frontmatter computes a real default state at build time
  (rose, 4.5 mm stem; 120 000 grafts × 4 cycles, 128-cell tray) so the SSR markup alone is a
  complete, correct render — no JS required for a sensible first paint. The `<script>` at the
  bottom only re-renders specific text nodes/attributes in place once the tool scrolls into view.
- Neither component is mounted on any page — session 8 owns that. `src/pages/**` was not touched.

## Query-parameter contract — ConsumablesPlanner → /contact

`buildQuotationQuery()` in `src/lib/tools/planner.ts` builds `/contact?...` for the "Send this to
a quotation" link. The parameter names are `QUOTATION_QUERY_PARAMS` in that file and are load-
bearing for session 6 (the quotation form must read them to prefill) and session 8 (mounting):

| Param          | Meaning                           | Format           |
| -------------- | --------------------------------- | ---------------- |
| `pt_grafts`    | grafts per cycle (raw input)      | integer          |
| `pt_cycles`    | cycles per year (raw input)       | integer          |
| `pt_tray`      | tray cell count (104/128/200/288) | integer          |
| `pt_total`     | total grafts/year                 | integer          |
| `pt_sleeves`   | sleeves needed                    | integer, rounded |
| `pt_trays`     | trays needed                      | integer          |
| `pt_media`     | media litres                      | decimal, 1 dp    |
| `pt_thermal`   | thermal sleeves                   | integer          |
| `pt_cards`     | batch cards                       | integer          |
| `pt_logbooks`  | logbooks                          | integer          |
| `pt_sanitiser` | sanitiser litres                  | decimal, 1 dp    |

The `pt_` prefix avoids colliding with any other query params `/contact` may grow. Do not rename
any of these without updating session 6's prefill and this table together.

## Sleeve-fit gap logic — decisions not fully pinned down by the brief

- **Stems below the first rose band (< 3.0 mm):** the brief only specifies rose bands from 3.0 mm
  up, but the shared stem range starts at 1.4 mm. Below 3.0 mm, `selectSleeve('rose', …)` clamps to
  `PRO-ROSE 35` (the smallest band) rather than returning nothing — never an empty/undefined
  result for any value in the control's own range.
- **Vegetable/cucurbit/fruit-tree "bore":** these SKUs are specified as a single bore _range_
  (e.g. PRO-VEG 1.5–2.5), not banded by stem like rose. The representative bore used for the gap
  calculation and the to-scale SVG is the stem diameter clamped into that range — i.e. if the stem
  sits inside the range the fit is exact (gap 0), and outside it the gap is measured against the
  nearest edge of the range. The displayed "Bore" spec row shows the full range (e.g. "1.5–2.5 mm"),
  not the clamped value.
- **Fruit tree fit note:** always the scion/rootstock note from the brief, regardless of the
  computed gap — the single-measurement gap logic doesn't apply to PRO-TREE.
- **Fit-note boundary:** "below −0.6 mm" / "above +0.6 mm" are read as strict inequalities, so a
  gap of exactly ±0.6 mm falls into the "target fit" bucket (tested explicitly).

## Playwright harness — why a static fixture instead of a page

The brief forbids editing anything under `src/pages/` (session 8 owns mounting), but Astro has no
file-based route outside `src/pages/`, and the Container API (`astro/container`) can only import
`.astro` files through Vite's transform pipeline (verified: a plain Node `import` of a `.astro`
file throws `ERR_UNKNOWN_FILE_EXTENSION`; the pipeline is normally reached via `getViteConfig()` in
a Vitest config, which gives real rendered HTML but not a live browser for keyboard testing).

So `tests/tools/fixtures/` holds a small, dependency-free harness instead:

- `sleeve-selector.html` / `consumables-planner.html` — static markup that mirrors each real
  component's ids/structure (kept in sync by hand; this is the one place these components'
  structure is duplicated, and only the skeleton, not the interactive logic).
- `serve.mjs` — a ~70-line Node core-modules-only HTTP server. It serves the fixture HTML as-is,
  and transpiles `src/lib/tools/*.ts` to plain ES modules on request via the project's existing
  `typescript` devDependency (`ts.transpileModule`), rewriting bare relative specifiers
  (`from './sleeve'`) to the served `.js` sibling. No bundler, no new dependency, nothing checked
  in as build output.
- `playwright.config.ts` gained a second `webServer` entry (`node tests/tools/fixtures/serve.mjs`
  on port 4322) and a second project (`tools`, `testDir: tests/tools`, `testMatch: **/*.spec.ts`),
  alongside the existing `chromium` project (now scoped to `testDir: tests/e2e` explicitly) so
  `pnpm exec playwright test` still runs both without change. `vitest.config.ts`'s `include` was
  widened to also pick up `tests/tools/**/*.test.ts`. Both are small, additive edits to shared
  config outside this session's owned paths, made because the deliverable is otherwise
  unverifiable — no other session owns either file.
- The real components' actual interactive code (`sleeve-ui.ts`, `planner-ui.ts`, `visible.ts`, and
  the pure `sleeve.ts`/`planner.ts`) is transpiled and served unmodified — the fixture only
  supplies the DOM skeleton, so the Playwright tests exercise the real logic, just not the real
  Astro-rendered markup byte-for-byte.

## No new dependencies

Only the already-installed `astro` and `typescript` devDependency were used (the latter via its
`transpileModule` API in the test harness). `package.json` was not touched.
