# PropagAfrica — agent rules (factory v2.1)

## Build Workbook

This repo is being rebuilt via an 8-session Claude Code prompt sequence (Prompt 0
foundations through Prompt 7 QA). `blueprint.md` is the sole content source — no
session invents product facts or copy. Image paths follow `docs/image-manifest.md`
exactly; a placeholder there is replaced in place, same filename and extension.

## Commands

- verify quick: `bash scripts/factory-check.sh quick` · full: `bash scripts/factory-check.sh full`
- dev: `pnpm dev` · build: `pnpm build` · unit tests: `pnpm test:unit` · e2e: `pnpm test:e2e`

## Loop

1. `/change <slug>` sizes the work and opens `.factory/changes/…` (trivial = no artifact).
2. Critical paths (`.factory/manifest.json`) → plan mode, `/effort high`, domain reviewer.
3. Build. The Stop hook runs the quick gate; a red gate is a blocker, not a note.
4. `/verify` before claiming done; `/ship` to learn, commit, push, open the PR. Agents never merge.

## Working style

- Scope = the ask: pre-existing bugs and nearby cleanups go in the summary as follow-ups, not the diff.
- Tests sized like their neighbours; scratch checks are not new test files.
- Batch every read/search/command that does not depend on another's result into one response.
- Own the whole mission: the owner is usually not watching; never ask permission for work already
  requested; end the turn only when done or blocked on input only the owner has.

## Invariants without a mechanical check

- No founding date, company age, or "newly established" language anywhere on the site (gate: `no-founding-date`, but review copy meaning too — a rephrase can dodge the regex).
- `--terra` (the live accent orange) appears only as a small graphic detail — a dot, a thin rule, a callout leader — never a button fill, background, or large decorative block. Target under 5% of ink coverage per page. (`--signal`/`--signal-ink`, the superseded "Blueprint" orange, are still read by a handful of surviving components — PageHero's eyebrow, RuledRows, QuoteForm, admin — and carry the same ceiling.)
- Wordmark casing is fixed: "PropagAfrica" title case always, never all-caps; "TECHNOLOGIES" strap line in JetBrains Mono capitals below it. Two-tone: "Propag" and "Africa" each carry their own brand colour (`Wordmark.astro`) — never flatten it to one colour, never introduce a third.
- Forbidden permanently: gradients, backdrop-filter, icon+title+two-line feature triplets, fade-up-on-scroll, animated counters, marquee logo strips, chat bubbles, a 100vh hero. Radii and shadows are allowed but only via `--radius-*` / `--shadow-*`, never ad-hoc.
- Every page carries at least one photograph. A page of rules and tables with no image is the failure this rebuild corrected — the drawing-sheet border and per-page `DRAWING PA-000 / SHEET n OF 14` title blocks are gone and must not return.
- Mono type is for specification values, SKUs, pack sizes and small labels only. Never body copy, never an eyebrow — the sitewide `.eyebrow` utility (`global.css`) is Inter 700 uppercase, not mono. (`global.css` also applies `--f-mono` to any element classed `.spec` — do not reuse that class name for a layout band.)
- No prices anywhere on the site. Every commercial path ends in a quotation request.
- British spelling throughout; no adjective without a figure and unit behind it; a research result always carries its country.
- `blueprint.md` is the master reference for IA, copy rules and component inventory — read it before adding a page or component.

## Memory

- `.factory/DECISIONS.md` is current truth; read it before assuming something is unbuilt.
- `/ship` appends what was learned; `factory-check` fails when it exceeds its cap → compact.
- After `/compact`/resume the SessionStart hook names the rule files to re-read; skills re-load by name.
