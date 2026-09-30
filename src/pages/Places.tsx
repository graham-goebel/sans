import { lazy, Suspense, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { Button, Callout, Heading, Link, List, Section, Stack, Tabs, Text } from '@dovetail-ds/react'
import {
  BookOpen,
  CalendarCheck,
  Clock,
  Coffee,
  Croissant,
  LayoutList,
  LocateFixed,
  LocateOff,
  Map as MapIcon,
  MapPin,
  ShieldCheck,
  Star,
  Store,
  Utensils,
} from 'lucide-react'
import { PlaceCard } from '../components/cards'
import { placeChips } from '../lib/chips'
import { PrecautionList } from '../components/precautions'
import type { ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { Rail } from '../components/Rail'
import { useNearMe, useToggleSet } from '../hooks'
import { byDistance, nearestLocation } from '../lib/geo'
import { matchesPlace, type PlaceFilter } from '../lib/filters'
import { places } from '../data/places'
import type { Place } from '../data/types'

const chips: ChipOption<PlaceFilter>[] = [
  { id: 'dedicated', label: '100% gluten-free', icon: ShieldCheck },
  { id: 'gf-menu', label: 'Separate GF menu', icon: BookOpen },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'cafe', label: 'Cafés', icon: Coffee },
  { id: 'bakery', label: 'Bakeries', icon: Croissant },
  { id: 'market', label: 'Markets', icon: Store },
]

// The map (and Leaflet) loads only when someone opens it.
const PlacesMap = lazy(() => import('../components/PlacesMap'))

export function PlacesPage() {
  const [selected, toggle, clear] = useToggleSet<PlaceFilter>()
  const [params, setParams] = useSearchParams()
  const view = params.get('view') === 'map' ? 'map' : 'list'
  const [pickedId, setPickedId] = useState<string>()
  const nearMe = useNearMe()

  const filtered = places.filter((p) => matchesPlace(p, selected))
  const shown = nearMe.position ? byDistance(filtered, nearMe.position) : filtered
  const milesTo = (p: Place) => (nearMe.position ? nearestLocation(p, nearMe.position)?.miles : undefined)
  const picked = shown.find((p) => p.id === pickedId)
  const offMap = shown.filter((p) => !p.locations?.length)

  const toolbar = (
    <div className="places-toolbar">
      <Tabs
        label="Show places as"
        variant="pill"
        value={view}
        onChange={(id) => setParams(id === 'map' ? { view: 'map' } : {}, { replace: true })}
        tabs={[
          { id: 'list', label: 'List', icon: <LayoutList /> },
          { id: 'map', label: 'Map', icon: <MapIcon /> },
        ]}
      />
      {nearMe.status === 'ready' ? (
        <Button variant="secondary" size="sm" iconStart={<LocateOff />} onClick={nearMe.clear}>
          Clear location
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          iconStart={<LocateFixed />}
          loading={nearMe.status === 'locating'}
          onClick={nearMe.locate}
        >
          Near me
        </Button>
      )}
    </div>
  )

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
      toolbar={
        <Stack gap="xs">
          {toolbar}
          {(nearMe.status === 'denied' || nearMe.status === 'unavailable') && (
            <Text variant="small" tone="secondary" role="status">
              {nearMe.status === 'denied'
                ? 'Location is turned off for this site. Allow it in your browser settings to sort by distance.'
                : 'Couldn’t find your location just now. Try again in a moment.'}
            </Text>
          )}
          {nearMe.status === 'ready' && (
            <Text variant="small" tone="secondary" role="status">
              Sorted by distance from you. Your location stays on this device.
            </Text>
          )}
        </Stack>
      }
      layout={view === 'map' ? 'plain' : 'grid'}
    >
      {view === 'map' ? (
        <Stack gap="lg">
          <Suspense fallback={<div className="places-map places-map--loading" aria-label="Loading map" />}>
            <PlacesMap places={shown} you={nearMe.position} selectedId={pickedId} onSelect={setPickedId} />
          </Suspense>
          <div className="map-legend" aria-hidden>
            <span className="legend-dot pin--dedicated" /> 100% gluten-free
            <span className="legend-dot pin--gf-menu" /> Separate GF menu
            <span className="legend-dot pin--gf-options" /> GF options
          </div>
          {picked ? (
            <div className="map-pick">
              <PlaceCard place={picked} miles={milesTo(picked)} />
            </div>
          ) : (
            <Text variant="small" tone="secondary">
              Tap a pin to see the place.
            </Text>
          )}
          {offMap.length > 0 && (
            <Text variant="fine">
              Not on the map (no single address): {offMap.map((p) => p.name).join(', ')}.
            </Text>
          )}
        </Stack>
      ) : (
        shown.map((p) => <PlaceCard key={p.id} place={p} miles={milesTo(p)} />)
      )}
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
        chips={placeChips(place)}
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
            <PrecautionList precautions={place.precautions} />
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
        <Rail eyebrow="Plan the next one" title="More places" to="/places">
          {nearby.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </Rail>
      </Section>
    </>
  )
}
