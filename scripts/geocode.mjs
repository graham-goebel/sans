// Looks up coordinates for place addresses with OpenStreetMap's Nominatim,
// for the map. Run it where the network allows (the "Geocode" workflow does),
// then copy the printed coordinates into src/data/places.ts and check each
// one against the address.
//
//   node scripts/geocode.mjs
//
// Nominatim's usage policy: at most one request a second, with a real
// User-Agent. Keep the list short and run it only when places change.

const addresses = [
  ['teocalli-cocina-lohi', '1575 Boulder St, Denver, CO'],
  ['just-be-kitchen-lohi', '2364 15th St, Denver, CO'],
  ['quiero-arepas-avanti', '3200 Pecos St, Denver, CO'],
  ['moore-bakery', '3331 Downing St, Denver, CO'],
  ['moore-bakery', '3140 S Wadsworth Blvd, Lakewood, CO'],
  ['rivers-and-roads-coffee', '2539 E Bruce Randolph Ave, Denver, CO'],
  ['green-bus-cafe', '1426 E 22nd Ave, Denver, CO'],
  ['blue-hummingbird-gf', '2369 S Trenton Way, Denver, CO'],
  ['sweet-izzy', '3003 E 3rd Ave, Denver, CO'],
  ['vital-root', '3915 Tennyson St, Denver, CO'],
  ['acova', '3651 Navajo St, Denver, CO'],
  ['federal-bar-and-grill', '2544 Federal Blvd, Denver, CO'],
  ['dough-counter', '2466 S Colorado Blvd, Denver, CO'],
  ['difrancos', '955 Lincoln St, Denver, CO'],
  ['birdcall', '1701 Wewatta St, Denver, CO'],
  ['birdcall', '1535 E Evans Ave, Denver, CO'],
  ['birdcall', '800 E 26th Ave, Denver, CO'],
  ['birdcall', '4996 E Hampden Ave, Denver, CO'],
  ['watercourse-foods', '837 E 17th Ave, Denver, CO'],
  ['casa-bonita', '6715 W Colfax Ave, Lakewood, CO'],
  ['natural-grocers', '3757 Brighton Blvd, Denver, CO'],
  ['natural-grocers', '5231 Leetsdale Dr, Denver, CO'],
  ['gf-farmers-market', '333 W Hampden Ave, Englewood, CO'],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const results = []

for (const [id, address] of addresses) {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.search = new URLSearchParams({ q: address, format: 'jsonv2', limit: '1', countrycodes: 'us' })
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'sans-gluten-free-guide/0.1 (https://github.com/graham-goebel/sans)' },
      signal: AbortSignal.timeout(15_000),
    })
    const [hit] = await res.json()
    results.push(
      hit
        ? { id, address, lat: Number(Number(hit.lat).toFixed(5)), lng: Number(Number(hit.lon).toFixed(5)), match: hit.display_name, kind: hit.addresstype ?? hit.type }
        : { id, address, lat: null, lng: null, match: 'NO MATCH' },
    )
  } catch (error) {
    results.push({ id, address, lat: null, lng: null, match: `ERROR ${error}` })
  }
  await sleep(1100)
}

for (const r of results) console.log(`${r.id} | ${r.address} | ${r.lat}, ${r.lng} | ${r.kind ?? ''} | ${r.match}`)
console.log('\nJSON:')
console.log(JSON.stringify(results.map(({ id, address, lat, lng }) => ({ id, address, lat, lng }))))
