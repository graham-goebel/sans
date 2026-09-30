# Verifying Denver places

Work down the tracker in order. The top rows are the likeliest to make the cut
(dedicated kitchens with several agreeing sources), so a first batch of about
10 confirmed places is enough for a soft launch.

A place is **verified** only when a person has confirmed it directly with the
business (phone, email or visit) within the last six months. Research,
reviews and directories are leads, not confirmation.

## Call script

> Hi, I'm putting together a gluten-free guide to Denver called sans, and I'd
> love to include you. Could I check a few details? It takes about five
> minutes.

1. **Still open at this address?** Hours?
2. **Safety level:** Is your whole kitchen gluten-free, or do you also cook
   with wheat?
   - All gluten-free → `dedicated`
   - Shared kitchen with a separate GF menu and real precautions → `gf-menu`
   - Some dishes are GF as made; cross-contact possible → `gf-options`
3. **Precautions:** ask about each one that applies:
   - Dedicated fryer? (If fries or chips are GF, are they fried alone?)
   - Separate prep area, boards, utensils?
   - Separate pasta pot and water? Toaster? Pizza oven or pans?
   - Do bakes arrive sealed from a dedicated bakery?
   - How do staff flag a GF order to the kitchen?
4. **Ingredients to double-check:** wheat starch (even "gluten-removed"),
   malt, barley miso, soy sauce vs tamari, beer in sauces or batter, oats.
5. **What would you recommend** a coeliac customer order?
6. **Photos:** May sans use photos of your food and space? Can you send some,
   or may we take our own? How should we credit them?
7. **Best contact** for updates, and would you tell us if anything changes?

Write down who you spoke to and the date.

## Tracker

Status: `to do` → `contacted` → `verified` / `not listing` (and why).

| # | Place | Claimed | Key things to confirm | Status | Checked on | Spoke with |
|---|---|---|---|---|---|---|
| 1 | Teocalli Cocina (LoHi) | dedicated | Dedicated fryer; hours | to do | | |
| 2 | Just BE Kitchen (LoHi) | dedicated | Dedicated fryer; LoHi only | to do | | |
| 3 | Moore. Bakery & Cafe | dedicated | Which storefronts are open (Downing St? Lakewood?) | to do | | |
| 4 | Green Bus Cafe | dedicated | Certified-GF ingredients; hours | to do | | |
| 5 | Rivers and Roads Coffee | dedicated | Still open; any fryer | to do | | |
| 6 | Quiero Arepas (Avanti) | dedicated | Own enclosed kitchen and fryer in the food hall | to do | | |
| 7 | Blue Hummingbird GF Foods | dedicated | New ownership; retail counter open | to do | | |
| 8 | Sweet Izzy | dedicated | Cones and mix-ins GF | to do | | |
| 9 | Acova | gf-menu | Still open; separate prep; dedicated fryer and panini press | to do | | |
| 10 | Federal Bar & Grill | gf-menu | GF side of kitchen; dedicated fryers | to do | | |
| 11 | DiFranco's | gf-menu | Separate pasta pot and water | to do | | |
| 12 | Birdcall | gf-menu | Which locations; grill and bun toasting | to do | | |
| 13 | Vital Root | dedicated? | Open or closed; certifier; current menu | to do | | |
| 14 | Dough Counter | gf-menu | Wheat-starch dough?; oven | to do | | |
| 15 | Watercourse Foods | gf-options | Labelled menu; kitchen process | to do | | |
| 16 | Olive & Finch | gf-options | Separate pans; which locations | to do | | |
| 17 | Casa Bonita | disputed | Fryer; chips vs flour tortillas | to do | | |
| 18 | Natural Grocers | market | Store addresses; GF shelf tags | to do | | |
| 19 | Sprouts | market | Pick 1–2 stores; GF shelf tags | to do | | |
| 20 | GF Farmers Market | event | 2026/2027 dates; vendor list | to do | | |

Full notes and sources for each: [candidates.md](candidates.md).

## From verified to live

For each verified place, add an entry to `src/data/places.ts` (see
[CONTENT.md](../CONTENT.md)) with:

- `lastChecked` set to the month you confirmed it
- `sources`: the place's own website, plus anything you relied on
- precautions worded from what they told you
- a photo you have permission to use

When enough Denver places are verified, remove the sample places and set
`site.sampleContent` to `false`.
