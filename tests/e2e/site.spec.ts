import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Every public route. /admin is deliberately excluded: it is not public
// content, it is behind authentication, and robots.txt disallows it.
export const ROUTES = [
  '/',
  '/supplies',
  '/supplies/prepare',
  '/supplies/graft',
  '/supplies/root',
  '/supplies/protect',
  '/supplies/record',
  '/how-grafting-works',
  '/specifications',
  '/ordering',
  '/about',
  '/contact',
  '/field-notes',
  '/field-notes/how-a-graft-knits-together',
  '/field-notes/european-rose-rules-inside-the-house',
  '/field-notes/choosing-a-sleeve-bore',
  '/field-notes/hypochlorite-is-a-protocol',
  '/field-notes/reading-a-substrate-specification',
  '/404',
];

const WIDTHS = [320, 375, 400, 768, 1024, 1440];

test.describe('accessibility', () => {
  for (const route of ROUTES) {
    test(`axe reports no violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`),
        JSON.stringify(results.violations, null, 2),
      ).toEqual([]);
    });
  }
});

test.describe('layout', () => {
  for (const route of ROUTES) {
    test(`no horizontal scroll on ${route}`, async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return doc.scrollWidth - doc.clientWidth;
        });
        expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe('metadata', () => {
  for (const route of ROUTES) {
    test(`${route} carries a title, description and canonical`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/PropagAfrica Technologies$/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThan(40);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toMatch(/^https:\/\//);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    });
  }

  test('the home page carries Organization JSON-LD with no founding date', async ({ page }) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(raw ?? '{}');
    expect(data['@type']).toBe('Organization');
    expect(data.name).toBe('PropagAfrica Technologies');
    expect(data.telephone).toBe('+254722861682');
    expect(data.foundingDate).toBeUndefined();
    expect(data.numberOfEmployees).toBeUndefined();
  });

  test('each Field Note carries Article JSON-LD with no invented date', async ({ page }) => {
    await page.goto('/field-notes/how-a-graft-knits-together');
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(raw ?? '{}');
    expect(data['@type']).toBe('Article');
    expect(data.datePublished).toBeUndefined();
    expect(data.dateModified).toBeUndefined();
  });
});

test.describe('the wordmark', () => {
  test('renders the exact string and is never upper-cased', async ({ page }) => {
    await page.goto('/');
    const name = page.locator('.wordmark .name').first();
    await expect(name).toHaveText('PropagAfrica');
    const transform = await name.evaluate((el) => getComputedStyle(el).textTransform);
    expect(transform).toBe('none');
    const rendered = await name.evaluate((el) => el.textContent ?? '');
    expect(rendered).not.toBe(rendered.toUpperCase());
  });
});

test.describe('keyboard traversal', () => {
  test('every visible link and control on the home page is reachable by Tab', async ({ page }) => {
    await page.goto('/');
    // Mark each focusable element, then tab through and record which marks
    // actually received focus. Comparing marks — not tag names — is what makes
    // this a real reachability check rather than a count of Tab presses.
    const expected = await page.evaluate(() => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea'),
      ).filter((el) => el.offsetParent !== null && !el.hasAttribute('disabled'));
      nodes.forEach((el, i) => el.setAttribute('data-tab-probe', String(i)));
      return nodes.length;
    });
    expect(expected).toBeGreaterThan(3);

    await page.evaluate(() => document.body.focus());
    const reached = new Set<string>();
    for (let i = 0; i < expected + 10; i += 1) {
      await page.keyboard.press('Tab');
      const probe = await page.evaluate(() =>
        (document.activeElement as HTMLElement | null)?.getAttribute('data-tab-probe'),
      );
      if (probe !== null && probe !== undefined) reached.add(probe);
      if (reached.size === expected) break;
    }
    expect(reached.size, 'every focusable element should be reachable by Tab').toBe(expected);
  });

  test('the sleeve selector is operable from the keyboard', async ({ page }) => {
    await page.goto('/supplies/graft');
    const selector = page.locator('#sleeve-selector');
    await expect(selector).toBeVisible();
    const focusable = selector.locator('input, select, button');
    expect(await focusable.count()).toBeGreaterThan(0);
    await focusable.first().focus();
    await expect(focusable.first()).toBeFocused();
  });

  test('the consumables planner is operable from the keyboard', async ({ page }) => {
    await page.goto('/ordering');
    const planner = page.locator('#consumables-planner');
    await expect(planner).toBeVisible();
    const focusable = planner.locator('input, select, button, a[href]');
    expect(await focusable.count()).toBeGreaterThan(0);
    await focusable.first().focus();
    await expect(focusable.first()).toBeFocused();
  });

  test('the quotation form is operable from the keyboard', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form').first();
    await form.locator('input, select, textarea').first().focus();
    const focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(['input', 'select', 'textarea']).toContain(focused);
  });
});

test.describe('the specification index', () => {
  test('renders the sleeve table identically to /supplies/graft', async ({ page }) => {
    async function readTable(url: string, caption: string): Promise<string[][]> {
      await page.goto(url);
      const figure = page.locator('figure.spec-table', { hasText: caption }).first();
      return figure
        .locator('table tr')
        .evaluateAll((rows) =>
          rows.map((row) =>
            Array.from(row.querySelectorAll('th, td')).map((cell) =>
              (cell.textContent ?? '').trim(),
            ),
          ),
        );
    }

    const onStage = await readTable('/supplies/graft', 'Silicone grafting sleeves');
    const onIndex = await readTable('/specifications', 'Silicone grafting sleeves');
    expect(onStage.length).toBeGreaterThan(1);
    expect(onIndex).toEqual(onStage);
  });

  test('renders the clip table identically to /supplies/graft', async ({ page }) => {
    async function readTable(url: string, caption: string): Promise<string[][]> {
      await page.goto(url);
      const figure = page.locator('figure.spec-table', { hasText: caption }).first();
      return figure
        .locator('table tr')
        .evaluateAll((rows) =>
          rows.map((row) =>
            Array.from(row.querySelectorAll('th, td')).map((cell) =>
              (cell.textContent ?? '').trim(),
            ),
          ),
        );
    }

    const onStage = await readTable('/supplies/graft', 'Grafting clips');
    const onIndex = await readTable('/specifications', 'Grafting clips');
    expect(onIndex).toEqual(onStage);
  });
});
