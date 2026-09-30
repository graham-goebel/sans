export type Trait = 'dairy-free' | 'vegan' | 'nut-free' | 'egg-free'

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
}

export type Safety = 'dedicated' | 'gf-menu' | 'gf-options'

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
}
