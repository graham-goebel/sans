import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { useNavigate } from 'react-router'
import { Heading, IconButton, Stack, Text } from '@dovetail-ds/react'
import { ChevronRight } from '../icons'

interface RailProps {
  eyebrow?: string
  title: string
  /** A short line under the title saying what's in the row. */
  subline?: string
  /** "See all" destination, as an app path such as /recipes. */
  to?: string
  size?: 'narrow' | 'default' | 'wide'
  /** Advance one card every this many milliseconds. Off by default. */
  autoplay?: number
  children: ReactNode
}

/** A titled, horizontally scrolling row of cards that snaps card by card. */
export function Rail({ eyebrow, title, subline, to, size = 'default', autoplay, children }: RailProps) {
  const track = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useAutoplay(track, autoplay)

  return (
    <Stack gap="md">
      <div className="rail-header">
        <Stack gap="2xs">
          {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
          <Heading level={2} size="heading-xl">
            {title}
          </Heading>
          {subline && (
            <Text variant="small" tone="secondary">
              {subline}
            </Text>
          )}
        </Stack>
        {to && (
          <IconButton label={`See all ${title.toLowerCase()}`} className="icon-secondary" onClick={() => navigate(to)}>
            <ChevronRight />
          </IconButton>
        )}
      </div>
      <div ref={track} className={size === 'default' ? 'rail' : `rail rail--${size}`}>
        {children}
      </div>
    </Stack>
  )
}

/** How long a touch, drag, wheel or click holds the rail still before it moves on again. */
const RESUME_AFTER = 8000

/**
 * Slowly advances a rail one card at a time, wrapping to the start at the end.
 * It holds still while the rail is hovered or focused, for a while after
 * someone scrolls it themselves, while it is off screen or the tab is hidden,
 * and entirely for people who prefer reduced motion.
 */
function useAutoplay(track: RefObject<HTMLDivElement | null>, interval?: number) {
  useEffect(() => {
    const el = track.current
    if (!el || !interval) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let hovered = false
    let focused = false
    let visible = false
    let heldUntil = 0

    const hold = () => {
      heldUntil = Date.now() + RESUME_AFTER
    }
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hovered = true
    }
    const onLeave = () => {
      hovered = false
    }
    const onFocusIn = () => {
      focused = true
    }
    const onFocusOut = () => {
      focused = false
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', hold)
    el.addEventListener('touchstart', hold, { passive: true })
    el.addEventListener('wheel', hold, { passive: true })
    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(el)

    const timer = window.setInterval(() => {
      if (hovered || focused || !visible || document.hidden || Date.now() < heldUntil) return
      const card = el.firstElementChild as HTMLElement | null
      if (!card) return
      const step = card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0)
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' })
    }, interval)

    return () => {
      window.clearInterval(timer)
      observer.disconnect()
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', hold)
      el.removeEventListener('touchstart', hold)
      el.removeEventListener('wheel', hold)
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
    }
  }, [track, interval])
}
