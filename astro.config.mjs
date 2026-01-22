// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mulloymorrow.com',
  outDir: './docs',
  integrations: [svelte(), sitemap()],
  build: {
    assets: '_assets'
  }
});