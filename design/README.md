# sans in the Dovetail builder

sans's design, exported for the [Dovetail builder](https://graham-goebel.github.io/Dovetail/builder.html), where screens can be rearranged and restyled by hand. The `dovetail-setup` skill (`.claude/skills/dovetail-setup`, "Exporting an app's design to the builder") writes and updates these files. Ask Claude to "export the design to the builder" to refresh them.

| File | What it holds |
|---|---|
| `configure-choices.json` | sans's theme as Configure choices: burnt orange and olive, Instrument Serif headings, system body text, Heroicons, airy spacing |
| `builder/home.json` | The Home screen as a builder layout (phone) |

## Opening it

1. **Theme first.** On any page of the Dovetail site, run this in the browser console, then reload. It replaces the theme saved in Configure:

   ```js
   localStorage.setItem("dovetail-theme-config", JSON.stringify({"primary":"custom","primaryHex":"#cd753a","secondary":"custom","secondaryHex":"#849549","font":"system","displayFont":"instrument","whitespace":"airy","iconLib":"heroicons"}))
   ```

   Or set the same choices by hand in Configure.

2. **Then the screen.** Make the link:

   ```sh
   node .claude/skills/dovetail-setup/scripts/builder-link.mjs design/builder/home.json
   ```

   Or paste the JSON in the builder: Start from, then Paste a layout.

## What doesn't carry over

- sans's own CSS: the oat neutrals, photo scrims, the struck-through wordmark, card title sizes and the rail layout
- Behaviour: carousels and autoplay, quick-view sheets, filters, the map
- The Mill House logo, which is a local file (its card shows the brand name instead)
- The partner pick's photo, the three basics and the testimonial quotes, which keep the builder's sample content

The skill's builder parts (`scripts/builder-link.mjs` and the builder sections of `SKILL.md`) come from Dovetail's main branch, ahead of the 0.7.0 package. When copying the skill from `node_modules` after an upgrade, keep the export section and `references/builder-export.md`.
