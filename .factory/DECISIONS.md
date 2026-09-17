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

Prompts 3 to 6 (propagation systems, sanitation, monitoring and technical services
pages; the tools hub and both calculators; Field Notes; About and Contact with the
Firestore enquiry wiring) are archived in
`.factory/history/2026-09-14-prompts-3-6.md` — those decisions still hold.

Session 9's homepage/about UI iterations (journey loop taking its final one-line
form, product/facility card redesigns, trust panel, footer and About rebuilds) are
archived in `.factory/history/2026-09-16-session9-homepage-iterations.md` — several
of those entries describe an intermediate state superseded by a later entry below
(the journey card width, the footer sitemap control) rather than the shipped one.

Session 9's mobile nav/footer pass, the "Africa" positioning copy changes and
its "stock hubs" follow-up, the footer newsletter card stretch fix, and the
font-consistency audit (self-hosted Inter on the no-JS fallback page, form
controls inheriting it, /products/ card compaction) are archived in
`.factory/history/2026-09-16-session9-tail.md` — those decisions still hold.

Session 9's first-pass Tools hub card fix, the calculator pages' first
two-panel rebuild (since redesigned again — see below), the About team
photo revert/third-photo addition, and the Contact page's first no-beige
rebuild are archived in
`.factory/history/2026-09-16-tools-calculators-contact-first-pass.md` —
those decisions still hold except where a later entry here supersedes them.

## Journey loop captions: lighter and smaller (2026-09-16)

Owner call. `.caption` in `JourneySteps.astro` was 17px/600 weight, reading
heavier than the mono step numerals beside it; now 14px/400, tracking and
line-height adjusted to match.

## Trust panel list items: lighter and smaller (2026-09-16)

Owner call. `.trust-item` (the "Why partner with PropagAfrica" / "Who we
supply" list text, shared by Home and About) was 15.5px with no explicit
weight; now 14px/400 explicitly, so it can't inherit heavier from
elsewhere. Headings and eyebrows on the same panel are unchanged.

## Hero carousel: dots instead of arrows, Ken Burns motion (2026-09-16)

Owner call — the hero's overlay prev/next circles read as dated slideshow
chrome. Removed for the hero variant only (`Carousel.astro`'s grid variant
— facilities, journey — keeps its own rail arrows, a separate, already
above-the-photo control unaffected by this). Replaced with a `role="group"`
row of small dot buttons that jump straight to a slide on click; touch
swipe and the existing ArrowLeft/ArrowRight keyboard handling were already
wired to the whole carousel root, not the removed buttons, so both still
work unchanged.

First pass made each dot's clickable box the same 7px as its visible
circle — Lighthouse's `target-size` audit failed the home page (97, not 100) on that alone. Fixed by keeping each `<button>` at a full 24x24px hit
area with the small dot drawn via `::after`, centred inside — the touch
target is generous without the marker looking heavy. Re-ran Lighthouse
directly (not just the axe-core Playwright suite, which doesn't cover this
audit) to confirm 100 again before shipping.

Also added a continuous slow zoom-and-pan ("Ken Burns") on the hero's
active `<img>` — 9s, alternating direction by slide index (even/odd) so
five slides don't all drift identically — layered under `.frame`'s own
crossfade/scale entrance rather than replacing it. Hero only; the grid
variant already has its own hover-zoom for the same "alive photograph"
effect at thumbnail scale. Skipped entirely under
`prefers-reduced-motion: reduce`, same as every other motion in this file.

## Hero band height capped off the viewport, not the photo's aspect ratio (2026-09-17)

The hero's `.media` was a flat `aspect-ratio: 16/9` at full viewport width —
810px tall at a 1440px-wide laptop, near-100vh on a 13" MacBook (a forbidden
pattern per CLAUDE.md invariants) and leaving nothing else on screen at first
paint. From 641px up it's now `height: clamp(480px, 64vh, 640px)` with
`aspect-ratio: auto`; `.frame img`'s existing `object-fit: cover` absorbs
whatever crop results, so nothing else needed to change. Mobile
(`max-width: 640px`, its own `min-height: 560px` for copy overflow room)
untouched.

## `process-04.jpg` had a ~10px black vignette baked into the file (2026-09-17)

