import { useParams } from 'react-router'
import { Badge, Heading, List, Section, Stack, Text } from '@dovetail-ds/react'
import { BookOpen, Clock, Coffee, Croissant, MapPin, ShieldCheck, Star, Store, Utensils } from 'lucide-react'
import { PlaceCard } from '../components/cards'
import type { ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { Rail } from '../components/Rail'
import { useToggleSet } from '../hooks'
import { places, safetyLabel } from '../data/places'
import type { Place } from '../data/types'

type PlaceFilter = Place['type'] | 'dedicated' | 'gf-menu'

const chips: ChipOption<PlaceFilter>[] = [
  { id: 'dedicated', label: '100% gluten-free', icon: ShieldCheck },
  { id: 'gf-menu', label: 'Separate GF menu', icon: BookOpen },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'cafe', label: 'Cafés', icon: Coffee },
  { id: 'bakery', label: 'Bakeries', icon: Croissant },
  { id: 'market', label: 'Markets', icon: Store },
]

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
        back={{ href: '#/places', label: 'All places' }}
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
          <Badge tone={place.safety === 'dedicated' ? 'primary' : place.safety === 'gf-menu' ? 'info' : 'warning'}>
            {safetyLabel[place.safety]}
          </Badge>
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
              items={place.order.map((dish) => ({
                id: dish,
                title: dish,
                leading: <Utensils size={20} aria-hidden />,
              }))}
            />
          </Stack>
          <Stack gap="md">
            <Heading level={2} size="heading-lg">
              How they handle gluten
            </Heading>
            <Text variant="lead" tone="primary">
              {place.description}
            </Text>
            <Text variant="small" tone="secondary">
              Kitchens change. Always tell your server you need gluten-free food when you order.
            </Text>
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
