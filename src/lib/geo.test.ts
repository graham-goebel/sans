import { describe, expect, it } from 'vitest'
import type { Place } from '../data/types'
import { byDistance, DENVER, formatMiles, milesBetween, nearestLocation } from './geo'

const place = (id: string, locations?: Place['locations']) => ({ id, locations }) as Place

describe('geo', () => {
  it('measures distance in miles', () => {
    // Union Station to Colorado State Capitol is about 1.3 miles.
    const capitol = { lat: 39.7393, lng: -104.9848 }
    expect(milesBetween(DENVER, capitol)).toBeGreaterThan(1.1)
    expect(milesBetween(DENVER, capitol)).toBeLessThan(1.5)
    expect(milesBetween(DENVER, DENVER)).toBe(0)
  })

  it('picks the nearest of several locations', () => {
    const far = { lat: 39.65, lng: -105.08, label: 'Lakewood' }
    const near = { lat: 39.76, lng: -105.0, label: 'Downtown' }
    expect(nearestLocation(place('a', [far, near]), DENVER)?.location.label).toBe('Downtown')
    expect(nearestLocation(place('b'), DENVER)).toBeUndefined()
  })

  it('sorts nearest first and leaves unpinned places last', () => {
    const sorted = byDistance(
      [place('none'), place('far', [{ lat: 39.6, lng: -105.1 }]), place('near', [{ lat: 39.753, lng: -105.0 }])],
      DENVER,
    )
    expect(sorted.map((p) => p.id)).toEqual(['near', 'far', 'none'])
  })

  it('formats miles for people', () => {
    expect(formatMiles(0.43)).toBe('0.4 mi')
    expect(formatMiles(3)).toBe('3 mi')
    expect(formatMiles(12.6)).toBe('13 mi')
  })
})