The homepage journey card's fourth photo showed black bars on both sides —
not a CSS/object-fit issue (the other five process photos, and `.shot img`'s
`object-fit: cover`, were already correct) but a ~10px black border baked
into that one source JPEG on all four edges. `object-fit: cover` on a 4:3
image in the loop's 3:2 card crops top/bottom to fill, which happened to
clear the top/bottom border but left the left/right border visible. Fixed
by cropping the border out with `sharp` (`extract` a 1174×880 region inset
10–13px per side to preserve the 4:3 ratio, then `resize` back to the
manifest's 1200×900) and overwriting the file in place — same path,
filename and dimensions, no code change.

## Tools hub card body text centred (2026-09-17)

Owner call from a screenshot. `.tool-body` (heading, descriptor, CTA) was
left-aligned text in a flex column; the CTA already read centred (full-width
button). Added `align-items: center; text-align: center` to `.tool-body` so
the heading and description centre to match.

## Both calculator pages redesigned again: elevated card, stat-grid results (2026-09-17)

Owner picked "Option A" from 3 screenshotted directions (a throwaway
`/tools/redesign-preview` route, deleted after — same pattern as the Tools
hub card pick, never shipped as a route). At ≥900px `.calculator` is now one
`--shadow-soft`-elevated white card (not two separately bordered panels)
with a single hairline `border-right` dividing form from results, rather
than a bordered box each; below 900px each panel keeps its own bordered
card as before. Field labels became a small mono uppercase caption
(10.5px) instead of 14px bold sentence case — the same weight/size move
already applied to the trust panel and journey captions this session.
Results moved from a stacked `dt`/`dd` row list to a 2-column stat-tile
grid (hairline-divided, `--white` tiles on a `--rule` background) — the
same facts in roughly half the vertical space, which combined with
`align-items: stretch` (the grid default) and the CTA's `margin-top: auto`
(the footer newsletter card's pinning technique) is what keeps the results
panel from ever reading taller or shorter than the form panel, whatever
the results panel actually has to show. Applied identically to both
`grafting-calculator.astro` and `consumables-planner.astro` — the
Consumables Planner's stat grid just renders fewer tiles when a toggle
zeroes an item out, rather than needing different markup.

`ToolIntro.astro`'s photo was capped at 560px wide and left a dead gap
beside it at desktop widths. Added a `howItWorks` prop — a short paragraph
per page explaining what the calculator does — rendered beside the photo
in a `flex-wrap` row (stacks below the photo under ~860px, where the two
no longer fit side by side). Used by both calculator pages; no other page
imports this component.

## Contact form pills, panel and Field Notes template: compacted (2026-09-17)

Owner call from screenshots, several small changes across one round:

- **QuoteForm's "Enquiring about" checkboxes**: the square checkbox next to
  each pill's text is now visually hidden (clip-rect, not `display: none`,
  so it stays in the tab order and keeps its own focus) rather than
  removed — the `<label>` itself is the whole clickable, checked-state
  pill (`:has(:checked)`/`:has(:focus-visible)` targeting the label, same
  as before). Same name/value pairs, same keyboard behaviour.
- Dropped the `WE USE WHAT YOU SEND HERE TO PREPARE A QUOTATION. NOTHING
ELSE.` line under the submit button — not a blueprint.md-locked line,
  read as legal boilerplate the redesign didn't need.
- Swapped this component's remaining `--ink-soft` (the superseded
  "Blueprint" token — see tokens.css) for the current `--soft` on the
  three rules that still had it, while already in the file for the above.
- **Contact panel** ("Talk to us directly"): the phone number and email
  were two lines of an `<address>` block; now two `.method-card` tiles —
  a mint icon badge (phone/envelope, inline SVG, `currentColor` stroke)
  plus a mono micro-label and the value, each the whole `<a>` target. The
  Nairobi/regional-hub lines stay as plain text below, not cards — those
  aren't contact methods.
- **About page**: removed the lead photo's visible `<figcaption>` (it
  just repeated the `alt` text as an all-caps mono line under the photo);
  the `alt` attribute itself is untouched.
- **Field Notes article template** (`[slug].astro`): was the one
  remaining page sitting on the body's `--paper` straight through header,
  cover photo and body copy — every other rebuilt page (About, Contact,
  Products, Tools) runs its content on `--white` and leaves `--paper` to
  the header/footer only. `.note` is `--white` now; the cover photo picked
  up `--radius-l` + `--shadow-soft` (the About lead-photo treatment); the
  CTA moved from a bare border-top rule to a `--mint` card, the one tinted
  ground the palette allows, same idea as the calculator results panels.
  Follow-up not done here: the Field Notes _hub_ (`index.astro`)'s cards
  still fill with `--paper`, the same leftover the Tools hub cards had
  before an earlier pass this session — only the inner article template
  was in scope this round.

