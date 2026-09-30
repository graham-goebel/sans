import { useParams } from 'react-router'
import { Badge, Heading, List, Section, Stack, Text } from '@dovetail-ds/react'
import type { ComponentType } from 'react'
import {
  BadgeCheck,
  BookOpen,
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
import { Reviews } from '../components/Reviews'
import type { ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { Rail } from '../components/Rail'
import { useToggleSet } from '../hooks'
import { places, safetyLabel } from '../data/places'
import { placeReviews } from '../data/reviews'
import type { Place, PrecautionKind } from '../data/types'

type PlaceFilter = Place['type'] | 'dedicated' | 'gf-menu'

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

const types = new Set<string>(['restaurant', 'cafe', 'bakery', 'market'])
const safeties = new Set<string>(['dedicated', 'gf-menu'])

/** Types widen the list, and so do safety levels: pick either and you see both. */
function matches(place: Place, selected: PlaceFilter[]) {
  const pickedTypes = selected.filter((f) => types.has(f))
  const pickedSafety = selected.filter((f) => safeties.has(f))
  if (pickedTypes.length > 0 && !pickedTypes.includes(place.type)) return false
  if (pickedSafety.length > 0 && !pickedSafety.includes(place.safety as PlaceFilter)) return false
  return true
}

export function PlacesPage() {
  const [selected, toggle, clear] = useToggleSet<PlaceFilter>()
  const shown = places.filter((p) => matches(p, selected))

  return (
    <ListingPage
      eyebrow="Places"
      title={
        <>
          Eat out, <em>safely</em>
        </>
      }
      lead="Restaurants, cafés and bakeries where gluten-free is taken seriously, with a clear note on how."
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

  const nearby = places.filter((p) => p.id !== place.id)

  return (
    <>
      <DetailHero
        back={{ to: '/places', label: 'Back to all places' }}
        image={place.image}
        eyebrow={`${place.type} · ${place.neighborhood}, ${place.city}`}
        title={place.name}
        dek={place.dek}
        meta={
          <>
            <MetaItem icon={<MapPin aria-hidden />}>{place.address}</MetaItem>
            <MetaItem icon={<Clock aria-hidden />}>{place.hours}</MetaItem>
            <MetaItem icon={<Star aria-hidden />}>
              {place.rating.toFixed(1)} · {place.price}
            </MetaItem>
          </>
        }
        badges={
          <>
            <Badge tone={place.safety === 'dedicated' ? 'primary' : place.safety === 'gf-menu' ? 'info' : 'warning'}>
              {safetyLabel[place.safety]}
            </Badge>
            <FlagChips flags={place.flags} />
          </>
        }
      />
      <Section>
        <div className="detail-layout">
          <Stack gap="md">
            <Heading level={2} size="heading-lg">
              What to order
            </Heading>
            <List
              label="What to order"
              items={place.order.map((dish) => ({ id: dish, title: dish }))}
            />
          </Stack>
          <Stack gap="md">
            <Heading level={2} size="heading-lg">
              How they handle gluten
            </Heading>
            <Text variant="lead" tone="primary">
              {place.description}
            </Text>
            <ul className="precautions" aria-label="Precautions">
              {place.precautions.map((p) => {
                const { icon: Icon, caution } = precautionStyle[p.kind]
                return (
                  <li key={p.kind}>
                    <span className={caution ? 'precaution precaution--caution' : 'precaution'}>
                      <Icon aria-hidden />
                    </span>
                    <Text as="span">{p.text}</Text>
                  </li>
                )
              })}
            </ul>
            <Text variant="small" tone="secondary">
              Kitchens change. Always tell your server you need gluten-free food when you order.
            </Text>
          </Stack>
        </div>
      </Section>
      <Section>
        <Reviews reviews={placeReviews[place.id] ?? []} />
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
