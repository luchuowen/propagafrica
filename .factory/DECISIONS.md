# Decisions — current facts and lessons

Loaded via `CLAUDE.md`. Cap: 250 lines. Compact into `.factory/history/` when close to the cap.

Sessions 1–7 build decisions (stack, fonts, toolchain) are archived in
`.factory/history/2026-09-12-sessions-1-7.md` and still apply. Session 8 integration and
the pre-restart "Blueprint" visual-rebuild lessons are archived in
`.factory/history/2026-09-13-session8-and-visual-rebuild.md` — superseded by Direction C
below, but the provisioned Firebase project/domain facts there still apply. Prompt 0's
foundations-restart session (Direction C palette/logo/type/nav lock, the pre-restart
pages it deleted) is archived in
`.factory/history/2026-09-14-prompt0-foundations-restart.md` — its decisions still hold,
Prompts 1–5 below have since rebuilt everything it left mid-restart.

# Session 2026-09-14 — Prompt 1: homepage

Rebuilt `src/pages/index.astro` from scratch against `blueprint.md` Section 1 (Direction
C) and `docs/image-manifest.md`: sticky header, hero carousel (5 slides), 3 outcome
panels, Propagation Journey carousel (6 slides), a 7-family product grid with a
client-side shop-by-crop filter, Facilities-in-use carousel (8 slides), a dark Monitoring
spotlight, a Technical Services 3-up, trust/target-markets panels, and a CTA band.
`SupplyStages.astro` and `FieldNotesTeaser.astro` are no longer mounted on the home page
(pre-restart, tied to the deleted `/supplies` routes and old copy) — left in place,
unreferenced, not deleted.

## Carousel.astro got two small, generic fixes, not homepage-specific

- Added `fetchpriority="high"` to the hero variant's first slide only (`loading="eager"`
  was already conditional; `fetchpriority` was missing). Home page LCP scores 99 on
  Lighthouse mobile with this in place.
- The dot controls were an 8×8px hit target — axe/Lighthouse `target-size` failure (needs
  24×24px, WCAG 2.5.8). Fixed by making the `<button>` itself 24×24 with a smaller
  8×8px `::after` as the visible dot, so the dot row still reads as small marks. This
  applies to every carousel, not just the homepage's three.

## The homepage carries one H1/sub-head/CTA overlay, not one per slide

`blueprint.md` says the H1/sub-head is "overlaid on slide 1 only" but the copy is
singular — there's one hero headline, not five. `Carousel.astro` has no slot for
per-slide extra content (by design: "do not put homepage-specific content... in this
file"), so the hero copy is a separate absolutely-positioned layer on top of the whole
carousel section, visible from first paint (when slide 1 is showing) rather than
disappearing on slide 2+. Reuses the existing `--ink-overlay-strong` token for the scrim
rather than adding a new one to the protected `tokens.css`.

## Product card image links were dropped, not made `aria-hidden`

Each family card originally wrapped its image in its own link to the product page,
duplicating the title link right below it. `aria-hidden="true" tabindex="-1"` satisfies
axe (no unnamed link in the accessibility tree) but breaks
`tests/e2e/site.spec.ts`'s keyboard-traversal count, which selects `a[href]` without
checking `tabindex` — so it still counts the element as "expected reachable" while Tab
correctly skips it. Simplest fix that satisfies both: the image is a plain `<div>`, not a
link; the card's `<h3>` title and "View range" link already cover the same href.

## `tests/e2e/home.spec.ts` still asserted the pre-restart H1

`H1 matches the specified hero copy exactly` checked the deleted "Propagation supplies
for nurseries and flower farms." string. Updated to the Direction C H1 from
`blueprint.md` Section 1.

## Shop-by-crop tagging for the product grid

`blueprint.md` Section 1 and Section 2 give slightly different summaries of which
families carry which crop tags; Section 2's is the explicit one ("systems, sanitation,
monitoring and services tagged 'Nursery and facility supplies'"). Grafting Tubes and
Grafting Clips carry the three crop-specific tags (Roses and ornamentals / Vegetables and
cucurbits / Fruit trees); the other five families carry "Nursery and facility supplies"
only. An "All" pill was added for usability — not in the copy deck, a UI affordance only.

## Session checked out a stale branch at start

The session's working tree started 8 commits behind `origin/main` — pre-Prompt-0, with
no `Carousel.astro`, no `docs/image-manifest.md`, and `blueprint.md` still describing the
deleted pre-restart "supplies" IA. `git fetch && git merge --ff-only origin/main` (the
tree was clean, so this was a pure fast-forward, not a reset) brought it current before
any of the above was possible.

# Session 2026-09-14 — Prompt 2: products hub, grafting tubes, grafting clips,

# nursery consumables

`src/data/products/families.ts` is now the single source of truth for the seven
product families (name, verbatim tagline, verbatim intro/descriptor, crop tags,
hero image, first-4 "key bullets"). The homepage's product grid (Prompt 1) and the
new `/products/` hub both import it, so a family's name or tagline can't drift
between the two pages that list it. The shop-by-crop filter script is likewise
shared (`src/lib/product-filter.ts`) rather than duplicated per page.

Three family pages built against `blueprint.md` Sections 3-5:
`/products/grafting-tubes/`, `/products/grafting-clips/`, `/products/nursery-consumables/`.
The other four families link from the hub/homepage to their eventual path
(`/products/propagation-systems/` etc.) — not yet built, expected 404s until a later
prompt. Shared components in `src/components/products/`: `FamilyHero`, `BulletList`,
`LabelValueList`, `DetailStrip`, `FamilyCta`. No single monolithic "family layout" —
the three pages' middle sections genuinely differ in shape (a real spec table for
tubes' PRO-ROSE/VEG/CUC/TREE range, a label/value list for clips' specs, plain bullet
lists for consumables) so each page assembles the shared primitives itself rather
than one component branching on family type.

