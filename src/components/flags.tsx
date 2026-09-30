import type { ComponentType } from 'react'
import { BadgeCheck, Flame, ShieldQuestionMark, Trophy } from '../icons'
import type { Flag } from '../data/types'

type Chip = Flag | 'certified' | 'unverified'

const chips: Record<Chip, { label: string; icon: ComponentType<{ 'aria-hidden'?: boolean }> }> = {
  hot: { label: 'Hot', icon: Flame },
  mvp: { label: 'MVP', icon: Trophy },
  certified: { label: 'Certified', icon: BadgeCheck },
  unverified: { label: 'Unverified', icon: ShieldQuestionMark },
}

interface FlagChipsProps {
  flags?: Flag[]
  certified?: boolean
  /** Not yet confirmed with the place. Shown on its own: editorial flags like Hot and MVP don't apply until it is. */
  unverified?: boolean
  /** Icons only, for cards; the label stays as a tooltip and for screen readers. */
  iconOnly?: boolean
}

/** Small icon chips for an item's flags: unverified, trending, a standout pick, certified gluten-free. */
export function FlagChips({ flags = [], certified = false, unverified = false, iconOnly = false }: FlagChipsProps) {
  const shown: Chip[] = unverified
    ? ['unverified']
    : [...flags, ...(certified ? (['certified'] as const) : [])]
  if (shown.length === 0) return null
  return (
    <span className="flags">
      {shown.map((chip) => {
        const { label, icon: Icon } = chips[chip]
        return (
          <span
            key={chip}
            className={`flag flag--${chip}${iconOnly ? ' flag--icon' : ''}`}
            title={iconOnly ? label : undefined}
          >
            <Icon aria-hidden />
            {iconOnly ? <span className="visually-hidden">{label}</span> : label}
          </span>
        )
      })}
    </span>
  )
}
