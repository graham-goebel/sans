import { createContext, useContext, type MouseEvent } from 'react'

export type ItemKind = 'recipe' | 'product' | 'place'

export interface QuickViewTarget {
  kind: ItemKind
  id: string
}

export const QuickViewContext = createContext<(target: QuickViewTarget) => void>(() => {})

/** Opens an item in the quick-view sheet. */
export const useQuickView = () => useContext(QuickViewContext)

/**
 * Makes a card's link open the quick-view sheet instead of the full page.
 * Modified clicks (cmd/ctrl/shift, middle button) keep the link's normal
 * behaviour, so "open in new tab" still goes straight to the full page.
 */
export function useQuickViewClick(kind: ItemKind, id: string) {
  const open = useQuickView()
  return (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!(event.target as HTMLElement).closest('a')) return
    event.preventDefault()
    open({ kind, id })
  }
}
