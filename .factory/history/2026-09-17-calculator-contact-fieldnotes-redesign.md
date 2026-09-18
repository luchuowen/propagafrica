# Calculator redesign, Contact/Field Notes compaction (archived 2026-09-18)

Compacted out of `.factory/DECISIONS.md` to stay under its 250-line cap. These
decisions still hold.

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
