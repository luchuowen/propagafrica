import { test, expect } from '@playwright/test';

// Covers what can be verified against the static build alone (astro preview, the same server
// home.spec.ts uses) — markup, labelling, prefill and the client-side validation/honeypot short
// circuits. What needs a live backend (a real submission reaching Firestore) lives in
// quotation.spec.ts instead, which requires the Firebase emulator — see the note there and in
// .factory/decisions/session-6.md on why that suite could not be run in this sandbox.
const FIELD_IDS = ['name', 'farmOrCompany', 'email', 'phone', 'country', 'message'];

test.describe('quotation form markup and progressive enhancement', () => {
  test('every field has a label, a stable id and an aria-describedby error target', async ({
    page,
  }) => {
    await page.goto('/contact');
    for (const id of FIELD_IDS) {
      const field = page.locator(`#${id}`);
      await expect(field).toHaveCount(1);
      const describedBy = await field.getAttribute('aria-describedby');
      expect(describedBy).toBe(`${id}-error`);
      await expect(page.locator(`#${describedBy}`)).toHaveCount(1);
    }
    // "Enquiring about" is a fieldset of checkboxes, not a single input with an id.
    await expect(page.getByRole('group', { name: /Enquiring about/ })).toBeVisible();
  });

  test('the honeypot field is hidden from sighted users and unreachable by tab', async ({
    page,
  }) => {
    await page.goto('/contact');
    const honeypot = page.locator('#companyWebsite');
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    await expect(honeypot).toHaveAttribute('autocomplete', 'off');
    // Clipped to a 1x1 box by its wrapper, not display:none — still technically present for a
    // bot that skips display:none fields, but invisible and untabbable for a sighted user.
    const wrapperBox = await page.locator('.honeypot').boundingBox();
    expect(wrapperBox?.width).toBeLessThanOrEqual(1);
    expect(wrapperBox?.height).toBeLessThanOrEqual(1);
  });

  test('prefills fields from the query string', async ({ page }) => {
    await page.goto(
      '/contact?name=Jane+Wanjiru&country=Kenya&enquiringAbout=Grafting+Tubes&enquiringAbout=Grafting+Clips',
    );
    await expect(page.locator('#name')).toHaveValue('Jane Wanjiru');
    await expect(page.locator('#country')).toHaveValue('Kenya');
    await expect(page.locator('#enquiringAbout-0')).toBeChecked(); // Grafting Tubes
    await expect(page.locator('#enquiringAbout-1')).toBeChecked(); // Grafting Clips
    await expect(page.locator('#enquiringAbout-2')).not.toBeChecked(); // Nursery Consumables
  });

  test('prefills the Enquiring-about field and Message from a consumables-planner handoff', async ({
    page,
  }) => {
    const payload = {
      source: 'consumables-planner',
      items: { trays: 100, pots: 0, labels: 100, domes: 20, ties: 0 },
    };
    const prefill = encodeURIComponent(JSON.stringify(payload));
    await page.goto(`/contact?prefill=${prefill}`);
    await expect(page.locator('#enquiringAbout-2')).toBeChecked(); // Nursery Consumables
    await expect(page.locator('#message')).toHaveValue(
      'Planned from the consumables planner: 100 trays, 100 labels, 20 humidity domes.',
    );
    await expect(page.locator('#calculatorContext')).toHaveValue(decodeURIComponent(prefill));
  });

  test('prefills the Enquiring-about field and Message from a grafting-calculator handoff', async ({
    page,
  }) => {
    const payload = {
      source: 'grafting-calculator',
      cropGroup: 'Roses and ornamentals',
      productCode: 'PRO-ROSE 55',
      clipType: 'Omega Clip',
      tubesNeeded: 5000,
      clipsNeeded: 5000,
    };
    const prefill = encodeURIComponent(JSON.stringify(payload));
    await page.goto(`/contact?prefill=${prefill}`);
    await expect(page.locator('#enquiringAbout-0')).toBeChecked(); // Grafting Tubes
    await expect(page.locator('#enquiringAbout-1')).toBeChecked(); // Grafting Clips
    await expect(page.locator('#message')).toHaveValue(
      'Planned from the grafting calculator: Roses and ornamentals — ' +
        '5,000 x PRO-ROSE 55 tubes, 5,000 x Omega Clip clips.',
    );
  });

  test('shows inline errors and does not navigate when required fields are empty', async ({
    page,
  }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send the request' }).click();
    await expect(page.locator('#name-error')).toHaveText('Enter your name.');
    await expect(page.locator('#enquiringAbout-error')).toHaveText('Select at least one option.');
    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page.locator('#quote-form')).toBeVisible();
  });

  test('a filled honeypot short-circuits straight to the success state, no network call', async ({
    page,
  }) => {
    await page.goto('/contact');
    await page.locator('#name').fill('Bot');
    await page.locator('#companyWebsite').fill('https://spam.example');

    let requestMade = false;
    page.on('request', (request) => {
      if (request.url().includes('/api/submit-quotation')) requestMade = true;
    });

    await page.getByRole('button', { name: 'Send the request' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible();
    expect(requestMade).toBe(false);
  });
});
