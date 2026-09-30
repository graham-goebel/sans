import { useParams } from 'react-router'
import { Badge, Callout, Heading, Link, List, Section, Stack, Text } from '@dovetail-ds/react'
import type { ComponentType } from 'react'
import {
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  Clock,
  Coffee,
  CookingPot,
  Croissant,
  Droplets,
  GraduationCap,
  MapPin,
  MessageCircleWarning,
  Package,
  Sandwich,
  ShieldCheck,
  Star,
  Store,
  TriangleAlert,
  Utensils,
} from 'lucide-react'
import { PlaceCard } from '../components/cards'
import { FlagChips } from '../components/flags'
import type { ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { Rail } from '../components/Rail'
import { useToggleSet } from '../hooks'
import { matchesPlace, type PlaceFilter } from '../lib/filters'
import { places, safetyLabel } from '../data/places'
import type { PrecautionKind } from '../data/types'

const chips: ChipOption<PlaceFilter>[] = [
  { id: 'dedicated', label: '100% gluten-free', icon: ShieldCheck },
  { id: 'gf-menu', label: 'Separate GF menu', icon: BookOpen },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'cafe', label: 'Cafés', icon: Coffee },
  { id: 'bakery', label: 'Bakeries', icon: Croissant },
  { id: 'market', label: 'Markets', icon: Store },
]

/** An icon for each kind of precaution; cautions are drawn in the warning colour. */
const precautionStyle: Record<PrecautionKind, { icon: ComponentType<{ 'aria-hidden'?: boolean }>; caution?: boolean }> = {
  'dedicated-kitchen': { icon: ShieldCheck },
  'dedicated-fryer': { icon: CookingPot },
  'shared-fryer': { icon: TriangleAlert, caution: true },
  'separate-prep': { icon: Utensils },
  'separate-water': { icon: Droplets },
  'separate-toaster': { icon: Sandwich },
  'marked-menu': { icon: BookOpen },
  checked: { icon: BadgeCheck },
  sealed: { icon: Package },
  'trained-staff': { icon: GraduationCap },
  ask: { icon: MessageCircleWarning, caution: true },
}

export function PlacesPage() {
  const [selected, toggle, clear] = useToggleSet<PlaceFilter>()
  const shown = places.filter((p) => matchesPlace(p, selected))

  return (
    <ListingPage
      eyebrow="Places · Denver"
      title={
        <>
          Eat out, <em>safely</em>
        </>
      }
      lead="Denver restaurants, cafés, bakeries and markets that take gluten-free seriously, with a note on how. We’re confirming each one with the place; until then it’s marked unverified."
      chips={chips}
      selected={selected}
      onToggle={toggle}
      onClear={clear}
      count={shown.length}
      noun={['place', 'places']}
    >
      {shown.map((p) => (
        <PlaceCard key={p.id} place={p} />
      ))}
    </ListingPage>
  )
}

export function PlaceDetail() {
  const { id } = useParams()
  const place = places.find((p) => p.id === id)
  if (!place) return <NotFoundState what="place" href="/places" />

  const unverified = place.verification === 'unverified'
  const nearby = places.filter((p) => p.id !== place.id)

  return (
    <>
      <DetailHero
        back={{ to: '/places', label: 'Back to all places' }}
        image={place.image}
        photoNote={unverified ? 'Illustrative photo' : undefined}
        eyebrow={`${place.type} · ${place.neighborhood}, ${place.city}`}
        title={place.name}
        dek={place.dek}
        meta={
          <>
            <MetaItem icon={<MapPin aria-hidden />}>{place.address}</MetaItem>
            {place.hours && <MetaItem icon={<Clock aria-hidden />}>{place.hours}</MetaItem>}
            {place.rating !== undefined && (
              <MetaItem icon={<Star aria-hidden />}>
                {place.rating.toFixed(1)}
                {place.price && ` · ${place.price}`}
              </MetaItem>
            )}
            {place.lastChecked ? (
              <MetaItem icon={<CalendarCheck aria-hidden />}>Checked {place.lastChecked}</MetaItem>
            ) : (
              place.researched && <MetaItem icon={<CalendarCheck aria-hidden />}>Researched {place.researched}</MetaItem>
            )}
          </>
        }
        badges={
          <>
            <Badge tone={place.safety === 'dedicated' ? 'primary' : place.safety === 'gf-menu' ? 'info' : 'warning'}>
              {unverified ? `Reported ${safetyLabel[place.safety].toLowerCase()}` : safetyLabel[place.safety]}
            </Badge>
            <FlagChips flags={place.flags} unverified={unverified} />
          </>
        }
      />
      <Section>
        <div className="detail-layout">
          {place.order.length > 0 ? (
            <Stack gap="md">
              <Heading level={2} size="heading-lg">
                {unverified ? 'Reported gluten-free' : 'What to order'}
              </Heading>
              <List
                label={unverified ? 'Reported gluten-free dishes' : 'What to order'}
                items={place.order.map((dish) => ({ id: dish, title: dish }))}
              />
            </Stack>
          ) : (
            <div />
          )}
          <Stack gap="md">
            <Heading level={2} size="heading-lg">
              {unverified ? 'What’s been reported' : 'How they handle gluten'}
            </Heading>
            <Text variant="lead" tone="primary">
              {place.description}
            </Text>
            <ul className="precautions" aria-label="Precautions">
              {place.precautions.map((p) => {
                const { icon: Icon, caution } = precautionStyle[p.kind]
                return (
                  <li key={p.text}>
                    <span className={caution ? 'precaution precaution--caution' : 'precaution'}>
                      <Icon aria-hidden />
                    </span>
                    <Text as="span">{p.text}</Text>
                  </li>
                )
              })}
            </ul>
            {unverified ? (
              <Callout tone="caution" title="Not yet confirmed">
                sans hasn’t confirmed these details with {place.name}. They come from public listings, reviews and
                press read in {place.researched}. Call ahead, and tell staff you need gluten-free food when you order.
              </Callout>
            ) : (
              <Text variant="small" tone="secondary">
                Kitchens change. Always tell your server you need gluten-free food when you order.
              </Text>
            )}
            <Stack gap="xs">
              <Text variant="label">Sources</Text>
              <ul className="sources">
                {place.sources.map((source) => (
                  <li key={source.url}>
                    <Link href={source.url} external underline="hover">
                      {source.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Stack>
          </Stack>
        </div>
      </Section>
      <Section tone="subtle">
        <Rail eyebrow="Plan the next one" title="More places" to="/places" size="wide">
          {nearby.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </Rail>
      </Section>
    </>
  )
}