## Sitewide mobile-centring pass, desktop untouched everywhere (2026-09-17)

Owner walked every page by screenshot, ending in "confirm all pages have
the same behaviour on mobile ... fix it now, I'm launching." Every fix
below is inside a `max-width` media query — never a bare/unscoped rule —
so desktop is provably unchanged; several were verified with side-by-side
mobile/desktop screenshots specifically because this was called out as a
hard constraint.

**The recurring bug, worth remembering**: `text-align: center` on an
ancestor only centres a block's own wrapped lines _within its own box_ —
it does not centre the box itself. Several headings (`.monitoring h2`,
family/hub page `h1`s, `.hero-standfirst`, etc.) cap their own width
narrower than their container via `max-width: <n>ch`, so a block with a
notably wide gap between it and the container edge needs `margin-left/
right: auto` too, or its text reads centred while the box itself sits
flush left with the lines staggered inside it. Where a component's own
`max-width` doesn't actually bind at mobile widths (wider in ch than the
mobile viewport), text-align alone was left to do the job rather than
adding an inert rule.

**Breakpoint choice**: the page's usual `max-width: 640px` mobile
breakpoint, _except_ where the section has its own desktop breakpoint
below that — `.monitoring-inner` and `.about-hero-inner`/`.approach-cols`
don't go 2-column until 900px, so centring them stopped at 640px would
have left a 641–899px gap (a landscape phone or small tablet) still
single-column but left-aligned; those three use `max-width: 899px`
instead, matching the point each section's own grid actually switches.

**What centred**: home's monitoring spotlight (copy + h2 + body, the
900px case above) and its stat labels; the Products/Tools/Field-Notes
hub intros (`eyebrow`/`h1`/`.hub-sub`, `.hub-inner > ` scoped so the
card grids beneath are untouched); `ToolIntro` (both calculator pages);
the About hero (900px case) and its "How we work" section (900px case,
text only — the 2-column split itself is untouched); the Contact hero,
its `QuoteForm` submit row (button + call line, `max-width: 560px` to
match `.quote-form`'s own single-column point) and its "Talk to us
directly" panel (heading + the plain location text only — the method
cards keep their icon-left, text-left row, the same "functional row
stays as it is" carve-out the newsletter form already had); the Field
Notes article header (title block only, not the body/CTA/related);
every product family page's `FamilyHero` and closing `FamilyCta`
(shared components, so all seven pages picked this up at once); and the
404 page's `PageHero`.

**What deliberately did not**: any data table, definition list or
numbered/lettered structural row (family-page spec tables, the
homepage's services index, the readings grid); the `Related` and 404
quick-links lists, left as plain link lists; a family page's deeper
"Choosing a size" sub-section (prose, only on 2 of 7 pages, not part of
the walk-through — a real but low-priority gap); the Field Notes hub's
own `--paper` card fill (unrelated to centring, still outstanding, see
the entry above).

**Three other fixes from the same walk-through**: (1) QuoteForm's phone
and email in the "Or call ..." line were plain text that Safari alone
auto-links (iOS-only, underlined, its own default styling) — now
deliberate `tel:`/`mailto:` anchors styled once (`.call-link`, no
underline by default, underline back on hover/focus) so the behaviour
and appearance are ours on every browser, not Safari's. (2) The
"Enquiring about" pills' `flex-wrap` sized each one to its own label, so
on a phone only "Grafting Tubes"/"Grafting Clips" ever shared a row —
seven options read as seven-ish stacked rows. `max-width: 640px` swaps
`fieldset` to a fixed 2-column grid there (desktop keeps flex-wrap), so
it's always a compact 4-row block regardless of label length. (3) The
first `TrustPanel` heading ("Why partner with PropagAfrica") wraps to 2
lines at mobile widths; added a `headingMobile` field ("Why Partner with
Us") swapped in purely by CSS under 640px, the same `.heading-full`/
`.heading-mobile` technique the homepage hero's full/short sub-head
already uses — not a reword, a shorter reading of the same heading for
the width it doesn't fit at.
