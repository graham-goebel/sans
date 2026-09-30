import { describe, expect, it } from 'vitest'
import { search } from './search'

const titles = (query: string) => search(query).map((r) => r.title)
const kinds = (query: string) => new Set(search(query).map((r) => r.kind))

describe('search', () => {
  it('finds every type for a food word', () => {
    expect(kinds('pizza')).toEqual(new Set(['recipe', 'product', 'restaurant']))
    expect(titles('pizza')).toContain('Forno Nero')
  })

  it('reads descriptions, dishes and ingredients, not only names', () => {
    // "Cacio e pepe" is only on Osteria Lume's list of dishes to order.
    expect(titles('cacio')).toEqual(['Osteria Lume'])
    // Psyllium only appears in ingredient lists and product descriptions.
    expect(titles('psyllium').length).toBeGreaterThan(1)
  })

  it('ignores case and accents', () => {
    expect(titles('CAFE')).toEqual(titles('café'))
    expect(kinds('cafe').has('cafe')).toBe(true)
  })

  it('matches plurals to their singular', () => {
    expect(titles('pizzas')).toEqual(titles('pizza'))
    expect(titles('bakeries').length).toBeGreaterThan(0)
  })

  it('needs every word to match', () => {
    expect(titles('pizza chicago')).toEqual([])
    expect(titles('pizza philadelphia')).toEqual(['Forno Nero'])
  })

  it('returns everything for an empty query and nothing for nonsense', () => {
    expect(search('   ').length).toBeGreaterThan(20)
    expect(search('zzqx')).toEqual([])
  })
})
