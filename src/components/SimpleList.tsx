import type { ReactNode } from 'react'

interface SimpleListProps {
  label: string
  items: string[]
  /** An icon before each row, e.g. a shop for "where to buy". */
  icon?: ReactNode
}

/**
 * A plain, non-interactive list whose text lines up with the content edge,
 * dividers included. Dovetail's List insets every row for a hover highlight,
 * which suits clickable rows but not static ones (see docs/dovetail-requests.md).
 */
export function SimpleList({ label, items, icon }: SimpleListProps) {
  return (
    <ul className="simple-list" aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          {icon}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
