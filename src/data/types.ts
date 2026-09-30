export type Trait = 'dairy-free' | 'vegan' | 'nut-free' | 'egg-free'

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

export interface Place {
  id: string
  name: string
  type: 'restaurant' | 'cafe' | 'bakery' | 'market'
  city: string
  neighborhood: string
  image: string
  safety: Safety
  price: '$' | '$$' | '$$$'
  rating: number
  dek: string
  description: string
  address: string
  hours: string
  order: string[]
  precautions: Precaution[]
  /** When these details were last confirmed with the place, e.g. "Sep 2026". */
  lastChecked: string
  flags?: Flag[]
}

export interface Review {
  name: string
  /** Out of five. */
  rating: number
  date: string
  text: string
}
