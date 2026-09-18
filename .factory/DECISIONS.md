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

Journey loop caption weight, trust panel list text weight, the hero
carousel's dots-instead-of-arrows + Ken Burns motion (and the target-size
Lighthouse fix that came with it), the hero band's viewport-relative
height cap, the `process-04.jpg` vignette crop, and the Tools hub card
text centring are archived in
`.factory/history/2026-09-17-homepage-hero-tools-hub-polish.md` — those
decisions still hold.

Both calculator pages' redesign (elevated card, stat-grid results,
`ToolIntro`'s `howItWorks` prop) and the same round's Contact form
pills/panel, About photo caption removal and Field Notes template
rebuild are archived in
`.factory/history/2026-09-17-calculator-contact-fieldnotes-redesign.md` —
those decisions still hold.

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

## Footer brand blurb missed the nested-max-width fix; newsletter collapses like sitemap (2026-09-17)

Owner caught one the walk-through above missed: `.footer-company .blurb`
(the brand paragraph) still read left-anchored on mobile. Same bug as
`.monitoring h2` etc. — `.blurb`'s own `max-width: 34ch` is narrower than
the column at mobile widths, so `.footer-company`'s `text-align: center`
only centred the wrapped lines inside that still-flush-left box.
`.footer-company .blurb` now gets `margin-left/right: auto` too. Re-swept
every other `max-width: <n>ch` rule this session touched or added to
confirm none had the same gap (several are already paired correctly,
some don't bind at mobile widths at all, and the services-index ones are
deliberately left structural/uncentred — see the entry above).

Also: the newsletter card (email form) now collapses behind a
`Newsletter` toggle on mobile, exactly like the sitemap column already
does — same button-not-`<details>` reasoning (Chromium drops a closed
`<details>`'s content from the Tab order even when forced to paint), same
`aria-expanded`/chevron-rotate pattern, same ≤720px breakpoint, reusing
`.sitemap-chevron`. Only the blurb + form collapse (`#newsletter-body`);
the "Ready to order? / Request a Quotation" CTA below stays always
visible — it's the primary conversion path, not newsletter content.

## Pre-launch audit: home page performance 75 → 88, real bugs fixed (2026-09-18)

Owner asked for a pre-launch bug/performance sweep. Branch cleanup first
(15 stale branches deleted via the owner's own `gh`/`git`, GitHub default
branch moved to `main` — done outside this repo's tooling, no code change).

Root-caused the home page's long-standing Lighthouse performance gap
(75, others 97–100) rather than re-filing it as sandbox noise: `Carousel.astro`'s
hero variant stacks every slide at `inset:0` inside the above-the-fold
`.media` box. `loading="lazy"` on the other four slides did nothing —
native lazy-load only checks an element's geometry against the viewport,
never its opacity, and every frame sits in the viewport from first paint.
All five full-size hero photos downloaded together, starving the actual
LCP image of bandwidth. Fixed by giving every non-first hero frame
`data-src`/`data-srcset` instead of the real attributes, so the preload
scanner can't discover them; the carousel script hydrates them after
`window.load` (or immediately on the first user interaction, so a fast
manual jump never shows blank). Grid-variant carousels (journey, facility)
are genuinely below the fold and untouched.

Two more real bugs found the same way: the monitoring dashboard image
was an unsized 1600×1000, 849KB PNG in a ~370–550px slot — resized to
1100×688 and palette-compressed to 243KB, `width`/`height` added. The
homepage product-family grid reused each family's full-size page-hero
photo (up to 1000×750) as a small card thumbnail with no responsive
source at all — `generate-image-variants.mjs` now also generates a
WebP + 640w pair for every family's `hero.*`, same as the carousel
photos; the grid's `<img>` became a `<picture>` using the small variant.
Also merged all per-page CSS chunks into one file (`vite.build.cssCodeSplit:
false`) — Astro/Vite had been splitting a component shared by Home and
About (TrustPanel) into its own tiny chunk, costing every page that uses
it a second render-blocking request.

**Residual gap, not fixed**: Lighthouse still reports performance 88 on
`/` (needs 95) against the local `astro preview` server under this
sandbox's simulated slow-4G + 4×-CPU profile — its own trace shows a
single real LCP candidate at ~140ms; the simulator's per-request latency
model (562ms) against a hand-rolled multi-image homepage accounts for
most of the rest. Outbound network to the live Firebase-hosted site
(global CDN, HTTP/2, Brotli) is blocked from this container, so the real
production score couldn't be checked directly — likely meaningfully
better than this local-server figure. Every other gate, `astro check`,
eslint, prettier, all 111 e2e/unit tests and accessibility=100/
best-practices=100/seo=100 on all four audited routes are green.
