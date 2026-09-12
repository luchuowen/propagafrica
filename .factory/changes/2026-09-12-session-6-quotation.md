# 2026-09-12 — session-6-quotation

Size: critical (touches `manifest.critical_paths`: `src/pages/contact.astro`, `functions/**`,
`firestore.rules`, `firebase.json`, `.firebaserc`, `src/lib/quotation/**`)

## Intent

- Ask: build `/contact` (the quotation request form) per `docs/content/copy-reference.md`, and the
  backend behind it — Firestore (`quotationRequests`, eur3), a `submitQuotation` Cloud Function
  (2nd gen, europe-west1), Firestore rules that deny all client access, and a `/admin` page
  (Firebase Auth + allow-list) that lists requests through a second authenticated function.
- User-visible outcome: `/contact` renders the real quotation form (progressively enhanced, works
  with JavaScript disabled), submits to a Cloud Function that validates, rate-limits, stores the
  request and emails a notification; `/admin` lets an allow-listed, signed-in user see requests
  newest-first.
- Out of scope: updating a request's status from `/admin` (not asked for — the copy deck and task
  only ask to list "with status"); the sleeve selector / consumables planner; actually provisioning
  a Firebase project (`.firebaserc`'s project id is a placeholder, deploy is not part of this
  session).
- Known constraints: no new front-end (root `package.json`) dependencies — `functions/` is a
  separate deployable package with its own `package.json` and may depend on what it needs;
  `docs/content/copy-reference.md` and `.factory/decisions/session-4.md` were both missing when
  this session started (a mid-task message supplied the former via a merge from `main`; the latter
  is still absent — see Learn + Ship).

## Spec

- Behaviour: see `docs/content/copy-reference.md` "/contact · SHEET 14 OF 14" for the form's field
  list, order, copy and success/error states (final, followed verbatim). Backend behaviour is per
  the task brief: honeypot + timestamp anti-automation, server-side validation and length caps,
  hashed-identifier rate limiting (5/hour), Admin-SDK-only Firestore writes, allow-listed admin
  read access.
- Files touched: see the diff; summarised under Build below.
- Edge cases: a no-JavaScript submission (native POST, no `renderedAt` timestamp — see
  `functions/src/validate.ts`'s `checkAutomation`); a honeypot-filled bot request; rate-limit
  window rollover; an authenticated admin user whose email isn't on the allow-list (sees an empty
  list, not an error); this site's static build having no per-request server to read prefill query
  params at (handled client-side, JS-only — see `QuoteForm.astro`).
- Acceptance checks: `bash scripts/factory-check.sh full` green modulo one pre-existing,
  out-of-scope failure (see Verify + Review); Firestore rules unit tests
  (`functions/test/rules.test.ts`) written and passing in principle, unexecuted in this sandbox
  (network policy blocks the emulator download — see Verify + Review); Playwright coverage split
  between what could actually run here (`tests/e2e/contact-form.spec.ts`, verified green) and what
  needs the Firebase emulator (`tests/e2e/quotation.spec.ts`, self-skips when the emulator isn't
  up); no secret committed.

## Plan

1. Read `blueprint.md`, `.factory/manifest.json`, existing components/pages, `docs/content/copy-reference.md` →
   verify: understood the exact field list/copy and the existing "Blueprint" component grammar.
2. Shared field schema + validation (`src/lib/quotation/`, mirrored in `functions/src/`) → verify:
   `astro check` / `tsc --noEmit` clean, unit tests.
3. `QuoteForm.astro` + `contact.astro` → verify: Playwright (markup, labels, honeypot, prefill,
   inline errors, no-network honeypot short-circuit).
4. Cloud Functions (`submitQuotation`, `listQuotations`), Firestore rules/indexes, `firebase.json`,
   `.firebaserc`, env var docs → verify: `tsc --noEmit` inside `functions/`, rules test written.
5. `/admin` (Firebase Auth email-link sign-in via the CDN Web SDK, not an npm dependency) → verify:
   `astro check`.
6. Full verification pass + domain reviewer → verify: see below.

- Blast radius: additive everywhere except `src/pages/contact.astro` (rewritten from its session-1
  stub) and two files outside this session's owned paths that had to change for the build to even
  typecheck — `tsconfig.json` and `eslint.config.js` — see Learn + Ship.

## Build

- `src/lib/quotation/{schema,validate}.ts` — field contract + client-side validation, field list
  per the copy deck.
- `src/components/quote/QuoteForm.astro` — the form: labelled fields with stable ids and
  `aria-describedby` error targets, a live-region status line, an off-screen honeypot, a hidden
  timestamp stamped client-side, native-HTML-validation-first progressive enhancement (`novalidate`
  is added by script, not present statically), fetch-based submit that swaps in the success state
  without navigating, and a client-side query-string prefill (see Learn + Ship on why it can't be
  server-side).
