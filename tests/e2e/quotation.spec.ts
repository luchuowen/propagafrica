import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));

// These tests exercise the real backend (Cloud Function + Firestore), so they run against the
// Firebase Hosting emulator (which carries the /api/submit-quotation rewrite — plain `astro
// preview`, used by the rest of this suite, does not) rather than the shared `baseURL` in
// playwright.config.ts. Bring the stack up first:
//   pnpm build && firebase emulators:start --only hosting,functions,firestore
// then run this file on its own: `pnpm exec playwright test quotation.spec.ts`.
//
// Not run as part of `factory-check.sh full` (which only starts `astro preview`) and not
// verified in this sandbox: the emulator binaries are fetched from
// firebase-public.firebaseio.com, which this environment's egress policy blocks — see
// .factory/decisions/session-6.md. The suite skips itself cleanly when the emulator isn't up.
const HOSTING_URL = 'http://127.0.0.1:5000';
const FIRESTORE_EMULATOR_URL = 'http://127.0.0.1:8080';
const firebaseRc = JSON.parse(readFileSync(join(__dirname, '..', '..', '.firebaserc'), 'utf8')) as {
  projects: { default: string };
};
const PROJECT_ID = firebaseRc.projects.default;

async function emulatorIsUp(): Promise<boolean> {
  try {
    const response = await fetch(HOSTING_URL, { method: 'GET' });
    return response.ok || response.status === 404;
  } catch {
    return false;
  }
}

async function fetchLatestQuotationRequest(): Promise<Record<string, unknown> | null> {
  const url = `${FIRESTORE_EMULATOR_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents/quotationRequests`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const body = (await response.json()) as {
    documents?: Array<{ fields: Record<string, unknown> }>;
  };
  const documents = body.documents ?? [];
  return documents.length > 0 ? (documents[documents.length - 1]?.fields ?? null) : null;
}

test.describe('quotation request — against the Firebase emulator', () => {
  test.beforeAll(async () => {
    test.skip(!(await emulatorIsUp()), 'Firebase Hosting emulator is not running on :5000.');
  });

  test('submits with JavaScript enabled and the document lands in Firestore', async ({ page }) => {
    await page.goto(`${HOSTING_URL}/contact`);

    await page.locator('#name').fill('Playwright Test');
    await page.getByLabel('Company/farm name').fill('Test Farm Ltd');
    await page.getByLabel('Email').fill('playwright@example.com');
    await page.getByLabel('Country').selectOption('Kenya');
    await page.getByLabel('Grafting Tubes').check();

    await page.getByRole('button', { name: 'Send the request' }).click();

    await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible();
    await expect(page).toHaveURL(`${HOSTING_URL}/contact`);

    const doc = await fetchLatestQuotationRequest();
    expect(doc).not.toBeNull();
    expect(doc?.name).toMatchObject({ stringValue: 'Playwright Test' });
    expect(doc?.farmOrCompany).toMatchObject({ stringValue: 'Test Farm Ltd' });
    expect(doc?.status).toMatchObject({ stringValue: 'new' });
    expect(doc?.source).toMatchObject({ stringValue: 'web' });
    expect(doc).toHaveProperty('createdAt');
    expect(doc).toHaveProperty('userAgentHash');
    expect(doc).not.toHaveProperty('ip');
  });

  test('submits with JavaScript disabled via a plain POST and still succeeds', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto(`${HOSTING_URL}/contact`);
    await page.locator('#name').fill('No JS Test');
    await page.getByLabel('Company/farm name').fill('No JS Farm');
    await page.getByLabel('Email').fill('nojs@example.com');
    await page.getByLabel('Country').selectOption('Ethiopia');
    await page.getByLabel('Nursery Consumables').check();

    await page.getByRole('button', { name: 'Send the request' }).click();

    // No JS: this is a real navigation to the function's own response, not an in-page swap.
    await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible();

    await context.close();
  });
});
