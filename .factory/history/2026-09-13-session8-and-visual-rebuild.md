# Session 8 — integration

Superseded by the Direction C restart (see `.factory/DECISIONS.md`), which deleted every
pre-restart page this section describes (`/supplies/*`, `/how-grafting-works`,
`/specifications`, `/ordering`). Kept for reference only.

## Branch mapping

Sessions 2–7 ran as cloud sessions on harness-assigned branch names. The mapping,
established from `git diff --stat main...origin/<branch>`:

| Session | Branch                          | Scope                                                                                       |
| ------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| 2       | `claude/vibrant-gauss-st1orq`   | Home page                                                                                   |
| 3       | `claude/lucid-sagan-9f6d6y`     | Supplies stage pages                                                                        |
| 4       | `claude/nice-hypatia-rgq275`    | Sleeve selector, consumables planner                                                        |
| 5       | `claude/laughing-hopper-ne2aig` | How grafting works, Field Notes                                                             |
| 6       | `claude/practical-tesla-m1pila` | Quotation form, Firestore, Cloud Functions                                                  |
| 7       | —                                | **Never delivered.** `/specifications`, `/ordering` and `/about` were written in session 8. |

Merged in the planned order (home, supplies, tools, words, reference, quotation).
Zero conflicts — the disjoint-ownership rule held.

## Specification tables now have one source of truth

`src/data/products/tables.ts` was the registry: one descriptor per table carrying its
id, stage, caption, columns and rows, so a table couldn't say one thing in one place and
another elsewhere. Superseded — the tables and the pages that read them are deleted.

## The planner → quotation query contract

Session 4 emitted a `pt_*` parameter namespace. Nothing read it: session 6's prefill
reader is generic over `QUOTATION_FIELDS` and looks for parameters named after the
form's own fields. `buildQuotationQuery` emits `annualVolume` and `notes`, both real form
fields, truncated to the field's own `maxLength`. This contract still applies to the
current tools.

## Two real bugs the mount surfaced

- **Horizontal scroll at 320 px** on a `fieldset`-based tool layout: `min-width: 0` on the
  fieldset and its flex ancestors fixed it. Worth re-checking on any new fieldset layout.
- **`--signal` orange fails WCAG AA as text**: 3.89:1 on white. `--signal-ink` (`#c1471b`,
  5.02:1) carries any `--signal` used as text. `tests/unit/contrast.test.ts` checks this.

## SEO, metadata and icons — still applies

- `site` is `https://propag.navac.co.ke`, set once in `astro.config.mjs`.
- `@astrojs/sitemap` generates `sitemap-index.xml` at build, filtering `/admin`.
- `src/components/Seo.astro` emits canonical, Open Graph, Twitter card and optional
  JSON-LD, wired through `BaseLayout`.
- `src/lib/seo.ts` builds `Organization` (home) and `Article` (each Field Note) JSON-LD —
  no founding date, headcount, rating or publication date, none stated in client material.
- Favicon, apple-touch-icon and PWA icons are generated from the Mark, single colour.

## Gates added this session — still apply

`wordmark-case`, `no-placeholder-copy`, `no-prices`, widened `no-founding-date` and
`no-banned-words`, `no-forbidden-ui` border-radius check. `factory-check full` runs
`scripts/lighthouse.mjs` against Performance ≥95, Accessibility 100, Best Practices ≥95,
SEO ≥95.

## Session 7, on `claude/jolly-lamport-fmnpd9` — not merged

Delivered late and duplicated the specification-table data layer session 8 had already
built. Its testing idea was generalised instead: `tests/e2e/site.spec.ts` greps the
**rendered text** of every route against the banned-phrase list rather than the source.

## Cloud project and domain — provisioned, still applies

- Firebase / GCP project: **`propagafrica`**. Gemini in Firebase and Google Analytics both
  declined at creation.
- Firestore: `(default)`, Standard edition, Native mode, `eur3` (Belgium/Netherlands),
  production mode — location is permanent, cannot be moved.
- Hosting site `propagafrica` → `propagafrica.web.app`. Custom domain
  `propag.navac.co.ke` added, DNS CNAME at HOSTAFRICA already pointed.
- **Spark (no-cost) plan.** Hosting and Firestore work on Spark; Cloud Functions 2nd gen
  does not — `firebase deploy` fails on the `functions` target until upgraded to Blaze.
  Deploy hosting alone with `firebase deploy --only hosting` until then.

---

# Visual rebuild — the blueprint treatment was wrong at site scale

Superseded by the Direction C restart, but the lesson is worth keeping for any future
direction change.

The owner's reaction to the deployed "Blueprint" site: "it looks like a user manual for
an electronic equipment." **What went wrong**: he chose "Blueprint" from a single hero
sample, and that choice of _direction_ was turned into the _format_ of all twenty pages —
sheet border, registration marks, a drawing-number title block on every page, mono type
well beyond spec tables. A precision motif used once is a signature; used everywhere it
becomes documentation. **The compounding error**: the image brief for that direction said
"no people, no premises, no branded packaging," and the twelve photographs were never
generated before the site shipped — twenty pages selling physical goods with no picture
of a product, a person or a place. A missing image set is a launch blocker, not a to-do.

**The lesson worth keeping.** A design direction picked from one sample is not a design
system. The next time a direction is chosen from a hero, build two or three full pages in
it — including the dullest one — before committing the site.
