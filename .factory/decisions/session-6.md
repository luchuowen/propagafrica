# Session 6 — quotation and backend

Covers the collection schema, the function name/region, every environment variable, and the
judgment calls this session had to make. Companion to `.factory/changes/2026-09-12-session-6-quotation.md`
(the fuller build/verify record) — this file is the reference doc; that one is the narrative.

## Firestore

- Database: default Firestore database, **eur3** multi-region (set at project/database creation —
  `firebase.json` doesn't configure this; it's a one-time `firebase firestore:databases:create` or
  console step at deploy time, not something this session can wire up without a real project).
- Collection `quotationRequests`. Document fields:
  `name, farmOrCompany, email, phone, country, crop, stage (string[]), annualVolume, deliveryPoint,
  notes` (the form fields, per `docs/content/copy-reference.md`) plus `createdAt` (server
  timestamp), `status` (`new | read | quoted | closed`, default `new`), `source` (`"web"`), and
  `userAgentHash` (SHA-256 of the request's User-Agent header — never the raw string). No IP
  address field exists on the document at all; the raw IP is only ever hashed transiently to key
  the rate limiter (see below) and never stored or logged.
- Collection `rateLimits`, keyed by `sha256(ip + ':' + RATE_LIMIT_HASH_SALT)`: `{ count, windowStart }`,
  a fixed one-hour window, 5 requests/window (both numbers are fixed policy in
  `functions/src/schema.ts`, not environment configuration).
- `firestore.rules`: deny all reads and writes on both collections, plus a default-deny catch-all
  for anything added later without an explicit rule. No exceptions — the website never talks to
  Firestore directly; only the Cloud Functions' Admin SDK does, which bypasses rules entirely.
- `firestore.indexes.json` is empty: the only query is `quotationRequests` ordered by `createdAt`,
  which Firestore auto-indexes as a single-field index.
- Rules unit test written at `functions/test/rules.test.ts` (unauthenticated read/write denied,
  authenticated-but-unprivileged read denied, `rateLimits` denied, default-deny, plus a sanity
  check with rules disabled) — **not executed in this sandbox**. `firebase emulators:start` needs
  to fetch the Firestore emulator binary from `firebase-public.firebaseio.com`, and this
  environment's egress policy rejects that host (confirmed via the agent-proxy's status endpoint:
  a `connect_rejected` on exactly that host, immediately after the emulator command hung). Run it
  in CI or a normal dev machine before shipping.

## Cloud Functions

- Package: `functions/` — a standalone deployable unit with its own `package.json`/`tsconfig.json`/
  `node_modules` (installed with **npm**, not pnpm: the repo has a `pnpm-workspace.yaml` at the
  root with no `packages:` list, so `pnpm install` run inside `functions/` silently treats it as
  the phantom workspace root and installs nothing — npm avoids that entirely, and Firebase's own
  tooling defaults to npm for functions anyway).
- Runtime: Node 22, Cloud Functions **2nd gen**, region **europe-west1** (inside the eur3
  multi-region footprint, so the function runs next to the data).
- `submitQuotation` (`onRequest`): checks the honeypot/timestamp (see below), validates and
  length-caps every field server-side (never trusts the client), rate-limits by the hashed
  identifier, writes the document, best-effort emails a notification (a failure there is logged
  and swallowed — it must never lose an already-saved request), and responds either JSON
  (`Accept`/`Content-Type: application/json`, the fetch-enhanced path) or a small self-contained
  HTML page (the plain-POST, no-JS path — see `functions/src/render.ts`).
- `listQuotations` (`onCall`): requires a signed-in Firebase Auth user; an authenticated user whose
  email isn't in `ALLOWED_ADMIN_EMAILS` gets `{ requests: [] }`, the same shape as a real empty
  result — allow-list membership is never observable from the response. Reads `quotationRequests`
  ordered by `createdAt desc`, limit 200.
- Anti-automation: a filled honeypot (`companyWebsite`) always rejects. A `renderedAt` timestamp
  under 2 seconds old rejects as automated. A **missing** timestamp does not reject — it means the
  request came in with JavaScript disabled (the only way `renderedAt` gets set is a client script),
  and the form is required to work in that case, so there's no way to time it. The honeypot alone
  carries anti-automation weight for no-JS submissions.
- Routing: `firebase.json` Hosting rewrite maps `/api/submit-quotation` → `submitQuotation`
  (europe-west1), so the form's plain POST and its fetch enhancement are both same-origin — no
  CORS configuration needed. `listQuotations` is called through the Functions client SDK
  (callable protocol), not a Hosting rewrite.

## Environment variables (`.env.example`, mirrored at `functions/.env.example`)

| Variable | Used by | Notes |
|---|---|---|
| `EMAIL_PROVIDER` | `functions/src/email.ts` | Only `"resend"` implemented (plain HTTPS API via `fetch`, no SDK dependency) |
| `EMAIL_API_KEY` | `functions/src/email.ts` | Secret |
| `EMAIL_API_BASE_URL` | `functions/src/email.ts` | Defaults to `https://api.resend.com` |
| `EMAIL_FROM` | `functions/src/email.ts` | Verified sending address |
| `EMAIL_TO` | `functions/src/email.ts` | Notification recipient |
| `ALLOWED_ADMIN_EMAILS` | `functions/src/admin.ts` | Comma-separated allow-list |
| `RATE_LIMIT_HASH_SALT` | `functions/src/hash.ts`, `functions/src/env.ts` | Secret pepper; falls back to a fixed non-secret string only so the emulator/tests run without setup — production must set a real value |
| `PUBLIC_FIREBASE_API_KEY` | `src/pages/admin/index.astro` | Public Firebase web config identifier, not a secret |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | `src/pages/admin/index.astro` | ″ |
| `PUBLIC_FIREBASE_PROJECT_ID` | `src/pages/admin/index.astro` | ″ |

