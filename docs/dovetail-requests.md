# Dovetail feature requests from sans

sans works around ten gaps in `@dovetail-ds/react` 0.4.0 by styling
Dovetail's internal markup or tokens. Those workarounds break silently if the
internals change. Each request below would let sans delete one. They're
written to be filed as issues on the Dovetail repo.

---

## 1. BottomNav: icon-only items

**Need:** a floating nav that shows icons without visible labels, while each
item keeps its accessible name.

**Today:** sans hides the label with
`.nav-dock a[aria-label] > span:last-child { display: none }`, which depends on
the label being the item's last child.

**Proposal:** `labels?: 'visible' | 'hidden'` on `BottomNav` (default
`visible`). When `hidden`, render the label visually hidden, keep `aria-label`,
and tighten the item and pill sizing to suit icons alone.

---

## 2. IconButton: `secondary` variant (and a `glass` one)

**Need:** a round icon button in the secondary button style, and a glass style
for buttons set over photographs.

**Today:** sans re-points IconButton's private ghost tokens
(`--dt-button-ghost-bg`, `-hover`, `-active`, `--dt-button-ghost-fg`) on the
button through `.icon-secondary` and `.icon-glass` classes.

**Proposal:** `variant?: 'ghost' | 'solid' | 'secondary' | 'glass'`, mirroring
Button's secondary tokens and the glass surface tokens used by `Card`
`surface="glass-strong"`.

---

## 3. Card: full-bleed media

**Need:** a card whose `media` runs to the card's top and side edges, with the
card's top radius, while the text keeps its padding.

**Today:** sans wraps the media in
`margin: calc(-1 * var(--dt-card-padding)) calc(-1 * var(--dt-card-padding)) 0`
and sets `overflow: hidden` on the card through `style`.

**Proposal:** `mediaBleed?: boolean` on `Card` (or `media` placement
`'inset' | 'bleed'`).

---

## 4. Sheet: toggle chips in `actions`, and a pinned footer at the bottom

**Need:** filter chips that float along the bottom of a sheet and can be on or
off, like `actions`, and a footer that stays at the bottom when content is short.

**Today:** sans puts `Tag` chips in `footer`, then restyles the footer with
`!important` (its styles are inline) to look like the floating `actions` bar,
and makes the sheet a flex column so short content doesn't lift the footer.

**Proposal:**

- `SheetAction.pressed?: boolean`, rendered with `aria-pressed` and the
  selected chip style, so `actions` can hold toggles (and the "primary: one at
  most" guidance doesn't apply to them).
- Pin `footer` and `actions` to the bottom of the panel regardless of content
  height, for sheets given a fixed height.

---

## 5. Input: 16px text on touch screens by default

**Need:** iOS Safari zooms the page when a field under 16px gets focus.
`--dt-input-font-size` defaults to `--dt-font-size-sm` (under 16px).

**Today:** sans sets `--dt-input-font-size: 16px` under `@media (pointer: coarse)`.

**Proposal:** ship that media query in Dovetail's own styles, so every product
built on it avoids the zoom.

---

## 6. List: no inset on non-interactive rows

**Need:** a plain list whose text lines up with its dividers and the content
edge.

**Today:** every `List` row is padded `--dt-space-inset-sm --dt-space-inset-md`
while the dividers run full width, so static lists (ingredients, where to buy)
look indented by mistake. The inset only earns its place on interactive rows,
where it frames the hover highlight. sans uses its own `SimpleList` for static
lists.

**Proposal:** drop the horizontal inset when `interactive` is false, or add
`inset?: boolean` (default: `interactive`).

---

## 7. Sheet: header divider aligned with the content

**Need:** the sticky header's divider should line up with the content column
(or run edge to edge), not overhang it.

**Today:** the header bar is widened with
`margin: 0 calc(-1 * --dt-space-inset-sm)` and matching padding, so its divider
sticks out past the content on both sides. sans resets it with
`.item-sheet > :first-child { margin-inline: 0 !important; padding-inline: 0 !important }`.

**Proposal:** remove the negative margin (or make the divider span the full
sheet width), and give the header bar a class so it can be styled without
`!important`.


---

## 8. Checkbox and Radio: `labelPosition`

**Need:** settings-style rows with the label first and the box at the end,
like `Switch labelPosition="start"`.

**Today:** sans reverses each row with
`.leading-labels label[for] { flex-direction: row-reverse }`, which depends on
the label holding the box and the text in that order.

**Proposal:** `labelPosition?: 'start' | 'end'` on `Checkbox`, `Radio`,
`CheckboxGroup` and `RadioGroup`, matching `Switch`.

---

## 9. Card: title size

**Need:** a big display title on photo cards, and a step up on small ones.

**Today:** sans re-points `--dt-text-heading-sm-size` and `-line` on the card,
since Card sets its title from those tokens inline.

**Proposal:** `titleSize?: 'sm' | 'md' | 'lg' | 'display'` on `Card`, or a
`--dt-card-title-size` token.

---

## 10. Sheet: title size

**Need:** a display-size title in item sheets.

**Today:** sans re-points `--dt-text-heading-lg-size` and `-line` on the
sheet, since Sheet sets its big title from those tokens inline.

**Proposal:** `titleSize?: 'lg' | 'display'` on `Sheet`, or a
`--dt-sheet-title-size` token.