- `src/pages/contact.astro` — hero copy, a page-local title block (DRAWING/SUBJECT/RESPONSE/SHEET —
  see Learn + Ship on why it isn't the shared `TitleBlock` component), the form.
- `functions/` — standalone package (own `package.json`/`tsconfig.json`).
  `src/index.ts` exports `submitQuotation` (`onRequest`, checks automation → validates → rate-
  limits → writes `quotationRequests` → best-effort emails → responds JSON or HTML depending on
  `Accept`/`Content-Type`) and `listQuotations` (`onCall`, allow-list gated). `src/validate.ts`,
  `src/rateLimit.ts` (Firestore-transaction fixed window), `src/hash.ts` (SHA-256, no raw IP or
  identifier ever stored), `src/email.ts` (Resend HTTP API via `fetch`, no SDK dependency),
  `src/render.ts` (self-contained HTML for the no-JS response path), `src/admin.ts`.
- `firestore.rules` — deny all, explicitly, for `quotationRequests` and `rateLimits`, plus a
  default-deny catch-all. `firestore.indexes.json` — empty (only a single-field `orderBy`, which
  Firestore auto-indexes). `firebase.json` — Hosting rewrite `/api/submit-quotation` →
  `submitQuotation` (europe-west1), so the form and its fetch enhancement stay same-origin (no
  CORS needed); emulator ports. `.firebaserc` — placeholder project id.
- `src/pages/admin/index.astro` — email-link sign-in via the Firebase Auth Web SDK loaded from
  Google's CDN at runtime (not a `package.json` dependency — see Known constraints), calling
  `listQuotations` and rendering a table.
- `.env.example` / `functions/.env.example` — every environment variable, documented.
- Tests: `tests/unit/quotation-validate.test.ts`, `functions/test/validate.test.ts` (12 cases, all
  passing), `functions/test/rules.test.ts` (written, unexecuted — see Verify + Review),
  `tests/e2e/contact-form.spec.ts` (5 cases, all passing against the static build),
  `tests/e2e/quotation.spec.ts` (2 cases, self-skip without the Firebase emulator).

## Verify + Review

- `bash scripts/factory-check.sh full`: gates, caps, `astro check`, `eslint .`, `vitest run`
  (10/10), `astro build` (14 pages) and `playwright test` (11 passed, 2 self-skipped) all green.
  `prettier --check .` is **red**, but only on four files this session does not own and did not
  touch — `.factory/DECISIONS.md`, `docs/content/copy-reference.md`, `docs/content/copy-supplies.md`,
  `docs/content/field-notes.md` — already unformatted on `main` before this session's merge. Ran
  `prettier --write` on them to confirm the fix is purely mechanical (40–136 line diff per file,
  no content change) and then reverted it: reformatting another session's owned content wasn't
  this session's call to make. Flagging for whoever owns those files or `scripts/factory-check.sh`.
- `functions/`: `npm install`, `tsc --noEmit` clean, `npm run build` clean, `npx vitest run` — 12/12
  passing (`test/validate.test.ts`; server-side validation, length-capping, and the honeypot/
  timestamp automation check, including the "no timestamp → not automated" no-JS case).
- Firestore rules test (`functions/test/rules.test.ts`) — written (unauthenticated read/write
  denied, authenticated-but-unprivileged read denied, `rateLimits` denied, default-deny, and a
  sanity check that a security-rules-disabled write succeeds so a failure above is known to be the
  rules and not a broken emulator connection) but **not run**: starting the emulator
  (`firebase emulators:start`) needs to fetch its binary from `firebase-public.firebaseio.com`,
  which this sandbox's egress policy blocks (confirmed via the agent-proxy status endpoint — a
  `connect_rejected` on that host). This is an environment limitation, not a gap in the test
  itself; it should be run in CI or a local dev environment with normal network access before this
  ships.
- `tests/e2e/quotation.spec.ts` (submits against the emulator, asserts the Firestore document
  shape; submits with JavaScript disabled) — same blocker, same reasoning. The suite checks for a
  live Hosting emulator on `:5000` in `beforeAll` and skips itself cleanly rather than failing when
  it isn't there (confirmed: `pnpm exec playwright test` shows 2 skipped, not 2 failed).
  `tests/e2e/contact-form.spec.ts` was added to cover everything checkable without a backend
  (labels/ids/`aria-describedby`, the honeypot's offscreen box and `tabindex`, query-string
  prefill, inline validation without navigation, the honeypot short-circuit never firing a
  network request) — all 5 cases pass for real, against the actual built static site.
- No secret in the diff: `.env.example` documents variable names only; `functions/.env.example`
  mirrors it; both are the only "example" files, and `.gitignore`/`functions/.gitignore` exclude
  the real `.env`.
- Domain reviewer: ran the `reviewer` agent (fresh context, adversarial) against this diff and this
  artifact, with extra checks for copy-deck fidelity, token/forbidden-UI compliance, the Firestore
  rules' no-exceptions deny, raw-IP/UA leakage, client/server schema drift, and accessibility
  wiring. Result: nothing to report as a blocker — copy matches the deck verbatim in both schema
  copies, `functions/src/render.ts`'s literal hex values are outside `src/**` and match
  `tokens.css` exactly (reasoning holds), rules deny everything with no exceptions, IP/UA are only
  ever stored hashed, the admin allow-list isn't leaked through response shape, and every field's
  label/id/`aria-describedby`/live-region wiring is correct in the rendered markup, not just
  intended. The two out-of-scope config edits were independently confirmed as minimal and
  necessary.

## Learn + Ship

- 0–3 bullets → `.factory/DECISIONS.md`: not yet appended — see `.factory/decisions/session-6.md`,
  which this session was asked to write instead (this repo's `DECISIONS.md` is shared, capped, and
  outside this session's owned paths, so session-specific detail goes in the dated file under
  `.factory/decisions/` and only the load-bearing, cross-session facts belong in the shared file —
  none identified beyond what's already there).
- Commit: this commit (not merged — per the task brief, agents never merge).
- PR: not opened — not requested this session.
