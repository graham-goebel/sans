import { unsplash } from './images'
import type { Place, Safety } from './types'

export const safetyLabel: Record<Safety, string> = {
  dedicated: '100% gluten-free',
  'gf-menu': 'Separate GF menu',
  'gf-options': 'GF options',
}

/** The safety label, prefixed "Reported" until the place is verified: "Reported separate GF menu". */
export function safetyText(place: Place): string {
  const label = safetyLabel[place.safety]
  if (place.verification === 'verified') return label
  // Lower-case the first word unless it's an abbreviation like "GF".
  const first = label.split(' ')[0]
  const lowered = first === first.toUpperCase() ? label : label.charAt(0).toLowerCase() + label.slice(1)
  return `Reported ${lowered}`
}

/** One line on how a place handles gluten, e.g. "Reported 100% gluten-free · $$". */
export function placeSummary(place: Place): string {
  const safety = safetyText(place)
  return place.price ? `${safety} · ${place.price}` : safety
}

// Denver places. Map coordinates come from OpenStreetMap Nominatim via
// scripts/geocode.mjs (Sep 2026). All are UNVERIFIED: gathered on 30 Sep 2026 from public
// listings and press (see docs/denver/candidates.md), not yet confirmed with
// the places themselves. Photos are illustrative, not of the businesses.
// Confirm each one using docs/denver/verification.md, then set
// verification: 'verified' and lastChecked.

const RESEARCHED = 'Sep 2026'

// Illustrative photos by kind of place.
const photo = {
  restaurant: [
    unsplash('1414235077428-338989a2e8c0'),
    unsplash('1517248135467-4c7edcad34c4'),
    unsplash('1559339352-11d035aa65de'),
    unsplash('1552566626-52f8b828add9'),
  ],
  cafe: [unsplash('1554118811-1e0d58224f24'), unsplash('1501339847302-ac426a4a7cbb')],
  bakery: [unsplash('1517433670267-08bbd4be890f'), unsplash('1555507036-ab1f4038808a'), unsplash('1509440159596-0249088772ff')],
  market: [unsplash('1542838132-92c53300491e'), unsplash('1604719312566-8912e9227c6a')],
  pizza: unsplash('1513104890138-7c749659a591'),
  tacos: unsplash('1565299585323-38d6b0865b47'),
}

