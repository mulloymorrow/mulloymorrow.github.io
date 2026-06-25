// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mulloymorrow.com',
  outDir: './docs',
  integrations: [svelte(), mdx(), sitemap()],
  build: {
    assets: '_assets'
  }
});