No key, token, or a project id carrying a secret is committed anywhere. `.firebaserc`'s project id
is the literal placeholder `propagafrica-REPLACE-BEFORE-DEPLOY`.

## Judgment calls (nothing here was specified and had to be decided)

- **`docs/content/copy-reference.md` was missing at session start.** Built an initial version of
  the form against placeholder copy of my own invention; a mid-session message merged `main` in
  (bringing the real copy deck, plus an updated `playwright.config.ts` and pnpm build-approval
  config) and everything — field list, order, options, button/success/error text, the privacy
  note — was rewritten to match `docs/content/copy-reference.md` "/contact · SHEET 14 OF 14"
  verbatim. Per-field inline validation microcopy (e.g. "Enter your name.") is *not* specified
  there and is this session's own addition.
- **`.factory/decisions/session-4.md` (the prefill query-string contract) is still absent** even
  after the merge. Implemented defensively: same-named query params as the form's own field names,
  trimmed and length-capped; "stage" (multi-select) accepts a repeated `?stage=Graft&stage=Root`
  or a single comma-separated `?stage=Graft,Root`. Documented in `src/lib/quotation/schema.ts`.
- **Prefill can only happen client-side.** This site builds to fully static HTML (`astro build`,
  `output: "static"`) — there is no per-request server to read a query string at build time.
  `Astro.url.searchParams` in a page's frontmatter is always empty in the built output; an early
  version of this form read it there, which silently never worked. Fixed by moving prefill into
  `QuoteForm.astro`'s client `<script>` (`window.location.search`), verified with a real Playwright
  test (`tests/e2e/contact-form.spec.ts`). This means prefill does not apply with JavaScript
  disabled — a real, documented limitation, not an oversight.
- **The contact page's title block isn't the shared `TitleBlock.astro` component.** The copy deck
  specifies four rows — `DRAWING / SUBJECT / RESPONSE / SHEET` — that don't match
  `TitleBlock.astro`'s fixed five rows (`DWG NO. / SUBJECT / PRINCIPAL SKU / KEY DIM. / SCALE`),
  and that component is outside this session's owned paths. `contact.astro` renders an inline
  `<dl>` with the same visual grammar (border, mono, key/value rows) instead of extending or
  forking the shared component.
- **`/admin`'s Firebase Auth is loaded from Google's CDN, not `npm`.** The task said no new
  front-end (root `package.json`) dependencies; `functions/**` can have its own, but there's no
  equivalent carve-out for a client-side Firebase Auth SDK. Email-link sign-in needs real client
  logic (token handling, link completion) that isn't reasonably hand-rolled against the Identity
  Toolkit REST API, so `src/pages/admin/index.astro` dynamically imports the modular Web SDK from
  `https://www.gstatic.com/firebasejs/<pinned version>/...` at runtime — zero `package.json`
  entries, one pinned version string.
- **Two one-line edits outside this session's owned paths**: `tsconfig.json` (added `"functions"`
  to `exclude`) and `eslint.config.js` (added `'functions/**'` to `ignores`). Without them, the
  root `astro check`/`eslint .` try to type-check and lint `functions/`'s Firebase-only imports
  (`firebase-admin`, `firebase-functions`) against the root project, which can't resolve them
  (`functions/` has its own separate `node_modules`) — every `factory-check` run would be
  permanently red otherwise. Confirmed necessary and minimal by the domain reviewer.
- **Not fixed**: `pnpm exec prettier --check .` is red on four files this session doesn't own —
  `.factory/DECISIONS.md`, `docs/content/copy-reference.md`, `docs/content/copy-supplies.md`,
  `docs/content/field-notes.md` — already unformatted when they arrived via the `main` merge.
  Confirmed the fix is purely mechanical (ran `prettier --write`, diffed, reverted), but
  reformatting another session's content wasn't this session's call to make.
- **Playwright coverage was split** rather than left entirely unrun. `tests/e2e/quotation.spec.ts`
  (submits against the emulator, asserts the Firestore document shape; submits with JavaScript
  disabled) needs the Firebase emulator, which this sandbox's egress policy blocks — it self-skips
  cleanly (confirmed: 2 skipped, not 2 failed) rather than being left unwritten. Everything
  checkable without a live backend moved into a new `tests/e2e/contact-form.spec.ts`, which passes
  for real against the built static site.
- `tests/unit/quotation-validate.test.ts` and `tests/e2e/*.spec.ts` are new files under
  `tests/unit/` and `tests/e2e/`, directories the task brief's owned-paths list didn't name
  (`"Everything else is frozen"`). Added anyway, additively (no existing test file touched) — the
  brief's own Checks section explicitly requires exactly this Playwright coverage, and it can't
  exist without a file to hold it.
