import type { ComponentProps, ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Button, EmptyState, Heading, IconButton, Section, Stack, Text } from '@dovetail-ds/react'
import { ArrowLeft, SearchX } from 'lucide-react'
import { FilterChips, type ChipOption } from './FilterChips'

export function Masthead() {
  return (
    <Section spacing="none" style={{ paddingBlock: 'var(--dt-space-stack-lg)' }}>
      <div className="masthead">
        <a className="wordmark" href="#/">
          sans<em>.</em>
        </a>
        <Text variant="eyebrow">The gluten-free companion</Text>
      </div>
    </Section>
  )
}

/** A Button that moves to another page in the app. */
export function ButtonLink({ to, ...props }: { to: string } & ComponentProps<typeof Button>) {
  const navigate = useNavigate()
  return <Button {...props} onClick={() => navigate(to)} />
}

interface ListingPageProps<T extends string> {
  eyebrow: string
  title: ReactNode
  lead: string
  chips: ChipOption<T>[]
  selected: T[]
  onToggle: (id: T) => void
  onClear: () => void
  count: number
  noun: [singular: string, plural: string]
  /** Denser, two-across grid for product shots. */
  shelf?: boolean
  children: ReactNode
}

/** A section's index: masthead, an editorial intro, filter chips and a card grid. */
export function ListingPage<T extends string>({
  eyebrow,
  title,
  lead,
  chips,
  selected,
  onToggle,
  onClear,
  count,
  noun,
  shelf = false,
  children,
}: ListingPageProps<T>) {
  return (
    <>
      <Masthead />
      <Section spacing="compact">
        <Stack gap="xl">
          <Stack gap="sm">
            <Text variant="eyebrow" tone="brand">
              {eyebrow}
            </Text>
            <Heading level={1} size="display-lg">
              {title}
            </Heading>
            <Text variant="lead">{lead}</Text>
          </Stack>
          <FilterChips label={`Filter ${noun[1]}`} options={chips} selected={selected} onToggle={onToggle} />
          <Text variant="small" tone="secondary">
            {count} {count === 1 ? noun[0] : noun[1]}
            {selected.length > 0 && ' match your filters'}
          </Text>
          {count > 0 ? (
            <div className={shelf ? 'card-grid card-grid--shelf' : 'card-grid'}>{children}</div>
          ) : (
            <EmptyState
              icon={<SearchX />}
              title={`No ${noun[1]} match`}
              description="Try removing a filter or two."
              action={
                <Button variant="secondary" onClick={onClear}>
                  Clear filters
                </Button>
              }
            />
          )}
        </Stack>
      </Section>
    </>
  )
}

interface DetailHeroProps {
  /** Where the back button goes, as an app path, and what it says to a screen reader. */
  back: { to: string; label: string }
  image: string
  /** A short note set over the photo's corner, e.g. "Illustrative photo". */
  photoNote?: string
  eyebrow: string
  title: string
  dek: string
  meta?: ReactNode
  badges?: ReactNode
}

/**
 * The top of an item page: a tall photograph bled edge to edge with a back
 * button over it (the nav bar is hidden on these pages), then the headline.
 */
export function DetailHero({ back, image, photoNote, eyebrow, title, dek, meta, badges }: DetailHeroProps) {
  const navigate = useNavigate()
  return (
    <>
      <div className="detail-photo">
        <img src={image} alt="" />
        {photoNote && <span className="photo-note">{photoNote}</span>}
        <IconButton label={back.label} className="icon-glass detail-back" size="lg" onClick={() => navigate(back.to)}>
          <ArrowLeft />
        </IconButton>
      </div>
      <Section spacing="compact">
        <Stack gap="md">
          <Text variant="eyebrow" tone="brand">
            {eyebrow}
          </Text>
          <Heading level={1} size="display-md">
            {title}
          </Heading>
          <Text variant="lead">{dek}</Text>
          {meta && <div className="meta-row">{meta}</div>}
          {badges && <div className="chip-row">{badges}</div>}
        </Stack>
      </Section>
    </>
  )
}

export function MetaItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="meta-item">
      {icon}
      {children}
    </span>
  )
}

export function NotFoundState({ what, href }: { what: string; href: string }) {
  return (
    <Section>
      <EmptyState
        icon={<SearchX />}
        title={`We couldn’t find that ${what}`}
        description="It may have moved, or the link might be mistyped."
        action={<ButtonLink to={href}>Back to all</ButtonLink>}
      />
    </Section>
  )
}
