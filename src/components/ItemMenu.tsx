import { useState, type ReactNode } from 'react'
import { Button, IconButton, Popover, Stack } from '@dovetail-ds/react'
import { ArrowUpRight, Check, Ellipsis, Link as LinkIcon, Navigation, Share } from '../icons'

interface ItemMenuProps {
  /** The item's app path, e.g. /recipes/margherita-pizza. */
  path: string
  title: string
  onOpenFullPage: () => void
  /** A maps search for directions, for places. */
  directionsTo?: string
}

/** The "more" menu in a sheet's header: open, share or copy the item, and directions for places. */
export function ItemMenu({ path, title, onOpenFullPage, directionsTo }: ItemMenuProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}${window.location.pathname}#${path}`
  const canShare = typeof navigator.share === 'function'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked: the full page is still one tap away.
    }
  }

  const share = async () => {
    try {
      await navigator.share({ title: `${title} · sans`, url })
      setOpen(false)
    } catch {
      // Cancelled, or not allowed: nothing to do.
    }
  }

  const item = (label: string, icon: ReactNode, onClick: () => void) => (
    <Button variant="ghost" fullWidth iconStart={icon} onClick={onClick} style={{ justifyContent: 'flex-start' }}>
      {label}
    </Button>
  )

  return (
    <Popover
      label="More options"
      placement="bottom-end"
      width={220}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <IconButton label="More options" size="sm">
          <Ellipsis />
        </IconButton>
      }
    >
      <Stack gap="2xs" role="menu">
        {item('Open full page', <ArrowUpRight />, () => {
          setOpen(false)
          onOpenFullPage()
        })}
        {canShare && item('Share…', <Share />, share)}
        {item(copied ? 'Link copied' : 'Copy link', copied ? <Check /> : <LinkIcon />, copy)}
        {directionsTo &&
          item('Get directions', <Navigation />, () => {
            setOpen(false)
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(directionsTo)}`,
              '_blank',
              'noopener',
            )
          })}
      </Stack>
    </Popover>
  )
}
