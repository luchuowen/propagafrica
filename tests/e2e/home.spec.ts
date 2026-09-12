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
    await expect(h1).toHaveText('Propagation supplies for nurseries and flower farms.');
  });

  test('wordmark renders "PropagAfrica" in title case', async ({ page }) => {
    await page.goto('/');
    const wordmarkName = page.locator('.wordmark .name').first();
    await expect(wordmarkName).toHaveText('PropagAfrica');
  });
});
