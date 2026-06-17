# AGENTS.md

## Cursor Cloud specific instructions

### Product

Static Astro 5 + Svelte 5 portfolio for **mulloymorrow.com**. No backend, database, or Docker services. A single **Astro dev server** is the only process required for local development.

### Commands (repo root)

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server (HMR) | `npm run dev` → http://localhost:4321 |
| Production build | `npm run build` → output in `./docs/` (not `dist/`) |
| Preview build | `npm run preview` → http://localhost:4321 |
| Type check | `npm run check` (see note below) |

See `package.json` scripts and `CONTENT_GUIDE.md` for content editing; `README.md` is a stale Astro minimal template.

### Dev server

- Default branch for deploy is `gh-pages` (GitHub Pages). CI uses **Node 20** (`.github/workflows/deploy.yml`); Node 22 on the VM works for this project.
- `npm run build` rewrites files under `docs/`; avoid committing those artifacts unless you intend to publish.
- `npm run check` may prompt to install `@astrojs/check` on first run. For non-interactive use: `npm i -D @astrojs/check` once, then `npm run check`. Typecheck currently includes warnings/errors in built `docs/_assets/` as well as `src/`; prefer validating with `npm run build` if check is noisy.
- Empty blog collection: `src/content/blog/` may be missing; build logs a warning but succeeds.

### External embeds

Spotify, Google Calendar, GTM, and nalya.ai load from the network in the browser. No `.env` secrets are required for the Astro app.

### Tests / lint

No automated test suite or pre-commit hooks. Use `npm run build` as the primary CI-style gate; optional `npm run check` for Astro/TS diagnostics.
