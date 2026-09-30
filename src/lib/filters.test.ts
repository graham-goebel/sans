import { describe, expect, it } from 'vitest'
import { places } from '../data/places'
import { products } from '../data/products'
import { recipes } from '../data/recipes'
import { matchesPlace, matchesProduct, matchesRecipe } from './filters'

describe('recipe filters', () => {
  it('shows everything with no chips on', () => {
    expect(recipes.filter((r) => matchesRecipe(r, []))).toHaveLength(recipes.length)
  })

  it('widens across categories', () => {
    const shown = recipes.filter((r) => matchesRecipe(r, ['breakfast', 'desserts']))
    expect(shown.length).toBeGreaterThan(0)
    expect(shown.every((r) => r.category === 'breakfast' || r.category === 'desserts')).toBe(true)
  })

  it('narrows by diet and time', () => {
    const shown = recipes.filter((r) => matchesRecipe(r, ['vegan', 'quick']))
    expect(shown.every((r) => r.traits.includes('vegan') && r.minutes <= 30)).toBe(true)
  })
})

describe('product filters', () => {
  it('keeps only certified products', () => {
    const shown = products.filter((p) => matchesProduct(p, ['certified']))
    expect(shown.length).toBeLessThan(products.length)
    expect(shown.every((p) => p.certified)).toBe(true)
  })
})

describe('place filters', () => {
  it('widens across types and safety levels', () => {
    const shown = places.filter((p) => matchesPlace(p, ['bakery', 'dedicated']))
    expect(shown.every((p) => p.type === 'bakery')).toBe(true)
    expect(shown.every((p) => p.safety === 'dedicated')).toBe(true)
  })
})

describe('sample data', () => {
  it('gives every place a last-checked date and at least one precaution', () => {
    for (const p of places) {
      expect(p.lastChecked, p.id).toMatch(/^[A-Z][a-z]{2} \d{4}$/)
      expect(p.precautions.length, p.id).toBeGreaterThan(0)
    }
  })

  it('uses unique ids', () => {
    for (const list of [places, products, recipes]) {
      const ids = list.map((x) => x.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})
