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

## Mobile nav, hero copy and footer pass (2026-09-16)

Header below 720px: a hamburger button + collapsible panel (vanilla script,
no framework), wordmark centred via a 3-column `40px 1fr 40px` grid so the
logo sits on the true centre rather than the space left of the toggle.

Homepage hero sub-head is blueprint.md-locked copy — kept verbatim for
desktop as `.hero-sub-full`; a `.hero-sub-short` condensed line (not a
reword, a shorter reading of the same sentence) swaps in below 640px by
CSS only, so the full copy still ships to every viewport.

Below 640px, prose blocks across the homepage (section heads, outcome
panels, filter pills, the monitoring spotlight, the services intro) are
centred. Structural grids that would break if centred — the services
index's numbered rows, the readings' two-column grid — were left alone.

Footer: the sitemap column started as a `<details>` disclosure, then was
replaced with a `<button aria-expanded>` + `display: none` list — Chromium
excludes closed `<details>` content from Tab order regardless of a
`display` override (43 of 49 keyboard-reachable elements, not 49 — the
missing six were the sitemap links; `<details>` can't fix that, a
genuinely hidden/shown list can). Baseline row
(copyright / strapline / credit) stacks and centres below 640px instead of
wrapping ragged.

Branch note: `claude/epic-bell-w123i8` had been cut from a stale, pre-rebuild
commit (`083281d`, the same one `claude/eloquent-euler-cc6v7j` — this repo's
misconfigured GitHub default branch — still points at). All of the above was
done after resetting it onto `origin/main` (tip `8a8217a`, includes the
`claude/og-card` work), which is what the live site actually runs.

## Positioning broadened to "Africa"; operational facts untouched (2026-09-16)

Owner call: reframe market-facing copy (hero, About, Products/Field Notes
hub subs, meta) from "Kenya and Ethiopia" to "across Africa" — but leave
every operational fact as Kenya and Ethiopia (stock, Nairobi HQ/hub, the
contact form's Country field, JSON-LD `areaServed`, facility captions).
The homepage "Facilities in use" heading also stays Kenya/Ethiopia — every
photo under it is captioned to one of those two, so broadening it would
overclaim what the carousel shows.

## "Stock held in Kenya and Ethiopia" read as a limit, not a hub (2026-09-16)

Owner feedback on the above: pairing "growers across Africa" with "stock
held in Kenya and Ethiopia" in the same sentence read as the two countries
being the actual service boundary. Every instance (hero, About lede/facts/
meta, Products sub/meta, Footer blurb, Contact panel, blueprint.md) is now
"regional stock hubs in Kenya and Ethiopia" — same fact, phrased as hubs
that supply the continent rather than a limit on it. The About lede and
Footer blurb also gained "across Africa", which they'd been missing
outright. The facilities heading is still deliberately untouched (see above
— it's about physical locations, not service reach).

Hero H1/sub-head read cramped (three lines for a two-line-worthy title,
narrow sub) at desktop widths: `.hero-copy-inner`'s `min-width: 820px` cap
went 640px → 760px, h1 `max-width` 20ch → 27ch, `.hero-sub` 52ch → 60ch.
Mobile (`.hero-sub-short`) untouched. The journey loop's card
(`JourneySteps.astro`) was `clamp(260px, 31vw, 560px)` — visibly larger
than the product grid it sits above; now `clamp(220px, 25vw, 360px)`, which
lands within a few px of a product card's own ~357px at content-max. The
`sizes` attr on its `<picture>` was updated to match, so it doesn't fetch a
wider image than it now displays.

## Footer newsletter card stretched to match the brand column (2026-09-16)

The action panel (Newsletter + Request a Quotation) is grid-aligned with
`align-items: start`, so it only ever stood as tall as its own content —
ending well short of the brand column's social icons. `.footer-actions` now
`align-self: stretch`es at the 960px 3-column breakpoint, and
`.action-panel` is a `height: 100%` flex column with the CTA half
(`.action-bottom`) pinned by `margin-top: auto`, so any extra height opens
as one gap there instead of stranding content or padding the card's foot.
The card also gained `box-shadow: var(--shadow-soft)` — the one shared
shadow token, not an ad-hoc value — so it reads as a raised object against
the beige footer rather than a flat bordered box.

## Font consistency audit; product cards compacted (2026-09-16)

Owner call, checked against a reference file: the brand type is Inter
throughout (this design direction's token comment already says so — "no
serif anywhere" — so no second typeface was introduced). Two real gaps
found and fixed rather than a cosmetic pass:

- `functions/src/render.ts` (the no-JS form-submission fallback page — a
  real destination, not a dead end) hard-coded
  `-apple-system, system-ui, sans-serif` instead of the site's Inter, so a
  visitor who lands there after a JS failure saw different type from every
  other page. It now ships the same self-hosted `@font-face` at `/fonts/`.
- `button, input, select, textarea` don't inherit the page font by default
  (Chromium gives them their own UI font stack) — most already set
  `font-family` themselves, but the admin sign-in form's input and button
  didn't, and silently fell back to the OS font. Added a global reset in
  `global.css` so any control that doesn't set its own family inherits Inter
  by default, closing this off for good rather than patching one form.

Separately: the /products/ hub's cards were the tallest thing on the page —
`key-bullets` stacked one fact per line (up to four rows) under a
`text-align: center` descriptor. It's now one wrapped mono spec line
(`f.keyBullets.join(' · ')`) instead of a `<ul>`, and `.product-body`'s
padding/margins were trimmed (space-3 → space-2 in three places), cutting
card height by roughly a third with the same facts still visible.

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
