import { useState } from 'react'

/** A set of toggled ids, for chip filters. */
export function useToggleSet<T extends string>() {
  const [selected, setSelected] = useState<T[]>([])
  const toggle = (id: T) =>
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
  return [selected, toggle, () => setSelected([])] as const
}
