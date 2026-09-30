export type Trait = 'wheat-free' | 'dairy-free' | 'vegan' | 'nut-free' | 'egg-free'

/** Editorial flags shown as icon chips on cards: trending now, or a standout pick. */
export type Flag = 'hot' | 'mvp'

export interface Product {
  id: string
  name: string
  brand: string
  category: 'bread' | 'pasta' | 'snacks' | 'baking' | 'sweets' | 'breakfast'
  price: string
  image: string
  /** Carries a third-party gluten-free certification mark. */
  certified: boolean
  traits: Trait[]
  rating: number
  dek: string
  description: string
  whereToBuy: string[]
  flags?: Flag[]
  /**
   * A featured partner: its card shows this logo, centred over the photo,
   * instead of the title. Use only a logo the brand has given us.
   */
  featured?: { logo: string }
}

export interface Recipe {
  id: string
  title: string
  category: 'breakfast' | 'mains' | 'baking' | 'desserts' | 'quick'
  image: string
  minutes: number
  serves: number
  difficulty: 'Easy' | 'Medium' | 'Weekend project'
  traits: Trait[]
  dek: string
  ingredients: string[]
  steps: string[]
  flags?: Flag[]
  /**
   * A partner-sponsored recipe: its card shows the partner's logo, centred
   * over the photo, instead of the title. Use only a logo the brand has given us.
   */
  featured?: { logo: string }
}

export type Safety = 'dedicated' | 'gf-menu' | 'gf-options'

export type PrecautionKind =
  | 'dedicated-kitchen'
  | 'dedicated-fryer'
  | 'shared-fryer'
  | 'separate-prep'
  | 'separate-water'
  | 'separate-toaster'
  | 'marked-menu'
  | 'checked'
  | 'sealed'
  | 'trained-staff'
  | 'ask'

export interface Precaution {
  kind: PrecautionKind
  text: string
}

export interface Source {
  label: string
  url: string
}

export interface PlaceLocation {
  lat: number
  lng: number
  /** Needed when a place has more than one location, e.g. "Lakewood". */
  label?: string
}

export interface Place {
  id: string
  name: string
  type: 'restaurant' | 'cafe' | 'bakery' | 'market'
  city: string
  neighborhood: string
  /** An illustrative photo unless the place has given us its own. */
  image: string
  safety: Safety
  dek: string
  description: string
  address: string
  /** Map pins. Omit for places without a fixed address; they stay off the map. */
  locations?: PlaceLocation[]
  hours?: string
  price?: '$' | '$$' | '$$$'
  rating?: number
  /** Dishes reported (or, once verified, confirmed) as gluten-free. */
  order: string[]
  precautions: Precaution[]
  /**
   * unverified: gathered from public listings and press, not yet confirmed
   * with the place. verified: confirmed directly with the place (see
   * docs/CONTENT.md). The app labels unverified places everywhere they appear.
   */
  verification: 'unverified' | 'verified'
  /** Month the public sources were read, e.g. "Sep 2026". Unverified places. */
  researched?: string
  /** Month the details were confirmed with the place. Verified places. */
  lastChecked?: string
  /** Where the details came from: the place's own site first. */
  sources: Source[]
  flags?: Flag[]
  /**
   * A featured partner: its card shows this logo, centred over the photo,
   * instead of the title. Use only a logo the brand has given us.
   */
  featured?: { logo: string }
}

export interface Review {
  name: string
  /** Out of five. */
  rating: number
  date: string
  text: string
}
