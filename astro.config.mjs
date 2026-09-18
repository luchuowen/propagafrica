import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';
import { generateImageVariants } from './scripts/generate-image-variants.mjs';

/**
 * Generates the WebP + 640w variants the carousel's <picture> markup
 * references, once the build output exists. Runs for every `astro build`
 * regardless of which script invokes it (`pnpm build`, `pnpm exec astro
 * build` in factory-check, CI) since it hooks the Astro build lifecycle
 * itself rather than a package.json script.
 */
function imageVariants() {
  return {
    name: 'image-variants',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await generateImageVariants(path.join(fileURLToPath(dir), 'images'));
      },
    },
  };
}

/**
 * Wrap every markdown table in a focusable, labelled scroll container.
 *
 * A wide table needs `overflow-x: auto` so it never forces the page to scroll
 * sideways, but a scrollable region that cannot be reached by keyboard is a
 * WCAG failure (axe: scrollable-region-focusable). Styling the table itself as
 * the scroller made the table the unreachable region. This wraps it instead.
 */
function rehypeScrollableTables() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === null) return;
      if (parent.type === 'element' && parent.properties?.className?.includes?.('table-scroll')) {
        return;
      }
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['table-scroll'],
          tabindex: 0,
          role: 'region',
          'aria-label': 'Table, scrollable',
        },
        children: [node],
      };
    });
  };
}

// `site` is the public origin. It sets the canonical URLs, the Open Graph
// URLs and the sitemap entries, so it must match wherever the site is served
// from. Session 8 set it to the mapped host agreed for launch; change it here
// and nowhere else if the domain changes.
export default defineConfig({
  site: 'https://propag.navac.co.ke',
  compressHTML: true,
  markdown: {
    rehypePlugins: [rehypeScrollableTables],
  },
  integrations: [
    sitemap({
      // The admin console is not public content.
      filter: (page) => !page.includes('/admin'),
    }),
    imageVariants(),
  ],
  vite: {
    build: {
      // Default per-page CSS chunking splits a component shared by two pages
      // (e.g. TrustPanel, used by Home and About) into its own tiny chunk —
      // every page using it then pays a second render-blocking request for
      // a few KB, which Lighthouse's mobile/slow-4G simulation prices at
      // ~400ms of pure per-request latency (found in the 2026-09-18
      // pre-launch perf audit). One stylesheet per build, fetched once and
      // cached across every page a visitor navigates to next, costs only a
      // few extra KB on pages that don't need every rule.
      cssCodeSplit: false,
    },
  },
});
