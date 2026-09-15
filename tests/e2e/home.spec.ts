import { test, expect } from '@playwright/test';

const WIDTHS = [320, 375, 400, 1280];

test.describe('home page', () => {
  for (const width of WIDTHS) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }

  test('H1 matches the specified hero copy exactly', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1).toHaveText(
      'Propagation supplies for nurseries and flower farms across Kenya and Ethiopia',
    );
  });

  test('propagation journey shows all six steps at once', async ({ page }) => {
    await page.goto('/');
    const steps = page.locator('.journey-steps .step');
    await expect(steps).toHaveCount(6);
    await expect(steps.first()).toContainText('Select and prepare stock');
    await expect(steps.last()).toContainText('Move to production');
  });

  test('wordmark renders "PropagAfrica" in title case', async ({ page }) => {
    await page.goto('/');
    const wordmarkName = page.locator('.wordmark .name').first();
    await expect(wordmarkName).toHaveText('PropagAfrica');
  });
});
