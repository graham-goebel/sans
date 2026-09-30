import type { Place, PlaceLocation } from '../data/types'

export interface LatLng {
  lat: number
  lng: number
}

const EARTH_RADIUS_MILES = 3958.8
const rad = (deg: number) => (deg * Math.PI) / 180

/** Straight-line distance in miles between two points (haversine). */
export function milesBetween(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h))
}

/** A place's location closest to a point, and how far it is. Undefined for places without a pin. */
export function nearestLocation(place: Place, from: LatLng): { location: PlaceLocation; miles: number } | undefined {
  let best: { location: PlaceLocation; miles: number } | undefined
  for (const location of place.locations ?? []) {
    const miles = milesBetween(from, location)
    if (!best || miles < best.miles) best = { location, miles }
  }
  return best
}

/** "0.4 mi", "3 mi", "12 mi". */
export function formatMiles(miles: number): string {
  if (miles < 10) return `${miles.toFixed(1).replace(/\.0$/, '')} mi`
  return `${Math.round(miles)} mi`
}

/** Places sorted nearest first; places without a pin go last, in their original order. */
export function byDistance(places: Place[], from: LatLng): Place[] {
  const distance = (p: Place) => nearestLocation(p, from)?.miles ?? Infinity
  return [...places].sort((a, b) => distance(a) - distance(b))
}

/** Downtown Denver (Union Station), where the map opens before it knows where you are. */
export const DENVER: LatLng = { lat: 39.7527, lng: -105.0001 }