"First 4 key-product bullets" on the hub (blueprint.md Section 2) isn't a single
named list for every family — only nursery-consumables/sanitation/monitoring/
technical-services have an explicit "Key products"/"Key features"/"Our Services"
list. For grafting-tubes and grafting-clips, the nearest verbatim equivalent is used
instead: tubes' Product range codes, clips' Types.

**Same grid/overflow bug as the session-4 fieldset one, new element.** The
grafting-tubes product-range table sits in a `min-width: 34em` scroll container
inside a CSS grid (`.family-body`); the grid item's automatic min-width ignored the
table's own `overflow-x: auto` and blew out the page at 320px until the item itself
got `min-width: 0`. Same root cause as the `/supplies/graft` fieldset bug (session 8
integration, archived), different element — worth checking any new wide/scrollable
content dropped into a grid or flex layout.

Prettier's format gate is content-blind and flagged a pre-existing table-alignment
whitespace issue in `.factory/history/2026-09-13-session8-and-visual-rebuild.md`
(from the Prompt 0 merge) unrelated to this session's diff. Reformatted it
(whitespace only, no text changed) since a red gate blocks `factory-check full`
regardless of which session's diff it belongs to.

# Session 2026-09-14 — Prompt 3: propagation systems, sanitation, monitoring,

# technical services pages

Built the remaining four family pages against `blueprint.md` Sections 6-9, same
bespoke-per-page pattern as Prompt 2 (no monolithic family layout): each page
imports the same five shared components (`FamilyHero`, `BulletList`,
`LabelValueList`, `DetailStrip`, `FamilyCta`) but assembles its own middle
section. `/products/` hub and `families.ts` already pointed at these paths from
Prompt 2, so no data-layer change was needed — the hub's "not yet built" header
comment was just stale and is corrected.

- **Sanitation packaging** (5L/20L/200L/1,000L IBC) is the one verbatim list the
  brief asked to render as mono spec data rather than prose — a page-local
  `.pack-sizes` chip row using the existing `.mono` utility class, not a new
  shared component (four numbers don't warrant one, and `LabelValueList`'s
  label/value shape doesn't fit a flat list of sizes).
- **Monitoring's two "Example reading" stats + dashboard.png** reuse the exact
  markup and copy (including the `&deg;C` entity) from the homepage's Monitoring
  spotlight (Prompt 1) instead of the blueprint's literal "24.6C", so the figure
  doesn't render two different ways on two pages.
- **Propagation Systems** has no planning-tool CTA (unlike tubes/clips/
  consumables) — blueprint.md Section 6 names none, so `FamilyCta` is used
  without `toolText`/`toolHref`, quotation button only. Same for Monitoring and
  Technical Services.
- Added the four new routes to `tests/e2e/site.spec.ts`'s `ROUTES` (axe,
  overflow, metadata and banned-phrase coverage) — no new route-specific tests
  needed since these pages follow the established family-page shape already
  covered by that suite.

# Session 2026-09-14 — Prompt 4: tools hub, grafting calculator, consumables

# planner

Built `/tools/`, `/tools/grafting-calculator/` and `/tools/consumables-planner/`
against blueprint.md Section 10 and the Build Workbook's Calculator Logic
(crop groups, PRO-ROSE/VEG/CUC/TREE + clip mapping, tray/pot/label/dome/tie
ratios). Pure math lives in `src/lib/tools/grafting-calculator.ts` and
`consumables-planner.ts` (unit tested in `tests/unit/tools-calculators.test.ts`);
`src/data/tools.ts` holds the two tools' name/description/image once, shared by
the hub cards and each calculator page's own heading. `ToolIntro.astro` is the
shared (non-full-bleed) header+photo shape for the two calculator pages.

