# Exporting an app's design to the builder

The goal is the app's screens on the builder's canvas, in the app's own theme, as layers someone can keep editing. The export has two halves that travel separately: the theme lives in the browser's Configure settings, and the screens travel as a layout link.

If the project already has `design/configure-choices.json` or `design/builder/*.json`, start from those and change only what the app has changed since.

## 1. The theme, as Configure choices

The builder applies the Configure panel's state to its canvas. That state is the same set of answers `scripts/theme.mjs build` takes (`node scripts/theme.mjs options` lists them).

1. **Read the app's theme.** Find where it sets `--dt-*` tokens (grep for `--dt-color-primary-`).
   - A theme built by this skill has its answers in its first comment (`dovetail-setup choices`). Use them as they are.
   - A hand-written theme needs translating. Map what it sets to the nearest choices:

     | The theme sets | Choice |
     |---|---|
     | `--dt-color-primary-*` | `primary: "custom"`, `primaryHex`: the 500 step as a hex. Convert an `oklch()` value to sRGB hex first. |
     | `--dt-color-secondary-*` | `secondary: "custom"`, `secondaryHex`: its 500 step as a hex |
     | `--dt-font-family-sans` | `font` (`system` for a system font stack) |
     | headings in another face (`--dt-text-heading-*-family`, `--dt-text-display-*-family`) | `displayFont` |
     | `--dt-surface-action` pointing at the brand | `actions: "brand"` (otherwise leave it out: ink is the default) |
     | rounder or sharper `--dt-radius-*` | `radius` |
     | an icon set (look at the app's imports) | `iconLib` |
     | generous section spacing | `whitespace: "airy"` |

2. **Check them.** Write the choices to `design/configure-choices.json` and build a throwaway theme from them:

   ```sh
   node scripts/theme.mjs build design/configure-choices.json --out /tmp/check-theme.css
   ```

   Read its report. A failing contrast pair needs the same conversation as in SKILL.md step 3. Compare the built primary and secondary ramps with the app's own. Configure rebuilds each ramp around the hex, so the steps differ a little from a hand-tuned ramp. Say so rather than chasing an exact match.

3. **Say what Configure can't hold.** Anything the app sets that has no choice: a tinted neutral ramp, component token overrides, its own CSS. The builder shows Dovetail's version of those.

4. **Apply them.** Give the user either way:

   - **In Configure:** open https://graham-goebel.github.io/Dovetail/, press Configure, and set each choice by hand (a custom colour takes the hex).
   - **In one step:** on any page of the Dovetail site, open the browser console and run the line below, then reload the builder. It writes the panel's saved settings (`dovetail-theme-config`, the key Configure itself saves to, merged over its defaults), so it replaces whatever theme was saved there before.

     ```js
     localStorage.setItem("dovetail-theme-config", JSON.stringify(/* the contents of design/configure-choices.json */))
     ```

## 2. The screens, as a layout

Read the format first (https://graham-goebel.github.io/Dovetail/assets/builder-layouts.md, as in SKILL.md). Then for each screen:

1. **Pick the frames.** One frame per screen, at the size the app is mostly used at (Phone, 390 × 844, for a phone-first app), with `"hug": true` so the frame grows to the page. Add a Desktop frame (1280 × 800) only when the layout really differs.
2. **Walk the page's JSX top to bottom** and write a node for each part:

   | In the app | In the layout |
   |---|---|
   | A Dovetail component (`Section`, `Stack`, `Heading`, `Text`, `Button`, the Blocks…) | The same `type`, with its plain props |
   | A Block given React elements (a `SplitBlock`'s `media`, a `TestimonialBlock`'s quotes, a `FeatureGridBlock`'s features) | The Block with its text props. Its slots keep the builder's sample content: say so. |
   | The app's own flex wrapper (`div` with `display: flex`) | `Group` with `direction`, `gap`, `align`, `justify` |
   | A photo card (`Card` with `background`, or an image with the title over it) | `Cover` with `src`, `eyebrow`, `title`, `radius: "container"` |
   | A card with a picture on top and text below | `Group` (column, `gap: "none"`, `border`, `radius`, `surface: "raised"`) holding an `Image` and a padded `Stack` |
   | A horizontal carousel | Its header, then the first one or two cards stacked. The builder has no scrolling row. |
   | A logo over a photo (local SVG) | `Cover` with the brand name as `title`. A link can't carry local files. |
   | A map, chart or other third-party widget | A `Shape` or `Image` placeholder, named so it reads in the layers |
   | Content from data (`items.map(...)`) | The real values from the first few items, written out |
   | Images | Their full https URLs. Never a local import. |

3. **Style with tokens only:** style keys and their option names, never pixels or colours. The app's own CSS (custom classes, `!important` fixes) doesn't carry over; reach for the nearest token instead.
4. **Make the link** with `node scripts/builder-link.mjs design/builder/<screen>.json`, fix any warnings, and rerun.

## 3. Hand it over

Give the user:

- the theme step from section 1, done before opening the link
- the link (or the JSON to paste, past 30,000 characters)
- what won't carry over:
  - the app's own CSS
  - interactive behaviour (filters, sheets, maps, autoplay)
  - React-element slots that keep sample content
  - anything the theme choices can't hold

When they've changed things in the builder, they can use Code, then Copy layout JSON, and paste it back to you to bring the changes into the app.
