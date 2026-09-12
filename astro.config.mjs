import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` is the public origin. It sets the canonical URLs, the Open Graph
// URLs and the sitemap entries, so it must match wherever the site is served
// from. Session 8 set it to the mapped host agreed for launch; change it here
// and nowhere else if the domain changes.
export default defineConfig({
  site: 'https://propag.navac.co.ke',
  compressHTML: true,
  integrations: [
    sitemap({
      // The admin console is not public content.
      filter: (page) => !page.includes('/admin'),
    }),
  ],
});
