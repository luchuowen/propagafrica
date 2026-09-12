# 2026-09-12 — visual-rebuild

Size: critical

## Intent

- Ask: the deployed site "looks like a user manual for an electronic equipment." Rebuild the
  visual layer completely, keep the content.
- User-visible outcome: a photography-led website. Twenty pages, fourteen photographs, no
  drawing-sheet furniture anywhere.
- Out of scope: positioning, copy, the specification data, the two tools, the Field Notes. All
  of that was right and is untouched.
- Known constraints: no real client photography exists. Images generated with Nano Banana Pro.

## Spec

- Behaviour: every page opens on a photograph; mono type appears only in specification values,
  SKUs, eyebrows and small labels; the sheet border and per-page title blocks are gone.
- Files touched: `src/styles/tokens.css`, `src/layouts/BaseLayout.astro`,
  new `src/components/PageHero.astro`, `src/pages/index.astro`, `src/components/home/*`,
  all eleven content pages, `src/pages/field-notes/[slug].astro`, `src/pages/404.astro`,
  `src/pages/admin/index.astro`, `src/assets/images/*` (14 new), `.factory/manifest.json`,
  `CLAUDE.md`, `tests/unit/contrast.test.ts`.
- Deleted: `SheetFrame.astro`, `TitleBlock.astro`, `supplies/StageHeader.astro`, and the four
  superseded home-page section components.
- Edge cases: a page with no photograph falls back to a hairline rule under the heading, which
  is what `/404` uses.
- Acceptance checks: `factory-check full` green including axe on all nineteen public routes,
  the contrast test extended to the new tinted ground, and Lighthouse thresholds held.

## Plan

1. Generate and capture the image set. ✓
2. Extend the tokens; relax the two gates that encoded the old aesthetic. ✓
3. Rebuild the home page around photography. ✓
4. Replace every page header with `PageHero`. ✓
5. Delete the dead components. ✓
6. Re-run the full gate, fix what it catches. ✓

- Blast radius: every page. Mitigated by the existing axe/contrast/layout/metadata suite, which
  caught both regressions before they shipped.

## Build

See `.factory/DECISIONS.md` → "Visual rebuild". Two regressions were caught by the gates rather
than by eye: `--green-pale` at its first value put two tokens at 4.47:1 (under AA), and a layout
band classed `.spec` inherited `--f-mono` from a global rule and rendered its body copy in
monospace.

## Verify + Review

- `bash scripts/factory-check.sh full`: green.
- Lighthouse mobile: accessibility 100 on all four audited routes; performance 99–100 (the two
  99s are the new hero images, comfortably above the 95 threshold).
- Reviewed live at 1280px across the home page and six inner pages.

## Learn + Ship

- A design direction picked from one sample is not a design system. Build two or three full
  pages in it — including the dullest one — before committing the whole site.
- A missing image set is a launch blocker, not a to-do. Shipping "around" it produced a site
  with no product, people or place in it.
- Gates encode an aesthetic. When the aesthetic is deliberately replaced, the gates must be
  rewritten in the same change, not worked around.
- Commit: visual rebuild.
- PR: agents never merge.
