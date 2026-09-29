# AaronAust1n.github.io

Personal blog + 形外 OUTLINE interactive museum — `https://aaronaust1n.github.io/`

- Blog / 博客: `/` (EN) · `/zh/` (中文)
- Museum / 博物馆: `/museum/` (183 exhibits · 13 departments, standalone zero-dependency app)
- Vote / 投票: `/vote` · `/zh/vote`

## Local development / 本地开发

```sh
npm ci
npm run docs:dev      # http://localhost:5173/
npm run docs:build    # outputs docs/.vitepress/dist
npm run docs:preview
```

`docs:dev` and `docs:build` regenerate `docs/.vitepress/stats.json` and `docs/public/sitemap.xml` before building. There is no lint or test script — verify with `npm run docs:build`.

## Maintenance / 维护

### Updating the museum / 更换博物馆版本

1. Overwrite the museum into `docs/public/museum/`:
   - `index.html` (built entry, relative `src/` links)
   - `src/` (`generated.js`, `toolkit.js`, `app.js`, `effects/*`, CSS, runtimes)
2. Run `npm run generate:stats` — it reads `src/generated.js` (exhibit count, departments, version) and counts posts, writing `docs/.vitepress/stats.json`.
3. Preview with `npm run docs:dev`, then commit. Homepage stats, the museum showcase and `og:description` all read that file, so numbers stay in sync automatically.

Do not hand-edit generated files under `docs/public/museum/`; always replace them from the museum source.

### Museum English layer & handbooks / 博物馆英文化与手册

- English lives in `docs/public/museum-i18n/` (outside the museum folder, so museum updates never wipe it):
  - `outline-i18n.js` — runtime layer: language detection, data merge, UI text/attribute translation.
  - `en.00.ui.js` — interface dictionary, patterns and department names.
  - `en.<n>.<category>.js` — per-department exhibit translations (13 files).
- `npm run generate:stats` also:
  - re-injects the language layer and site-nav into `docs/public/museum/index.html` (idempotent, picks up new `en.*.js` parts automatically);
  - regenerates both handbooks: `handbook-183-en.md` (generated English edition) and `handbook-183-zh.md` (original Chinese).
- The museum download button serves the edition matching the interface language; the other edition is linked beside it. Untranslated strings fall back to Chinese gracefully.
- Language is inferred from the referring page, then the browser language, and can be forced with `?lang=en` / `?lang=zh`.

### Adding a post / 发新文章

Add `docs/posts/<slug>.md` (EN) and `docs/zh/posts/<slug>.md` (ZH) with frontmatter `title`, `date`, `description`, `tags` (optional `image`). Sidebar, hreflang pairs and sitemap are generated from the files. Bilingual parity is expected.

### Museum links

The museum is a standalone static app, not a VitePress route, so links to `/museum/` must carry a `target` attribute (e.g. `target: '_self'`) to bypass VitePress's SPA click interception and allow a normal full-page load.