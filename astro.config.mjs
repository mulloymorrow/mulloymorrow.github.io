// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://code.mulloymorrow.com',
  outDir: './docs',
  integrations: [svelte()],
  build: {
    assets: '_assets'
  }
});