# 2026-09-12 — foundation

Size: standard (new-project skeleton; no critical path touched yet — `/contact` is a stub)

## Intent

- Ask: run the Software Factory Playbook v2.1 §7 (Mode B, new project) for PropagAfrica, skipping
  the interview stage — the spec was supplied complete in the session prompt. Build the foundation
  only: stack, factory, brand tokens, shell components, all 14 routes stubbed (home hero built),
  `factory-check.sh full` green. No page content beyond the shell.
- User-visible outcome: a working Astro site — header, footer, sheet-frame chrome and the exact
  home hero copy, in the specified brand — with every nav link resolving to a real page.
- Out of scope: all page content beyond the home hero, the sleeve selector, the consumables
  planner, Firebase/Firestore/Cloud Functions wiring, Field Notes articles, favicon/OG image.
- Known constraints: Astro 5 pinned (not 7, the default resolve), hand-written CSS only, self-
  hosted fonts (no CDN), zero JS on the home page, WCAG 2.1 AA, no horizontal scroll at 320/375/
  400px, six-token colour system enforced by a grep gate.

## Spec

- Behaviour: `/` renders the sheet frame + header + hero (eyebrow, H1, subhead, two buttons) +
  footer. The other 13 routes render the same shell with a title block and a "built later" note —
  none 404. Nav order/wording and footer columns match §4/§8 of the brief exactly.
- Files touched: full new-project tree — see the diff.
- Edge cases: `/field-notes/[slug]` has no articles yet, so `getStaticPaths` returns `[]`;
  nothing on the site links to a slug yet, so nothing 404s.
- Acceptance checks: `bash scripts/factory-check.sh full` green (gates, typecheck, lint, format,
  unit tests, build, e2e); Playwright asserts no horizontal scroll at 320/375/400/1280px, the H1
  text matches the brief exactly, and the wordmark renders "PropagAfrica" in title case.

## Plan

1. Scaffold Astro 5 + TS strict + pnpm + Node 22 → verify: `astro build` on the default template.
2. Design tokens (`tokens.css`) + self-hosted fonts (`global.css`, `public/fonts/`) → verify: no
   hex/font-family literal outside `tokens.css` (gate).
3. Components (Mark, Wordmark, SheetFrame, TitleBlock, Figure, Header, Footer, BaseLayout) →
   verify: `astro check` clean, ESLint clean.
4. Home page hero with the exact §5 copy; 13 stub routes → verify: `astro build` produces all 14
   pages, manual grep of nav hrefs against built output.
5. Vitest unit test for `src/lib/nav.ts`; Playwright E2E for viewport/H1/wordmark → verify: both
   suites pass locally with the pre-installed Chromium (pinned `executablePath`, see
   `DECISIONS.md`).
6. Factory install: `.factory/manifest.json`, `DECISIONS.md`, `changes/TEMPLATE.md`,
   `.claude/settings.json`, three hooks, two agents, `scripts/factory-check.sh`, `CLAUDE.md`,
   `blueprint.md` → verify: `factory-check.sh full` green; each hook fired manually with synthetic
   tool-call JSON.

- Blast radius: entire repo (new project, no prior history).

## Build

New Astro 5 project. Design tokens in `src/styles/tokens.css` (six colours, two font families,
spacing scale). Self-hosted Inter Variable + JetBrains Mono (400/500/700) in `public/fonts/`,
sourced from the `@fontsource-*` npm packages and then removed as dependencies once the `.woff2`
files were copied out (Google Fonts is unreachable from this environment — see `DECISIONS.md`).
Seven components + `BaseLayout.astro` implementing the "Blueprint" engineering-drawing system
(sheet frame, registration marks, title block, figure convention). Home page hero built verbatim
to the brief; 13 other routes stubbed. `src/lib/nav.ts` holds the typed nav model so it's unit-
testable without a browser. Full factory install per §2/§7 of the playbook.

## Verify + Review

- `bash scripts/factory-check.sh full` → **GREEN**: gates (no-hardcoded-tokens, no-founding-date,
  no-banned-words, no-forbidden-ui) pass; caps (`CLAUDE.md` 37/80, `DECISIONS.md` 56/250) pass;
  `astro check` 0 errors; `eslint .` clean; `prettier --check .` clean; `vitest run` 3/3; `astro
build` 14 pages; `playwright test` 6/6.
- Contrast check (WCAG 2.1 AA) computed by hand for every text/background pairing against
  `--paper`: `--ink` 18.9:1, `--ink-soft` 5.03:1, white-on-`--green` button 8.05:1 — all pass.
  `--signal` on `--paper` is 3.89:1, which fails AA for normal text, so `Figure.astro`'s figure
  label was changed to colour the label text `--ink-soft` and carry a small `--signal` square
  (decorative, `aria-hidden`) instead of colouring the text itself — signal now only ever
  appears as a non-text mark (registration squares, the figure tick), never as text colour.
  Re-ran `factory-check full` after the fix: still GREEN.
- Hooks fired manually with synthetic PreToolUse JSON: `guard.sh` blocks an `Edit` on
  `src/components/Mark.astro` (protected) and allows one on `src/pages/index.astro`.
- Reviewer agent (`reviewer.md`) not run as a separate pass in this session — the fixes above were
  found and applied inline before commit; this is the initial skeleton with no prior diff to
  review against.

## Learn + Ship

- Learned → `.factory/DECISIONS.md`: Astro version pin, font-sourcing workaround, Playwright
  browser pin, nav-as-typed-module, session-1 scope boundary (all already written there).
- Commit: this commit.
- PR: not opened — not requested this session.
