import type { ChipSpec } from '../lib/chips'

/** Larger chips with icons that wrap onto new lines, for item pages and previews. */
export function ChipList({ chips }: { chips: ChipSpec[] }) {
  return (
    <ul className="item-chips" aria-label="Labels">
      {chips.map(({ label, icon: Icon, tone }) => (
        <li key={label} className={`item-chip item-chip--${tone}`}>
          <Icon aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  )
}
