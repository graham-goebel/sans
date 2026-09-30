import { createContext, useContext } from 'react'
import type { Trait } from '../data/types'

export type Condition = 'coeliac' | 'sensitivity' | 'wheat-allergy' | 'preference'
export type Experience = 'new' | 'learning' | 'seasoned'
export type Avoid = 'dairy' | 'eggs' | 'nuts' | 'animal'

export interface Preferences {
  city: 'denver'
  /** Sort places by distance as soon as the Places page opens. */
  useLocation: boolean
  condition?: Condition
  /** Other things to avoid, beyond gluten. */
  avoid: Avoid[]
  experience?: Experience
}

export const defaultPreferences: Preferences = { city: 'denver', useLocation: false, avoid: [] }

/** The recipe and product filter chip each avoidance turns on. */
export const avoidTrait: Record<Avoid, Trait> = {
  dairy: 'dairy-free',
  eggs: 'egg-free',
  nuts: 'nut-free',
  animal: 'vegan',
}

const KEY = 'sans:preferences'

/** Preferences saved in this browser only. Storage can be blocked or cleared, so every access is guarded. */
export function loadPreferences(): Preferences {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences
  } catch {
    return defaultPreferences
  }
}

export function savePreferences(preferences: Preferences) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(preferences))
  } catch {
    // Private mode or blocked storage: the preferences still apply for this visit.
  }
}

export interface PreferencesApi {
  preferences: Preferences
  update: (change: Partial<Preferences>) => void
  openSheet: () => void
}

export const PreferencesContext = createContext<PreferencesApi>({
  preferences: defaultPreferences,
  update: () => {},
  openSheet: () => {},
})

export const usePreferences = () => useContext(PreferencesContext)
