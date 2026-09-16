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

## Facilities cards, monitoring readings and the dark-section button (2026-09-16)

The grid carousel's card was a beige slab holding 13.5px grey text, with the
prev/next arrows sitting on top of the first and last photographs. It is now
the same white mount the product grid uses: photograph inset on --radius-m,
caption on the card's own white in --ink at 15px, led by a mono NN / NN index
so the row reads as one numbered set. The arrows moved to a rail above the row,
right-aligned, and ride up beside the section heading from 900px; nothing
overlaps a photograph any more. A hairline progress rule under the row marks
position, and counts only the lanes actually on screen, since below 900px a
grid carousel shows one.

The monitoring readings dropped to 14px mono over a 10px label and the second
one reads "Average zone temp 24.6C" (blueprint.md Section 1 updated), so both
sit on one line; they never wrap mid-value, so the pair goes single-column
below 520px rather than pushing the longer figure off a 320px screen. The
section's CTA became .btn-on-dark - paper fill, --green-dark ink, the arrow
sliding on hover - because on --green-dark a green button disappears.

## Technical Services is a ruled index, not three boxes (2026-09-16)

The 3-up was three tinted cards about 310px tall holding one 17px label each -
roughly 85% empty - and the tints used --terra and --gold as full-card fills,
which the token contract reserves for dots and small graphic details. Neither
the flyer nor blueprint.md carries body copy per service, so the fix was a form
that suits a short label rather than a bigger box.

It is now a ruled index: hairline rows the width of the column, a mono numeral
in --green, the label at 19px, and an outlined arrow that fills green on hover
while the row indents. The trailing text link became the standard
.btn-primary, and .btn-arrow now slides on any button rather than only the one
on dark. The three accent colours survive where they belong - the tri-colour
bar under the hero and the outcome panels.

## Footer is brand, one sitemap, one action panel (2026-09-16)

Five columns of very unequal weight left the four short ones floating beside a
brand column twice their height, and the newsletter input truncated in a fifth
of the width. It is now three zones: the brand block (wordmark, blurb, phone,
email, socials), one sitemap column carrying all six NAV_ITEMS in header order,
and a white panel on the right holding both actions - the newsletter and
Request a Quotation - so the footer has one place to do something. "Nairobi,
Kenya" is gone at the owner's request.

The social icons were non-interactive spans because no account exists yet. They
are now real links to "#" with proper button feedback: they fill green on
hover, lift 2px, press in on :active and take a focus ring. "Accounts launching
soon." was removed with them.

## Trust panel is a dark/light pair (2026-09-16)

The two verbatim lists sat side by side at identical weight, reading as one
table split in half. "Why partner with PropagAfrica" (the blueprint heading -
the markup had drifted to "Why partner with Us") now carries the section on
--green-dark, and "Who we supply" answers on white. Both are numbered on a
fixed 2.25rem first column, so every row lines up with its opposite number, and
both panels carry a 1px border - transparent on the dark one - so their padding
boxes start on the same pixel. --mint-bright numerals on --green-dark measure
3.76:1, under AA at 11px, so they are mixed 70/30 towards --paper for 5.3:1.

## The journey loop shows three steps, not six (2026-09-16)

Six 190-230px cards on screen at once read as a wall of thumbnails. The step is
now clamp(260px, 31vw, 560px) with a --space-3 gutter, so roughly three are on
screen at any moment and each photograph has room; the caption went back up to
17px. The loop slowed to 72s to hold the same ~40px a second now that a full
pass covers more ground. Nothing else about the loop changed - still six steps
plus an inert clone half, still paused on hover and focus, still a scroll-
snapped row under prefers-reduced-motion.

## Both trust panels are dark; card chrome trimmed (2026-09-16)

The trust panel is two matching --green-dark panels rather than a dark/light
pair - the owner wanted "Who we supply" to read as the same object as "Why
partner with PropagAfrica", not its lighter counterpart.

The grid carousel's progress rule is gone. Eight segments with three lit said
nothing the per-card "NN / NN" index was not already saying, and with eight
slides advancing three at a time the lit group jumped rather than progressing,
so it read as a broken bar. The card index is now the whole position marker.

Product cards: no hover underline on the family name, no terra dot before the
tagline or the key-products list, and the card contents are centred. The dots
were the only place terra appeared on these cards, so it now shows only on the
tri-colour bar and the outcome panels.

## Journey photos load eagerly; carousels start at 01 (2026-09-16)

Steps 05 and 06 never loaded. They start outside the viewport and the loop
brings them in by CSS transform, which does not re-run the lazy-load
intersection check, so they arrived as flat --green-dark panels - the .shot
fallback fill - and read as black boxes. All six now load eagerly; the clone
half reuses the same URLs, so it costs six files, not twelve.

Carousel autoplay now waits for the carousel to be 25% on screen before it
starts, via IntersectionObserver, and falls back to starting immediately
where that is unavailable. It used to start at page load, so a carousel far
down the page had already advanced by the time it was scrolled to and opened
on, say, 04 / 08 - which the numbering made look like a bug.

The product cards no longer repeat the family tagline; the name, descriptor
and CTA carry the card. blueprint.md Section 2 updated to match. Each family
page still opens with its own verbatim tagline and intro.

## About page rebuilt; no contact block (2026-09-16)

The page was four paper-coloured bands of left-aligned prose closing on a
contact block that repeated the footer and the whole of /contact/ - a third
copy of the same four lines. It now runs white hero spread, ruled facts strip,
lead photograph at 21:9, a "How we work" prose band on --green-pale, the dark
trust pair, team photographs 2-up, then the CTA. Beige is left to the header
and footer.

The contact block is gone. The operating facts take its place as a numbered
strip: "Seven product families", "Stock held in Kenya and Ethiopia" and
"On-site, virtual and farm-based support" - each already stated in
blueprint.md, which is updated to match. All body copy is unchanged and
verbatim.

Watch for this: an <img> with width and height attributes has those mapped to
CSS presentational hints, and the used height then beats aspect-ratio. The
team photographs rendered 556x900 portrait until height: auto was added
alongside. The lead photograph never showed it because it already had one.
