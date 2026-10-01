import type { ComponentType } from 'react'
import { Tag } from '@dovetail-ds/react'

export interface ChipOption<T extends string> {
  id: T
  label: string
  icon: ComponentType
}

interface FilterChipsProps<T extends string> {
  label: string
  options: ChipOption<T>[]
  selected: T[]
  onToggle: (id: T) => void
  /** One sideways-scrolling row, for tight spots like over the map. Chips wrap otherwise. */
  scroll?: boolean
}

/** Toggleable filter chips, each with an icon. */
export function FilterChips<T extends string>({ label, options, selected, onToggle, scroll }: FilterChipsProps<T>) {
  return (
    <div className={scroll ? 'chip-row chip-row--scroll' : 'chip-row'} role="group" aria-label={label}>
      {options.map(({ id, label, icon: Icon }) => (
        <Tag
          key={id}
          selected={selected.includes(id)}
          onClick={() => onToggle(id)}
          onKeyDown={(event) => {
            // Tag renders a span with role="button"; give it a button's keys.
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onToggle(id)
            }
          }}
        >
          <span className="chip">
            <Icon aria-hidden />
            {label}
          </span>
        </Tag>
      ))}
    </div>
  )
}
