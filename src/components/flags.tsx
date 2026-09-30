import type { ComponentType } from 'react'
import { BadgeCheck, Flame, Trophy } from 'lucide-react'
import type { Flag } from '../data/types'

type Chip = Flag | 'certified'

const chips: Record<Chip, { label: string; icon: ComponentType<{ 'aria-hidden'?: boolean }> }> = {
  hot: { label: 'Hot', icon: Flame },
  mvp: { label: 'MVP', icon: Trophy },
  certified: { label: 'Certified', icon: BadgeCheck },
}

/** Small icon chips for an item's flags: trending, a standout pick, certified gluten-free. */
export function FlagChips({ flags = [], certified = false }: { flags?: Flag[]; certified?: boolean }) {
  const shown: Chip[] = [...flags, ...(certified ? (['certified'] as const) : [])]
  if (shown.length === 0) return null
  return (
    <span className="flags">
      {shown.map((chip) => {
        const { label, icon: Icon } = chips[chip]
        return (
          <span key={chip} className={`flag flag--${chip}`}>
            <Icon aria-hidden />
            {label}
          </span>
        )
      })}
    </span>
  )
}