**Found, not touched: orphaned pre-restart tools code.** `src/lib/tools/sleeve.ts`,
`planner.ts` (+ `-ui.ts`/`visible.ts` helpers), `src/components/tools/
SleeveSelector.astro` and `ConsumablesPlanner.astro`, plus their tests
(`tests/tools/*.test.ts`, `*.spec.ts` against a fixture harness on port 4322 —
see `playwright.config.ts`) already existed from a session-4/8 "Blueprint"
build and were never mounted at any route. They implement a different model
(continuous stem-diameter slider with fit-note/gap maths, no clip calculator,
old crop names, old tray options, the old quotation query-param contract) and
are superseded by blueprint.md Section 10 — the spec this session builds to.
Left in place per the "don't delete what wasn't asked for" precedent (see
Prompt 0's `StageNav.astro` note above); their tests still pass since they
exercise the orphaned components directly, not the new `/tools/` pages. A
follow-up session should delete this dead code and its fixture harness/second
Playwright project once nothing depends on it.

**Calculator → quotation handoff.** blueprint.md Section 13 (not yet built)
wants a hidden-field JSON prefill; this session can only produce the link, so
`src/lib/tools/handoff.ts` documents the contract: a single `?prefill=`
query param, JSON-encoded, `source: 'grafting-calculator' | 'consumables-planner'`
plus that tool's fields. The Prompt 6 session reads it from there.

**No-JS fallback uses `<noscript>`, not a hidden div toggled by class.** Since
this site has no server to compute against, a no-JS visitor must never see the
form at all (the maths simply cannot run) — `.calculator` carries a plain
`hidden` attribute in the markup and the enhancement script clears it; the
`<noscript>` block is the only thing a no-JS browser renders. Simpler than
tracking a "JS is running" flag both ways.

# Session 2026-09-14 — Prompt 5: Field Notes hub and 5 articles

Full replacement, not an addition: the five pre-restart articles under
`src/data/field-notes/` (`how-a-graft-knits-together` and its four siblings —
different topics, different voice, written before Direction C) are deleted,
along with the now-dead `FieldNotesTeaser.astro` (unmounted since Prompt 1,
its `category`/`readingMinutes` fields no longer exist on the new frontmatter
shape). `order.ts` and `articles.ts` now carry only the five
`blueprint.md` Section 11 slugs; `articles.ts`'s frontmatter shape dropped to
`slug`/`title`/`dek`/`cover` — the old copy deck's `category`, `readingMinutes`
and `figure` aren't given anywhere in the Direction C blueprint, so they
weren't invented for the new articles. `Figure.astro` and its per-article SVGs
are now unreferenced (left in place, same as `StageNav.astro` after Prompt 0 —
not asked for). The hub (`/field-notes/`) is now a card grid (cover, title,
dek, read link) rather than the old text-row list, matching the
`/products/` hub's card pattern; each article page adds a cover image, a
"Request a Quotation" CTA and 1-2 related-article links (next two slugs in
`order.ts`, wrapping — always one of the other four new articles).
`docs/content/field-notes.md` (the old prose source) is left as-is, same as
`docs/content/copy-supplies.md` was left after its pages were deleted in
Prompt 0 — these are archival, not part of the built site.

# Session 2026-09-14 — Prompt 6: About and Contact pages, Firestore enquiry wiring

Full replacement of both pages' pre-restart copy and layout, against
`blueprint.md` Sections 12-13. `TrustPanel.astro` + `src/data/trust.ts`
extract the homepage's Why-Partner/Target-Markets panel so About reuses it
verbatim instead of retyping; `index.astro` now imports it too.

**Backend plumbing kept, schema reshaped.** A working `submitQuotation`
Cloud Function (2nd gen), Firestore write, rate limiting, honeypot and Resend
email alert already existed (pre-restart, built for a "crop/stage/annual
volume/delivery point/notes" field set blueprint.md Section 13 no longer
matches). Per the brief, the transport was kept; only the field contract
changed — `crop`+`stage` became one `enquiringAbout` multi-select (the seven
product families) and `annualVolume`+`deliveryPoint`+`notes` collapsed to one
`message`, mirrored by hand in both schema.ts copies as before. Added
`calculatorContext`, a hidden, unvalidated field for a future tool's raw JSON
handoff (blueprint's "hidden field carries a JSON prefill"). `/admin` and
`functions/src/admin.ts` now list `enquiringAbout` instead of the dropped
crop/stage columns.

The one existing calculator (`ConsumablesPlanner`, pre-restart, not mounted
anywhere yet — `/tools/` is a later prompt) linked to `/contact` with its own
`annualVolume`/`notes` params; retargeted to the current `enquiringAbout`/
`message` fields so QuoteForm's generic per-field prefill reads it with no
special-casing.

Contact has no manifest-assigned photograph of its own; reuses
`about/nairobi-hub.jpg` in the direct-contact panel rather than adding a new
image path, since the panel is literally about the Nairobi hub.

`tests/e2e/site.spec.ts`'s founding-date check banned bare "established",
which blueprint.md Section 12's own verbatim copy trips ("established
manufacturers" — third parties, not PropagAfrica's age). Scoped to match the
manifest gate's own precision (a year, or "newly established"/"trading
since") instead of the bare word.
