# Content guide

People with coeliac disease may rely on what sans says. Only publish what you
have checked yourself, and say when you checked it.

All content lives in `src/data/`:

| File          | What it holds                                   |
| ------------- | ----------------------------------------------- |
| `places.ts`   | Restaurants, cafés, bakeries and markets        |
| `products.ts` | Groceries                                       |
| `recipes.ts`  | Recipes                                         |
| `reviews.ts`  | Reviews and Home testimonials (samples for now) |
| `types.ts`    | The shape of each item and the allowed values   |

`npm run build` type-checks the files, so a missing field or a typo in an
allowed value (like a precaution kind) fails the build instead of shipping.

## Places

Before adding a place, confirm with the place itself, by visiting or calling:

- [ ] **Safety level** (`safety`)
  - `dedicated`: the whole kitchen is gluten-free
  - `gf-menu`: a separate gluten-free menu with real precautions
  - `gf-options`: some dishes are gluten-free as made; cross-contact is possible
- [ ] **Precautions** (`precautions`): one line each, from what they told you.
      Use `shared-fryer` and `ask` for anything a diner must watch out for; these
      show in the warning colour.
- [ ] **What to order** (`order`): dishes that are gluten-free as served
- [ ] **Address and hours**
- [ ] **Last checked** (`lastChecked`): the month you confirmed it, e.g. `'Oct 2026'`.
      Re-check at least every six months.
- [ ] **Photo**: of the place itself, used with permission or under a licence
      that allows it, and credited

## Products

- [ ] Read the current label; record ingredients that matter
- [ ] `certified: true` only if the pack carries a recognised gluten-free
      certification mark
- [ ] Price and where to buy, checked in store or online
- [ ] A photo of the actual product

## Recipes

- [ ] Cook it at least once as written
- [ ] Name any ingredient that is often *not* gluten-free (miso, soy sauce,
      oats, baking powder, stock) and what to buy instead

## Photos

Photos currently come from Unsplash via `unsplash('<photo id>')` in
`src/data/images.ts`. `npm run check:images` (and the `Check images` workflow)
confirms each one still loads, but not that it shows the right thing: look at
every photo before publishing.

## Going live

When every item has been checked, delete the sample reviews and testimonials
and set `sampleContent: false` in `src/site.ts`. That removes the prototype
banner and the sample labels.
