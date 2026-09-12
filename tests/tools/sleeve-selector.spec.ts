import { test, expect } from '@playwright/test';

// Drives the SleeveSelector island by keyboard alone, against the static
// fixture served by tests/tools/fixtures/serve.mjs (see
// .factory/decisions/session-4.md — session 8 mounts the real component).
test.describe('SleeveSelector — keyboard operation', () => {
  test('renders a correct default state before any interaction', async ({ page }) => {
    await page.goto('/sleeve-selector.html');
    await expect(page.locator('#sleeve-sku')).toHaveText('PRO-ROSE 45');
    await expect(page.locator('#sleeve-bore')).toHaveText('4.5 mm');
    await expect(page.locator('#stem-diameter-value')).toHaveText('4.5 mm');
  });

  test('Tab reaches the checked crop radio, arrow keys switch crop and re-render', async ({
    page,
  }) => {
    await page.goto('/sleeve-selector.html');

    await page.keyboard.press('Tab');
    await expect(page.locator('#crop-rose')).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#crop-vegetable')).toBeFocused();
    await expect(page.locator('#sleeve-sku')).toHaveText('PRO-VEG');
    // Stem is still 4.5 mm — outside PRO-VEG's 1.5–2.5 mm bore range.
    await expect(page.locator('#sleeve-fit-note')).toContainText('over the sleeve bore');

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#crop-cucurbit')).toBeFocused();
    await expect(page.locator('#sleeve-sku')).toHaveText('PRO-CUC');
    // 4.5 mm sits inside PRO-CUC's 2.5–4.0 mm range once clamped to 4.0.
    await expect(page.locator('#sleeve-fit-note')).toContainText('target fit');

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#crop-tree')).toBeFocused();
    await expect(page.locator('#sleeve-sku')).toHaveText('PRO-TREE');
    await expect(page.locator('#sleeve-fit-note')).toContainText('scion and rootstock geometry');

    // The focused option carries a visible focus indicator (not suppressed).
    const outline = await page
      .locator('label[for="crop-tree"]')
      .evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
  });

  test('the range input is keyboard-adjustable and announces its value', async ({ page }) => {
    await page.goto('/sleeve-selector.html');

    await page.keyboard.press('Tab'); // crop-rose
    await page.keyboard.press('Tab'); // stem-diameter
    await expect(page.locator('#stem-diameter')).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#stem-diameter-value')).toHaveText('4.4 mm');
    await expect(page.locator('#stem-diameter')).toHaveJSProperty('value', '4.4');

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    // 4.5 - 0.5 = 4.0 mm crosses into the PRO-ROSE 45 band's lower edge.
    await expect(page.locator('#stem-diameter-value')).toHaveText('4.0 mm');
    await expect(page.locator('#sleeve-sku')).toHaveText('PRO-ROSE 45');
    await expect(page.locator('#sleeve-fit-note')).toContainText('target fit');
  });
});
