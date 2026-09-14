import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Every public route. /admin is deliberately excluded: it is not public
// content, it is behind authentication, and robots.txt disallows it.
// The pre-restart supplies/how-grafting-works/specifications/ordering routes were
// deleted in the Prompt 0 foundations restart (see .factory/DECISIONS.md) and are
// not yet replaced.
export const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/products',
  '/products/grafting-tubes',
  '/products/grafting-clips',
  '/products/nursery-consumables',
  '/products/propagation-systems',
  '/products/sanitation',
  '/products/monitoring',
  '/products/technical-services',
  '/tools',
  '/tools/grafting-calculator',
  '/tools/consumables-planner',
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

  // The sleeve selector and consumables planner keyboard tests were removed with
  // /supplies/graft and /ordering in the Prompt 0 restart — the tools session that
  // remounts them (at /tools/grafting-calculator/ and /tools/consumables-planner/)
  // re-adds this coverage.

  test('the quotation form is operable from the keyboard', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form').first();
    await form.locator('input, select, textarea').first().focus();
    const focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(['input', 'select', 'textarea']).toContain(focused);
  });
});

// The /specifications-vs-/supplies/graft table-identity tests were removed with
// those two routes in the Prompt 0 restart. src/data/products/tables.ts (the
// single-source-of-truth registry they guarded) is untouched, and
// tests/unit/spec-tables.test.ts still covers it at the data layer; a products
// session should reinstate a rendered-page check once a page reads from it again.

// Session 7 (branch claude/jolly-lamport-fmnpd9) delivered its own version of
// the reference pages after session 8 had already written them, and shipped one
// idea worth keeping: grep the BUILT HTML, not the source. The manifest gates
// are regexes over source copy, and a rephrase or a value assembled at build
// time can slip past them. Session 7 ran a full `astro build` inside a unit
// test for /about alone; this runs against the pages the suite already has, and
// covers every route.
test.describe('the rendered page, not the source', () => {
  const BANNED = [
    'founded',
    'established 20',
    'since 20',
    'years of experience',
    'years in business',
    'welcome to',
    'why choose us',
    'one-stop',
    'world-class',
    'cutting-edge',
    'state-of-the-art',
    'industry-leading',
    'lorem ipsum',
    'coming soon',
    'placeholder',
  ];

  for (const route of ROUTES) {
    test(`${route} contains none of the banned phrases as rendered text`, async ({ page }) => {
      await page.goto(route);
      const text = (await page.locator('body').innerText()).toLowerCase();
      for (const phrase of BANNED) {
        expect(text, `"${phrase}" on ${route}`).not.toContain(phrase);
      }
    });
  }

  test('/about states no founding date, company age or headcount', async ({ page }) => {
    await page.goto('/about');
    const text = (await page.locator('body').innerText()).toLowerCase();
    // A year anywhere in a sentence about the company is the failure mode the
    // owner flagged, so this is stricter than the phrase list above. A footer
    // copyright year is excused either way it's marked: the word "copyright"
    // or the "©" symbol.
    expect(text).not.toMatch(/\b(founded|established|incorporated|trading since)\b/);
    expect(text).not.toMatch(/(?<!©\s*)\b(19|20)\d{2}\b(?![^.]*copyright)/);
    expect(text).not.toMatch(/\b\d+\s+(employees|staff|people)\b/);
  });
});