export const places: Place[] = [
  {
    id: 'teocalli-cocina-lohi',
    name: 'Teocalli Cocina',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'LoHi',
    image: photo.tacos,
    safety: 'dedicated',
    dek: 'Reported as a fully gluten-free Mexican kitchen, with corn tortillas throughout.',
    description:
      'Press and gluten-free directories describe a dedicated gluten-free kitchen and a dedicated fryer, with the churros singled out. The LoHi location opened in July 2025 in the former Post Chicken & Beer space.',
    address: '1575 Boulder St, Unit C',
    locations: [{ lat: 39.75918, lng: -105.01094 }],
    order: ['Tacos', 'Tortilla chips', 'Churros'],
    precautions: [
      { kind: 'dedicated-kitchen', text: 'Dedicated gluten-free kitchen' },
      { kind: 'dedicated-fryer', text: 'Dedicated gluten-free fryer' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Teocalli Cocina', url: 'https://www.teocallicocina.com/lohi' },
      { label: 'Westword, Jul 2025', url: 'https://www.westword.com/food-drink/teocalli-cocina-opens-fourth-restaurant-in-denvers-lohi-25099551/' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/teocalli-cocina/6068257079820288' },
    ],
  },
  {
    id: 'just-be-kitchen-lohi',
    name: 'Just BE Kitchen',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'LoHi',
    image: photo.restaurant[0],
    safety: 'dedicated',
    dek: 'Reported as a 100% gluten-free, paleo kitchen; Westword readers’ pick for best gluten-free restaurant in 2025.',
    description:
      '303 Magazine (Jan 2026) describes a fully dedicated gluten-free kitchen, and its menu is listed as free of gluten and grains. Its Tech Center location is reported closed; this is the LoHi one.',
    address: '2364 15th St',
    locations: [{ lat: 39.75607, lng: -105.00914 }],
    order: ['Breakfast burrito with pork green chile', 'Cauliflower wings', 'Almond-flour French toast'],
    precautions: [{ kind: 'dedicated-kitchen', text: 'Fully dedicated gluten-free kitchen' }],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Just BE Kitchen', url: 'https://www.justbekitchen.com/media-about-us' },
      { label: '303 Magazine, Jan 2026', url: 'https://303magazine.com/2026/01/a-neighborhood-guide-to-denvers-best-vegan-gluten-free-spots/' },
      { label: 'Westword Readers’ Choice 2025', url: 'https://www.westword.com/best-of-denver/2025/readers-choice/best-gluten-free-restaurant-24106577/' },
    ],
  },
  {
    id: 'quiero-arepas-avanti',
    name: 'Quiero Arepas',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'LoHi · Avanti food hall',
    image: photo.restaurant[1],
    safety: 'dedicated',
    dek: 'Venezuelan arepas from a menu reported as 100% gluten-free, inside the Avanti food hall.',
    description:
      'Listed as a fully gluten-free menu, and described as the first food truck in the US certified gluten-free. It trades inside a shared food hall, so ask whether it has its own enclosed kitchen and fryer.',
    address: '3200 N Pecos St',
    locations: [{ lat: 39.76225, lng: -105.00612 }],
    order: ['Arepas', 'Sweet fried plantains', 'Passion fruit juice'],
    precautions: [
      { kind: 'dedicated-kitchen', text: 'Gluten-free menu and kitchen' },
      { kind: 'ask', text: 'Shared food-hall seating; ask about its own kitchen and fryer' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Toast menu', url: 'https://www.toasttab.com/local/order/quiero-arepas-avanti-3200-north-pecos-street/r-5b38d24d-914e-49e8-b12a-c0f5eb9179fc' },
      { label: 'National Celiac Association', url: 'https://nationalceliac.org/directory/listing/quiero-arepas-avanti-denver' },
    ],
  },
  {
    id: 'moore-bakery',
    name: 'Moore. Bakery & Cafe',
    type: 'bakery',
    city: 'Denver',
    neighborhood: 'Five Points',
    image: photo.bakery[0],
    safety: 'dedicated',
    dek: 'Reported as a dedicated gluten-free bakery for donuts, bagels and cinnamon rolls.',
    description:
      'Listed by Find Me Gluten Free and Denver Celiacs as a dedicated gluten-free bakery. It opened a Lakewood shop (3140 S Wadsworth Blvd) in May 2026; confirm which locations are currently open.',
    address: '3331 N Downing St',
    locations: [{ label: 'Downing St', lat: 39.76396, lng: -104.97344 }, { label: 'Lakewood', lat: 39.66159, lng: -105.08133 }],
    order: ['Donuts', 'Bagels', 'Cinnamon rolls', 'Breakfast sandwiches'],
    precautions: [
      { kind: 'dedicated-kitchen', text: 'Dedicated gluten-free bakery' },
      { kind: 'ask', text: 'Locations have changed recently; check before you go' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Moore Bread Bakery', url: 'https://www.moorebreadbakery.com/' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/moore-bakery-and-cafe/5736398455439360' },
      { label: 'Denver Celiacs', url: 'https://denverceliacs.org/item/moore-bread-bakery/' },
    ],
  },
  {
    id: 'rivers-and-roads-coffee',
    name: 'Rivers and Roads Coffee',
    type: 'cafe',
    city: 'Denver',
    neighborhood: 'Clayton',
    image: photo.cafe[0],
    safety: 'dedicated',
    dek: 'A coffee shop reported to run an entirely gluten-free kitchen.',
    description:
      'Celiac-focused directories describe a fully gluten-free facility, with breakfast sandwiches on house-made gluten-free bread.',
    address: '2539 E Bruce Randolph Ave',
    locations: [{ lat: 39.76465, lng: -104.95632 }],
    order: ['Breakfast sandwich on GF bread', 'Strawberry donut holes'],
    precautions: [{ kind: 'dedicated-kitchen', text: 'Entirely gluten-free kitchen' }],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Rivers and Roads Coffee', url: 'https://www.riversandroadscoffee.com/' },
      { label: 'National Celiac Association', url: 'https://nationalceliac.org/directory/listing/rivers-and-roads-coffee' },
      { label: 'The Celiac MD', url: 'https://theceliacmd.com/location/rivers-and-roads-coffee/' },
    ],
  },
  {
    id: 'green-bus-cafe',
    name: 'Green Bus Cafe',
    type: 'cafe',
    city: 'Denver',
    neighborhood: 'City Park West',
    image: photo.cafe[1],
    safety: 'dedicated',
    dek: 'A vegetarian café with an in-house micro-bakery, reported as 100% gluten-free.',
    description:
      'The owner is quoted as saying the café is 100% gluten-free and sources only certified gluten-free ingredients. Its Starfish Bakery bakes are described as gluten-free and vegan.',
    address: '1426 E 22nd Ave',
    hours: 'Wed–Sun · 8am–2pm (reported)',
    locations: [{ lat: 39.74931, lng: -104.97014 }],
    order: ['Scones', 'Cookies', 'Cinnamon rolls (Sundays)', 'Donuts (Saturdays)'],
    precautions: [
      { kind: 'dedicated-kitchen', text: '100% gluten-free, per the owner' },
      { kind: 'checked', text: 'Uses only certified gluten-free ingredients, per the owner' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Green Bus Cafe', url: 'https://www.greenbuscafe.com/locations-menus' },
      { label: 'Starfish Bakery', url: 'https://starfishbysarah.com/' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/green-bus-cafe/5960486418251776' },
    ],
  },
  {
    id: 'blue-hummingbird-gf',
    name: 'Blue Hummingbird GF Foods',
    type: 'bakery',
    city: 'Denver',
    neighborhood: 'Southeast Denver',
    image: photo.bakery[2],
    safety: 'dedicated',
    dek: 'Formerly Deby’s Gluten Free: a dedicated gluten-free bakery, reported peanut-free too.',
    description:
      'Described as a 100% gluten-free bakery, also peanut-free, with colour-coded labels for other allergens. It changed its name from Deby’s Gluten Free; confirm the retail counter is open.',
    address: '2369 S Trenton Way',
    locations: [{ lat: 39.67321, lng: -104.89712 }],
    order: ['Bagels', 'English muffins', 'Bread', 'Pizza dough'],
    precautions: [
      { kind: 'dedicated-kitchen', text: '100% gluten-free, peanut-free bakery' },
      { kind: 'checked', text: 'Colour-coded labels for other allergens' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'The Celiac MD', url: 'https://theceliacmd.com/location/debys-gluten-free/' },
      { label: 'Good For You Gluten Free', url: 'https://www.goodforyouglutenfree.com/gluten-free-bakeries-in-denver/' },
    ],
  },
  {
    id: 'sweet-izzy',
    name: 'Sweet Izzy',
    type: 'cafe',
    city: 'Denver',
    neighborhood: 'Cherry Creek North',
    image: photo.cafe[0],
    safety: 'dedicated',
    dek: 'Plant-based ice cream and soft serve, reported as entirely gluten-free.',
    description:
      'Listed as a dedicated gluten-free ice cream shop where everything is plant-based and gluten-free. Cones and shakes are reported gluten-free too; ask about mix-ins.',
    address: '3003 E 3rd Ave',
    locations: [{ lat: 39.7212, lng: -104.95186 }],
    order: ['Cookies & cream', 'Cookie dough', 'Soft serve'],
    precautions: [
      { kind: 'dedicated-kitchen', text: 'Dedicated gluten-free shop' },
      { kind: 'ask', text: 'Confirm cones and cookie mix-ins' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Westword', url: 'https://www.westword.com/food-drink/sweet-izzys-vegan-gluten-free-ice-cream-shop-opening-cherry-creek-north-18026961/' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/sweet-izzy/6008371674742784' },
    ],
  },
  {
    id: 'vital-root',
    name: 'Vital Root',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'Tennyson St',
    image: photo.restaurant[2],
    safety: 'dedicated',
    dek: 'Fast-casual, plant-forward food from a kitchen reported as a certified gluten-free facility.',
    description:
      'Listings describe a certified gluten-free facility, but reports conflict on the current menu and one source lists it as closed. Treat as a lead until confirmed.',
    address: '3915 Tennyson St',
    locations: [{ lat: 39.77146, lng: -105.04423 }],
    order: [],
    precautions: [
      { kind: 'dedicated-kitchen', text: 'Reported certified gluten-free facility' },
      { kind: 'ask', text: 'Conflicting reports on menu and whether it’s open' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Tock', url: 'https://www.exploretock.com/vitalroot/' },
      { label: 'National Celiac Association', url: 'https://nationalceliac.org/directory/listing/vital-root' },
    ],
  },
  {
    id: 'acova',
    name: 'Acova',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'LoHi',
    image: photo.restaurant[3],
    safety: 'gf-menu',
    dek: 'A neighbourhood restaurant reported to be about 96% celiac-safe, run by a family who live with coeliac disease.',
    description:
      'Guides describe separate gluten-free prep areas, dedicated fryers and more than 40 gluten-free dishes. A co-owner and her son have coeliac disease.',
    address: '3651 Navajo St',
    locations: [{ lat: 39.76774, lng: -105.00437 }],
    order: ['Fish and chips', 'Artichoke heart fritters', 'Lobster mac and cheese'],
    precautions: [
      { kind: 'separate-prep', text: 'Separate gluten-free prep area' },
      { kind: 'dedicated-fryer', text: 'Dedicated gluten-free fryer' },
      { kind: 'separate-toaster', text: 'Dedicated panini press' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Good For You Gluten Free', url: 'https://www.goodforyouglutenfree.com/the-best-gluten-free-restaurants-in-denver/' },
      { label: 'DiningOut', url: 'https://diningout.com/denver/five-restaurants-in-denver-with-a-dedicated-gluten-free-fryer/' },
      { label: '5280', url: 'https://5280.com/best-gluten-free-restaurants-in-denver/' },
    ],
  },
  {
    id: 'federal-bar-and-grill',
    name: 'Federal Bar & Grill',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'Jefferson Park',
    image: photo.restaurant[0],
    safety: 'gf-menu',
    dek: 'Bar food with a gluten-free side of the kitchen, reportedly run by celiac owners.',
    description:
      'Reviews describe a gluten-free side of the kitchen and gluten-free fryers, and nearly the whole menu available gluten-free. Orders are reported to be flagged as allergy orders.',
    address: '2544 Federal Blvd',
    locations: [{ lat: 39.75449, lng: -105.02487 }],
    order: ['Fish & chips', 'Wings', 'Fried chicken', 'Burgers on GF buns'],
    precautions: [
      { kind: 'separate-prep', text: 'Gluten-free side of the kitchen' },
      { kind: 'dedicated-fryer', text: 'Gluten-free fryers' },
      { kind: 'trained-staff', text: 'Orders flagged as allergy orders' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Federal Bar & Grill', url: 'https://www.thefedbar.com/about-us/' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/federal-bar-and-grill/52111003' },
    ],
  },
  {
    id: 'dough-counter',
    name: 'Dough Counter',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'South Colorado Blvd',
    image: photo.pizza,
    safety: 'gf-menu',
    dek: 'Sicilian-style pizza with a gluten-free dough reported to be made on dedicated equipment.',
    description:
      'Reviews describe dedicated pans, separate prep and dedicated fryers, but reports conflict on whether the oven is shared. One report says the gluten-free dough uses gluten-removed wheat starch, which many people with coeliac disease avoid.',
    address: '2466 S Colorado Blvd, Unit 101',
    locations: [{ lat: 39.67157, lng: -104.94013 }],
    order: ['GF Sicilian pan pizza', 'Chicken strips', 'Fries'],
    precautions: [
      { kind: 'separate-prep', text: 'Dedicated pans and separate prep for GF pizza' },
      { kind: 'dedicated-fryer', text: 'Dedicated fryers' },
      { kind: 'ask', text: 'Ask whether the GF dough contains wheat starch' },
      { kind: 'ask', text: 'Reports conflict on a shared oven' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Toast menu', url: 'https://www.toasttab.com/local/order/dough-counter-2466-south-colorado-boulevard' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/dough-counter/6724407566925824' },
    ],
  },
  {
    id: 'difrancos',
    name: 'DiFranco’s',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'Capitol Hill',
    image: photo.restaurant[1],
    safety: 'gf-menu',
    dek: 'An Italian spot with a gluten-free menu and, reportedly, its own pot and water for gluten-free pasta.',
    description:
      'Not a dedicated kitchen, but reviewers report a separate pot and water for gluten-free pasta and staff familiar with avoiding cross-contact.',
    address: '955 N Lincoln St, Unit D',
    locations: [{ lat: 39.73118, lng: -104.98633 }],
    order: ['Pasta with GF noodles', 'GF bread', 'Cannoli'],
    precautions: [
      { kind: 'separate-water', text: 'Separate pot and water for gluten-free pasta' },
      { kind: 'trained-staff', text: 'Staff familiar with cross-contact' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/difrancos/5675967985614848' },
      { label: 'Yelp', url: 'https://www.yelp.com/biz/difranco-s-denver' },
    ],
  },
  {
    id: 'birdcall',
    name: 'Birdcall',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'Several locations',
    image: photo.restaurant[2],
    safety: 'gf-menu',
    dek: 'Fast-casual chicken, with gluten-free nuggets and fries reported to use a dedicated fryer.',
    description:
      'Gluten-free nuggets and fries are reported to go only into a dedicated fryer, and gluten-free buns are available. Ask how the grill and bun toasting are handled, and confirm which Denver locations are open.',
    address: 'Several Denver locations',
    locations: [{ label: 'Union Station', lat: 39.75476, lng: -105.00166 }, { label: 'Evans Ave', lat: 39.67875, lng: -104.96897 }, { label: '26th Ave', lat: 39.7545, lng: -104.9767 }, { label: 'Hampden Ave', lat: 39.65268, lng: -104.92887 }],
    order: ['Chicken nuggets', 'Fries', 'Grilled chicken sandwich on a GF bun'],
    precautions: [
      { kind: 'dedicated-fryer', text: 'Dedicated fryer for gluten-free nuggets and fries' },
      { kind: 'ask', text: 'Ask about the grill and bun toasting' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'DiningOut', url: 'https://diningout.com/denver/five-restaurants-in-denver-with-a-dedicated-gluten-free-fryer/' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/chains/5933364193656832/birdcall' },
    ],
  },
  {
    id: 'olive-and-finch',
    name: 'Olive & Finch',
    type: 'cafe',
    city: 'Denver',
    neighborhood: 'Cherry Creek · Uptown',
    image: photo.cafe[1],
    safety: 'gf-options',
    dek: 'A bakery-café with gluten-free items marked on the menu, in a shared kitchen.',
    description:
      'Not a dedicated gluten-free facility. There is reportedly no fryer, and items can be prepared in separate pans on request. Reviews are mixed.',
    address: 'Cherry Creek and Uptown',
    order: ['Pancakes', 'Sandwiches on GF bread', 'Cakes'],
    precautions: [
      { kind: 'marked-menu', text: 'Gluten-free items marked on the menu' },
      { kind: 'separate-prep', text: 'Separate pans on request' },
      { kind: 'ask', text: 'Shared bakery kitchen; mixed reviews' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Olive & Finch', url: 'https://www.oliveandfinch.com/location/olive-finch-cherry-creek/' },
      { label: 'Denver Celiacs', url: 'https://denverceliacs.org/item/olive-finch-eatery-cherry-creek/' },
    ],
  },
  {
    id: 'watercourse-foods',
    name: 'Watercourse Foods',
    type: 'restaurant',
    city: 'Denver',
    neighborhood: 'Uptown',
    image: photo.restaurant[3],
    safety: 'gf-options',
    dek: 'A long-running vegan restaurant with clearly labelled gluten-free options.',
    description:
      'Not a dedicated kitchen. Gluten-free items are labelled, and reviewers describe glove changes and orders flagged to the kitchen.',
    address: '837 E 17th Ave',
    locations: [{ lat: 39.74349, lng: -104.97666 }],
    order: ['GF desserts', 'GF cookies'],
    precautions: [
      { kind: 'marked-menu', text: 'Gluten-free items labelled on the menu' },
      { kind: 'trained-staff', text: 'Glove changes and orders flagged to the kitchen' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: '303 Magazine, Jan 2026', url: 'https://303magazine.com/2026/01/a-neighborhood-guide-to-denvers-best-vegan-gluten-free-spots/' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/watercourse-foods/60003' },
    ],
  },
  {
    id: 'casa-bonita',
    name: 'Casa Bonita',
    type: 'restaurant',
    city: 'Lakewood',
    neighborhood: 'West Colfax',
    image: photo.restaurant[0],
    safety: 'gf-options',
    dek: 'The famous Lakewood spectacle. Many dishes are marked gluten-free, but reports on cross-contact conflict.',
    description:
      'Most of the menu is reported as marked gluten-free, but a coeliac reviewer reports no dedicated fryer and chips shared with flour tortillas. The sopapillas in the set menu are not gluten-free.',
    address: '6715 W Colfax Ave',
    locations: [{ lat: 39.74194, lng: -105.07103 }],
    order: ['Tacos', 'Enchiladas'],
    precautions: [
      { kind: 'marked-menu', text: 'Many dishes marked gluten-free' },
      { kind: 'shared-fryer', text: 'Reported shared fryer: chips with flour tortillas' },
      { kind: 'ask', text: 'Sopapillas are not gluten-free' },
    ],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Casa Bonita FAQ', url: 'https://www.casabonitadenver.com/faq' },
      { label: 'Good For You Gluten Free', url: 'https://www.goodforyouglutenfree.com/gluten-free-casa-bonita/' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/biz/casa-bonita/6114381749944320' },
    ],
  },
  {
    id: 'natural-grocers',
    name: 'Natural Grocers',
    type: 'market',
    city: 'Denver',
    neighborhood: 'RiNo · Leetsdale',
    image: photo.market[0],
    safety: 'gf-options',
    dek: 'A Colorado grocer with gluten-free shelf labels and its own certified gluten-free mixes and pasta.',
    description:
      'Shoppers report gluten-free labels at the price tag. The store brand includes certified gluten-free baking mixes and rice and quinoa pasta.',
    address: '3757 Brighton Blvd · 5231 Leetsdale Dr',
    locations: [{ label: 'Brighton Blvd', lat: 39.77293, lng: -104.97591 }, { label: 'Leetsdale Dr', lat: 39.70844, lng: -104.9255 }],
    order: ['Store-brand GF baking mixes', 'Certified GF pasta'],
    precautions: [{ kind: 'checked', text: 'Gluten-free shelf labels' }],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Natural Grocers', url: 'https://www.naturalgrocers.com/natural-grocers-brand-gluten-free-baking-mixes' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/chains/58002/natural-grocers' },
    ],
  },
  {
    id: 'sprouts',
    name: 'Sprouts Farmers Market',
    type: 'market',
    city: 'Denver',
    neighborhood: 'Several stores',
    image: photo.market[1],
    safety: 'gf-options',
    dek: 'A grocer with gluten-free shelf tags throughout the store.',
    description: 'Shoppers report gluten-free tags on the shelves, and the online shop can filter by gluten-free.',
    address: 'Several Denver stores',
    order: [],
    precautions: [{ kind: 'checked', text: 'Gluten-free shelf tags' }],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Sprouts gluten-free', url: 'https://shop.sprouts.com/shop/categories?tags=gluten_free' },
      { label: 'Find Me Gluten Free', url: 'https://www.findmeglutenfree.com/chains/sprouts' },
    ],
  },
  {
    id: 'gf-farmers-market',
    name: 'Gluten Free Farmers Market',
    type: 'market',
    city: 'Englewood',
    neighborhood: 'Hampden Ave',
    image: photo.market[0],
    safety: 'dedicated',
    dek: 'A seasonal market run by NCA Denver Celiacs, with strict rules so every vendor is gluten-free.',
    description:
      'Held outdoors on the second Saturday of the month, June to October. Organisers set strict requirements for vendors. Past vendors include Bosco Baking Co and SugarBee Cookie Company.',
    address: 'North lot by Chase Tower, 333 W Hampden Ave',
    hours: '2nd Saturday, Jun–Oct · 9am–1pm (reported)',
    locations: [{ lat: 39.65357, lng: -104.99243 }],
    order: ['Baked goods', 'Cookies', 'Mexican food'],
    precautions: [{ kind: 'checked', text: 'Organisers vet every vendor as gluten-free' }],
    verification: 'unverified',
    researched: RESEARCHED,
    sources: [
      { label: 'Westword', url: 'https://www.westword.com/food-drink/denver-celiacs-gluten-free-farmers-market-25198224/' },
      { label: 'NCA event listing', url: 'https://nationalceliac.org/event/nca-denver-chapter-gluten-free-farmers-market/2026-07-11/' },
      { label: 'Denver Celiacs', url: 'https://denverceliacs.org/' },
    ],
  },
]
