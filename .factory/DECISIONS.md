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

## Tools hub cards: no beige, solid CTA button (2026-09-16)

Owner picked from 3 screenshotted options (a throwaway preview page, deleted
after — never a route). `.tool-card` was the one card on the site still on
`--paper`; it's `--white` now, matching every other card. The trailing
"Open calculator →" text link is a full-width `.tool-cta` button (green
fill, `--radius-s`, the arrow nudges right on hover like `.btn`'s elsewhere)
rather than a link, pinned to the same bottom edge on both cards regardless
of description length.

## Both calculator pages rebuilt: two-panel layout, no beige (2026-09-16)

Owner call — full redesign, not a restyle. Both `/tools/grafting-calculator/`
and `/tools/consumables-planner/` were a single beige (`--paper`) column:
image, a plain vertical form with `--paper`-filled inputs, a rule, then a
plain two-column definition list of results. Now: `.tool-page` is `--white`
like the hub; the form sits in a white bordered `.form-panel`; the live
answer sits beside it in a `--mint`-tinted `.results-panel` (sticky at
≥900px, stacks below the form under that) so the panel that changes as you
type reads as a distinct, tinted object rather than more of the same form.
Inputs/selects moved from `--paper` to `--white` fill, matching QuoteForm's
already-established convention. Result rows became stat blocks — a small
mono uppercase label over a large bold value — instead of a plain
label/value row, and the CTA is the same full-width `.btn-primary` pattern
as the Tools hub cards.

Consumables Planner's three yes/no facts (potting-on, humidity domes,
staked) were three separate "No / Yes" `<select>`s; they're checkboxes now
(`accent-color: var(--green)`), read at a glance in one `.toggle-group`
instead of opened one at a time. `isYes()` reads `.checked` instead of
`.value === 'yes'` — the calculation logic itself is untouched. All locked
copy (disclaimer, hints, packaging note) is unchanged, same show/hide
behaviour per field as before.

## About team photos reverted to their pre-rebuild size (2026-09-16)

Owner call. The About rebuild (session 9) widened `.photo-grid` from
`repeat(3, 1fr)` to `repeat(2, 1fr)` and `--radius-s` to `--radius-l` for
the two team photographs — with only two photos, that read as too large.
Reverted both to the pre-rebuild values; nothing else on the page changed.

A third team photo (`team-03.jpg`) now fills the grid's third cell —
reused from `/products/technical-services/01.jpg` (a technician walking a
customer through a controller on site), a real, already-vetted brand photo
rather than a generated one. Added to `docs/image-manifest.md` alongside
the other two.

## Contact page rebuilt: no beige, compact paired-field form (2026-09-16)

Owner call ("1/10"), reviewed against a screenshotted mockup first. The
whole page was the one place still using `--paper` as a card fill —
`.contact-hero`, `.contact-form-card` and `.contact-panel` are all
`--white` now (radius bumped `--radius-m` → `--radius-l` to match).

`QuoteForm.astro`'s seven fields were one full-width column; `.quote-form`
is now a 2-column grid, with Country/Enquiring-about/Message forced to
`grid-column: 1 / -1` via their existing `[data-field]` attribute — Name
pairs with Company, Email with Phone, entirely through CSS (the field
list, order and the render loop are untouched). The seven-option
"Enquiring about" checkbox list was one option per line; the `<fieldset>`
now wraps as chips (still plain checkboxes — same name/value pairs, same
keyboard behaviour), highlighted via `:has(:checked)` rather than a script
change. Textarea trimmed 5 rows → 4. No copy changed.

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
