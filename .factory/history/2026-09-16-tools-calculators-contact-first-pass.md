# Tools hub, calculator and Contact first-pass rebuilds (archived 2026-09-17)

Compacted out of `.factory/DECISIONS.md` to stay under its 250-line cap. These
decisions still hold as history, except where a later entry in DECISIONS.md
says otherwise (the calculator two-panel layout below was redesigned again —
see "Both calculator pages redesigned again: elevated card, stat-grid
results").

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
