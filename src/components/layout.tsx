import type { ComponentProps, ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Button, EmptyState, Heading, Image, Section, Stack, Text } from '@dovetail-ds/react'
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

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="back-link" href={href}>
      <ArrowLeft size={16} aria-hidden />
      {children}
    </a>
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
  back: { href: string; label: string }
  image: string
  eyebrow: string
  title: string
  dek: string
  meta?: ReactNode
  badges?: ReactNode
}

/** The top of an item page: a big photograph, then the headline and standfirst. */
export function DetailHero({ back, image, eyebrow, title, dek, meta, badges }: DetailHeroProps) {
  return (
    <Section spacing="compact">
      <Stack gap="xl">
        <BackLink href={back.href}>{back.label}</BackLink>
        <Image src={image} alt="" ratio="4:3" radius="container" loading="eager" />
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
      </Stack>
    </Section>
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
