import type { ComponentType } from 'react'
import {
  BadgeCheck,
  BookOpen,
  CircleAlert,
  EggOff,
  Flame,
  MilkOff,
  NutOff,
  ShieldCheck,
  ShieldQuestionMark,
  Trophy,
  Vegan,
  WheatOff,
} from '../icons'
import { safetyText } from '../data/places'
import { traitLabel } from '../data/traits'
import type { Flag, Place, Product, Recipe, Trait } from '../data/types'

type Tone = 'brand' | 'neutral' | 'hot' | 'mvp' | 'caution'

export interface ChipSpec {
  label: string
  icon: ComponentType<{ 'aria-hidden'?: boolean }>
  tone: Tone
}

const traitIcon: Record<Trait, ChipSpec['icon']> = {
  'wheat-free': WheatOff,
  'dairy-free': MilkOff,
  vegan: Vegan,
  'egg-free': EggOff,
  'nut-free': NutOff,
}

const flagChip: Record<Flag, ChipSpec> = {
  hot: { label: 'Hot', icon: Flame, tone: 'hot' },
  mvp: { label: 'MVP', icon: Trophy, tone: 'mvp' },
}

const traitChips = (traits: Trait[]): ChipSpec[] =>
  traits.map((t) => ({ label: traitLabel[t], icon: traitIcon[t], tone: 'neutral' }))

export function recipeChips(recipe: Recipe): ChipSpec[] {
  return [
    ...(recipe.flags ?? []).map((f) => flagChip[f]),
    { label: 'Gluten-free', icon: ShieldCheck, tone: 'brand' },
    ...traitChips(recipe.traits),
  ]
}

export function productChips(product: Product): ChipSpec[] {
  return [
    ...(product.flags ?? []).map((f) => flagChip[f]),
    product.certified
      ? { label: 'Certified gluten-free', icon: BadgeCheck, tone: 'brand' }
      : { label: 'Gluten-free, not certified', icon: CircleAlert, tone: 'caution' },
    ...traitChips(product.traits),
  ]
}

export function placeChips(place: Place): ChipSpec[] {
  const safetyIcon = place.safety === 'dedicated' ? ShieldCheck : place.safety === 'gf-menu' ? BookOpen : CircleAlert
  return [
    ...(place.verification === 'unverified'
      ? [{ label: 'Unverified', icon: ShieldQuestionMark, tone: 'caution' as const }]
      : (place.flags ?? []).map((f) => flagChip[f])),
    { label: safetyText(place), icon: safetyIcon, tone: place.safety === 'gf-options' ? 'caution' : 'brand' },
  ]
}
