# 2026-09-15 — propagation-journey

Size: standard (home page section; no critical path touched)

## Intent

- Ask: redesign the "propagation journey" cards shown in a screenshot the owner supplied, to a
  premium standard, and show the chosen design before implementing. Owner picked design B
  (elapsed-time rail) from three mockups.
- User-visible outcome: the home page gains a propagation sequence section — five stages read left
  to right, each with a photograph slot, a stage title, a one-line description and a key figure,
  with one orange dimension rail carrying elapsed days under the photographs.
- Out of scope: the supplies sub-pages the stages link to (still stubs), photography (none
  supplied), the sleeve selector and consumables planner.
- Known constraints: the supplied screenshot's style — rounded corners, drop shadows, pastel card
  fills, a three-at-a-time carousel — is on the blueprint's permanently forbidden list, so it was
  not reproduced. Six-token colour system, no JS on the home page, WCAG 2.1 AA, no horizontal
  scroll at 320/375/400px.

## Spec

- Behaviour: `StageRail.astro` renders a `<ol>` of five stages from `src/lib/stages.ts`. Every
  stage is visible at once at every width (five across ≥1024px, three across 620–1023px, one below
  620px) — no carousel, no hidden stages, no JS. The dimension rail is drawn per stage and joins
  across the 18px gutter, stopping flush at each row edge. `--signal` appears only on the rail,
  its ticks and the day labels.
- Files touched: `src/lib/stages.ts` (new), `src/components/StageRail.astro` (new),
  `src/pages/index.astro`, `tests/unit/stages.test.ts` (new), `tests/e2e/home.spec.ts`,
  `blueprint.md`, `.factory/DECISIONS.md`.
- Edge cases: no photograph supplied yet → the plate renders a labelled grey placeholder with crop
  ticks; an empty stage list → `railSpan` returns an em dash rather than throwing.
- Acceptance checks: `factory-check full` green; five stages visible at 320/375/400/1280px; stage
  figures each carry a unit.

## Plan

- Steps: typed stage model + unit test → component → wire into home → e2e → verify with a built
  screenshot at three widths.
- Blast radius: home page only; no shared component or token changed.

## Build

- Summary: new `StageRail` section on `/`, stage content in a typed module, five stages always
  visible, dimension rail as the only signal ink.

## Verify + Review

- `bash scripts/factory-check.sh full` output: GREEN — gates, typecheck, lint, format, 8 unit
  tests, build, 7 e2e tests (including no horizontal scroll at 320/375/400/1280px and all five
  stages visible).
- Reviewer findings and fixes: the unit test caught stage 05 carrying no figure ('TAKE RATE LOGGED
  PER TRAY'); changed to '1 RECORD SHEET PER TRAY' so every stage meets the figure+unit copy rule.
- Domain reviewer (critical only): n/a

## Learn + Ship

- 0–3 bullets → `.factory/DECISIONS.md`: stage copy and figures live in `src/lib/stages.ts` and are
  placeholders pending confirmation; the supplied screenshot's card style is forbidden by the
  blueprint and was replaced rather than matched.
- Commit: see branch `claude/upbeat-bardeen-fhjhvr`.
- PR: not requested
