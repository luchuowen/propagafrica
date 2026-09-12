import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';

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
  ],
});
