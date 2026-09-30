import { traitLabel } from '../data/traits'
import type { Place, Product, Recipe, Trait } from '../data/types'

export type RecipeFilter = Recipe['category'] | Trait

const recipeCategories = new Set<string>(['breakfast', 'mains', 'baking', 'desserts'])

/** Categories widen the list (any of them); "Under 30 min" and diet chips narrow it (all of them). */
export function matchesRecipe(recipe: Recipe, selected: RecipeFilter[]) {
  const picked = selected.filter((f) => recipeCategories.has(f))
  if (picked.length > 0 && !picked.includes(recipe.category)) return false
  if (selected.includes('quick') && recipe.minutes > 30) return false
  return selected.filter((f): f is Trait => f in traitLabel).every((t) => recipe.traits.includes(t))
}

export type ProductFilter = Product['category'] | 'certified' | Trait

const productCategories = new Set<string>(['bread', 'pasta', 'snacks', 'baking', 'sweets', 'breakfast'])

/** Categories widen the list (any of them); certification and diet chips narrow it (all of them). */
export function matchesProduct(product: Product, selected: ProductFilter[]) {
  const picked = selected.filter((f) => productCategories.has(f))
  if (picked.length > 0 && !picked.includes(product.category)) return false
  if (selected.includes('certified') && !product.certified) return false
  return selected.filter((f): f is Trait => f in traitLabel).every((t) => product.traits.includes(t))
}

export type PlaceFilter = Place['type'] | 'dedicated' | 'gf-menu'

const placeTypes = new Set<string>(['restaurant', 'cafe', 'bakery', 'market'])
const placeSafeties = new Set<string>(['dedicated', 'gf-menu'])

/** Types widen the list, and so do safety levels: pick either and you see both. */
export function matchesPlace(place: Place, selected: PlaceFilter[]) {
  const pickedTypes = selected.filter((f) => placeTypes.has(f))
  const pickedSafety = selected.filter((f) => placeSafeties.has(f))
  if (pickedTypes.length > 0 && !pickedTypes.includes(place.type)) return false
  if (pickedSafety.length > 0 && !pickedSafety.includes(place.safety as PlaceFilter)) return false
  return true
}
