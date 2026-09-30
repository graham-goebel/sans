import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom lacks a few browser APIs the app uses; give them harmless stand-ins.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

window.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
  root = null
  rootMargin = ''
  thresholds = []
} as unknown as typeof IntersectionObserver

window.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

window.scrollTo = () => {}

afterEach(() => {
  cleanup()
  window.location.hash = ''
})
