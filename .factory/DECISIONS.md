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

Prompts 1 and 2 (homepage build, products hub and the first three family pages) are
archived in `.factory/history/2026-09-15-prompts-1-2.md` — those decisions still hold.

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

## Propagation journey is a six-step grid, not a carousel (session 9)

- `src/components/home/JourneySteps.astro` replaces the `Carousel variant="grid"` on the home page
  journey section: all six steps are visible at once, three across (two at 620-899px, one below).
  The owner chose this over the three-at-a-time carousel, which hid half a numbered sequence
  behind autoplay. `Carousel.astro` is unchanged and still runs the hero and facilities sections.
- Step markers sit on the section ground under each photograph, joined by a hairline through the
  gutter that stops at each row edge -- it never crosses a photograph.
- Step copy stays exactly the six captions in `blueprint.md` Section 1; the component has no
  description line because no description copy exists in the source material.

## Accessibility fixes: duplicate honeypot id, reveal motion, terra panel contrast (session 9)

- The newsletter honeypot in `Footer.astro` and the quotation honeypot in `QuoteForm.astro` share
  the field NAME `companyWebsite` (both endpoints read it), but they were also sharing the DOM id,
  and the footer renders on `/contact` too. The footer's id is now `newsletter-companyWebsite`;
  names are untouched, so neither script nor endpoint changes.
- `[data-reveal]` now has a `prefers-reduced-motion: reduce` branch that skips the fade entirely.
  The axe suite runs with reduced motion so it measures settled colours, not a mid-transition frame.
- Outcome panel 02 put `--paper` on bare `--terra`: 4.24:1, under AA for its 15px copy. The panel
  ground is `color-mix(in srgb, var(--terra) 94%, var(--ink))` and the panel's numeral and
  paragraph no longer carry 0.85/0.92 opacity — text on these panels is at full strength. The
  `--terra` token itself is unchanged; it is an accent elsewhere.
- The keyboard-traversal test excluded `disabled` but not `tabindex="-1"`, so it expected the
  honeypot to be Tab-reachable. A field deliberately out of the tab order is not a control a
  keyboard user should reach.

## Propagation journey is one looping line, not a grid (2026-09-16)

The six steps sit on a single full-bleed row that translates continuously from
01 to 06 and starts over. A second, inert copy of the six follows the first, so
`translateX(-50%)` loops with no seam; every step carries a trailing margin
rather than the row using `gap`, which is what makes the two halves exactly
equal. The row pauses on hover and focus-within, and under
`prefers-reduced-motion: reduce` the clones are hidden and the six become a
plain scroll-snapped row — every step stays in the DOM, in order, either way.

The edges dissolve with `mask-image`, not a painted overlay. That needed the
`no-forbidden-ui` gate narrowed: it now fails a gradient in `background`,
`background-image`, `border-image`, `fill` or `stroke`, and lets one through in
`mask-image`, which is an alpha ramp rather than decoration. The CLAUDE.md ban
on gradients still means paint.

## Product family cards: white mount, rebalanced card copy (2026-09-16)

The seven cards carried the family's verbatim flyer intro. Those run 63 to 167
characters, so the grid was ragged and one card did most of the talking. Card
descriptors are now a separate 90-107 character line in families.ts, every fact
drawn from that family's own flyer copy already in blueprint.md - intro, key
products, specifications, packaging. Nothing new is asserted, and each family
page still opens with its own verbatim intro, unchanged. blueprint.md Section 2
carries the seven descriptors so the copy still has one source.

The card is a white mount with the photograph inset on --radius-m, not a beige
block with the photograph bled to its edge: the owner asked for less beige. The
flyer tagline moved up to a mono eyebrow with a terra dot, with two lines
reserved so every family name in a row sits on the same baseline; the CTA is
pinned to the card's bottom edge as a green label plus an outlined arrow that
fills on hover. The heading link stretches over the whole card, so there is one
link per card and it keeps the focus ring. Homepage teaser and /products/ share
the design; only the hub adds the key-products list. Filter pills went white to
match.
