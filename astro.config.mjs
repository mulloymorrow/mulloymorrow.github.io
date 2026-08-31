// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import { essaySitemapUrls } from './src/data/writing.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://mulloymorrow.com',
  outDir: './docs',
  integrations: [
    svelte(),
    sitemap({
      // Standalone essays live in public/blog and are not Astro routes.
      customPages: essaySitemapUrls,
    }),
  ],
  build: {
    assets: '_assets'
  }
});