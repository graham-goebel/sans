import { placeSummary, places } from '../data/places'
import { products } from '../data/products'
import { recipes } from '../data/recipes'
import { traitLabel } from '../data/traits'
import type { Place } from '../data/types'

export type Kind = 'recipe' | 'product' | Place['type']

export interface Result {
  id: string
  kind: Kind
  title: string
  detail: string
  image: string
  path: string
  haystack: string
}

/** Lower-cased and stripped of accents, so "cafe" finds "Café". */
export const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const index: Result[] = [
  ...recipes.map((r) => ({
    id: `recipe-${r.id}`,
    kind: 'recipe' as const,
    title: r.title,
    detail: `${r.minutes} min · ${r.difficulty}`,
    image: r.image,
    path: `/recipes/${r.id}`,
    haystack: [r.title, r.category, r.dek, ...r.ingredients, ...r.traits.map((t) => traitLabel[t])].join(' '),
  })),
  ...products.map((p) => ({
    id: `product-${p.id}`,
    kind: 'product' as const,
    title: p.name,
    detail: p.brand,
    image: p.image,
    path: `/products/${p.id}`,
    haystack: [p.name, p.brand, p.category, p.dek, p.description, ...p.traits.map((t) => traitLabel[t])].join(' '),
  })),
  ...places.map((p) => ({
    id: `place-${p.id}`,
    kind: p.type,
    title: p.name,
    detail: `${placeSummary(p)} · ${p.neighborhood}, ${p.city}`,
    image: p.image,
    path: `/places/${p.id}`,
    haystack: [p.name, p.type, p.city, p.neighborhood, p.dek, p.description, ...p.order].join(' '),
  })),
].map((r) => ({ ...r, haystack: normalize(r.haystack) }))

/** Singular forms a plural might stand for: "bakeries" → "bakery", "dishes" → "dish", "pizzas" → "pizza". */
function singulars(word: string): string[] {
  if (word.length <= 3) return []
  const forms: string[] = []
  if (word.endsWith('ies')) forms.push(word.slice(0, -3) + 'y')
  if (word.endsWith('es')) forms.push(word.slice(0, -2))
  if (word.endsWith('s')) forms.push(word.slice(0, -1))
  return forms
}

/** Every word must appear, as written or as its singular. */
export function matches(result: Result, words: string[]) {
  return words.every((w) => [w, ...singulars(w)].some((form) => result.haystack.includes(form)))
}

/** Everything in the index that matches a free-text query. An empty query matches everything. */
export function search(query: string): Result[] {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  return words.length > 0 ? index.filter((r) => matches(r, words)) : index
}

/**
 * What the search sheet shows before anything is typed: editors' picks (Hot
 * and MVP recipes and products) and the first few places reported as fully
 * gluten-free.
 */
export const recommendations: Result[] = (() => {
  const picks = new Set([
    ...recipes.filter((r) => r.flags?.length).map((r) => `recipe-${r.id}`),
    ...products.filter((p) => p.flags?.length).map((p) => `product-${p.id}`),
    ...places
      .filter((p) => p.safety === 'dedicated')
      .slice(0, 3)
      .map((p) => `place-${p.id}`),
  ])
  return index.filter((r) => picks.has(r.id))
})()
