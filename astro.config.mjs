import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const catalog = JSON.parse(
  readFileSync(fileURLToPath(new URL('./src/data/catalog.json', import.meta.url)), 'utf-8')
);

// Draft angel-number pages are noindex (see src/pages/angel-numbers/[number].astro)
// and must not appear in the sitemap either.
const draftPaths = new Set(
  catalog.filter((entry) => entry.draft === true).map((entry) => `/angel-numbers/${entry.slug}/`)
);

export default defineConfig({
  site: 'https://archangelfrequencies.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        if (path === '/reveal/') return false;
        if (path === '/vs/') return false;
        if (draftPaths.has(path)) return false;
        return true;
      },
    }),
  ],
  build: {
    format: 'directory',
  },
});
