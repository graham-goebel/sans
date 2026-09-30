import { useRef, type ReactNode } from 'react'
import { Heading, IconButton, Link, Stack, Text } from '@dovetail-ds/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface RailProps {
  eyebrow?: string
  title: ReactNode
  /** "See all" destination. */
  href?: string
  size?: 'narrow' | 'default' | 'wide'
  children: ReactNode
}

/** A titled, horizontally scrolling row of cards that snaps card by card. */
export function Rail({ eyebrow, title, href, size = 'default', children }: RailProps) {
  const track = useRef<HTMLDivElement>(null)

  const scroll = (direction: 1 | -1) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <Stack gap="md">
      <div className="rail-header">
        <Stack gap="2xs">
          {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
          <Heading level={2} size="heading-xl">
            {title}
          </Heading>
        </Stack>
        <div className="rail-actions">
          <div className="rail-controls">
            <IconButton label="Scroll back" size="sm" onClick={() => scroll(-1)}>
              <ArrowLeft />
            </IconButton>
            <IconButton label="Scroll forward" size="sm" onClick={() => scroll(1)}>
              <ArrowRight />
            </IconButton>
          </div>
          {href && (
            <Link href={href} underline="hover">
              See all
            </Link>
          )}
        </div>
      </div>
      <div ref={track} className={size === 'default' ? 'rail' : `rail rail--${size}`}>
        {children}
      </div>
    </Stack>
  )
}
