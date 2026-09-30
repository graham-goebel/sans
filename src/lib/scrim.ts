import type { CSSProperties } from 'react'
import type { Place, Product, Recipe } from '../data/types'

/**
 * The scrim palette: deep, desaturated tones laid over header photos so each
 * page has its own colour while white type stays readable. Defined in
 * theme.css as --scrim-<tone>.
 */
export type ScrimTone = 'olive' | 'terracotta' | 'clay' | 'sage' | 'plum' | 'ink' | 'honey' | 'sky'

const recipeTone: Record<Recipe['category'], ScrimTone> = {
  breakfast: 'honey',
  mains: 'terracotta',
  baking: 'clay',
  desserts: 'plum',
  quick: 'sage',
}

const productTone: Record<Product['category'], ScrimTone> = {
  bread: 'clay',
  pasta: 'terracotta',
  snacks: 'honey',
  baking: 'sage',
  sweets: 'plum',
  breakfast: 'honey',
}

// Places read by how they handle gluten: olive for dedicated kitchens, sky
// for separate menus, ink for "options" in a shared kitchen.
const placeTone: Record<Place['safety'], ScrimTone> = {
  dedicated: 'olive',
  'gf-menu': 'sky',
  'gf-options': 'ink',
}

export const scrimFor = {
  recipe: (r: Recipe) => recipeTone[r.category],
  product: (p: Product) => productTone[p.category],
  place: (p: Place) => placeTone[p.safety],
}

/** Style that points a photo's scrim at a tone. */
export const scrimStyle = (tone: ScrimTone) => ({ '--scrim': `var(--scrim-${tone})` }) as CSSProperties
