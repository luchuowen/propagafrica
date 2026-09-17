# Homepage/hero/Tools hub small polish (archived 2026-09-17)

Compacted out of `.factory/DECISIONS.md` to stay under its 250-line cap. These
decisions still hold.

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
circle — Lighthouse's `target-size` audit failed the home page (97, not
100) on that alone. Fixed by keeping each `<button>` at a full 24x24px hit
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
