# sans

The gluten-free companion: recipes, products and places to eat, with a clear
note on how each one handles gluten. Built with React, Vite and the
[Dovetail](https://graham-goebel.github.io/Dovetail/) design system.

**Prototype:** the content is sample data. See [docs/ROADMAP.md](docs/ROADMAP.md)
for the plan to production and [docs/CONTENT.md](docs/CONTENT.md) for adding
real content.

Live preview: https://graham-goebel.github.io/sans/

## Develop

```sh
npm install
npm run dev           # local dev server
npm test              # unit and page tests (Vitest)
npm run lint          # oxlint
npm run build         # type-check and production build
npm run check:images  # confirm every photo URL still loads (needs network)
```

Every PR runs lint, tests and build (`CI` workflow). Merging to `main` deploys
to GitHub Pages.
