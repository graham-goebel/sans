import { lazy, Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { Button, Callout, Heading, IconButton, Link, Section, Stack, Tabs, Text, VisuallyHidden } from '@dovetail-ds/react'
import {
  CalendarCheck,
  Clock,
  Coffee,
  Croissant,
  LayoutList,
  LocateFixed,
  LocateOff,
  Map as MapIcon,
  MapPin,
  Star,
  Store,
  Utensils,
} from '../icons'
import { PlaceCard } from '../components/cards'
import { placeChips } from '../lib/chips'
import { SimpleList } from '../components/SimpleList'
import { PrecautionList } from '../components/precautions'
import { CoeliacNote } from '../components/CoeliacNote'
import { FilterChips, type ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { Rail } from '../components/Rail'
import { useNearMe, useToggleSet } from '../hooks'
import { usePreferences } from '../lib/preferences'
import { useQuickView } from '../lib/quickView'
import { scrimFor } from '../lib/scrim'
import { byDistance, nearestLocation } from '../lib/geo'
import { matchesPlace, type PlaceFilter } from '../lib/filters'
import { places } from '../data/places'
import type { Place, Safety } from '../data/types'

/** A dot in a safety level's colour: the chip doubles as the key to the map's photo pins. */
const safetyDot = (safety: Safety) =>
  function SafetyDot() {
    return <span className={`legend-dot safety--${safety}`} aria-hidden />
  }

const chips: ChipOption<PlaceFilter>[] = [
  { id: 'dedicated', label: '100% gluten-free', icon: safetyDot('dedicated') },
  { id: 'gf-menu', label: 'Separate GF menu', icon: safetyDot('gf-menu') },
  { id: 'gf-options', label: 'GF options', icon: safetyDot('gf-options') },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'cafe', label: 'Cafés', icon: Coffee },
  { id: 'bakery', label: 'Bakeries', icon: Croissant },
  { id: 'market', label: 'Markets', icon: Store },
]

// The map (and Leaflet) loads only when someone opens it.
const PlacesMap = lazy(() => import('../components/PlacesMap'))

/**
 * Places opens on the map, full screen, with the filters and the switch to
 * the list floated over it. The list is a tap away (?view=list).
 */
export function PlacesPage() {
  const [selected, toggle, clear] = useToggleSet<PlaceFilter>()
  const [params, setParams] = useSearchParams()
  const view = params.get('view') === 'list' ? 'list' : 'map'
  const [pickedId, setPickedId] = useState<string>()
  const nearMe = useNearMe()
  const openQuickView = useQuickView()
  const { preferences } = usePreferences()

  // With "Sort places by distance" on in preferences, find the viewer as soon as the page opens.
  const { locate } = nearMe
  useEffect(() => {
    if (preferences.useLocation) locate()
  }, [preferences.useLocation, locate])

  const filtered = places.filter((p) => matchesPlace(p, selected))
  const shown = nearMe.position ? byDistance(filtered, nearMe.position) : filtered
  const milesTo = (p: Place) => (nearMe.position ? nearestLocation(p, nearMe.position)?.miles : undefined)

  const viewSwitch = (
    <Tabs
      label="Show places as"
      variant="pill"
      value={view}
      onChange={(id) => setParams(id === 'list' ? { view: 'list' } : {}, { replace: true })}
      tabs={[
        { id: 'map', label: 'Map', icon: <MapIcon /> },
        { id: 'list', label: 'List', icon: <LayoutList /> },
      ]}
    />
  )

  const locationStatus =
    nearMe.status === 'denied'
      ? 'Location is turned off for this site. Allow it in your browser settings to sort by distance.'
      : nearMe.status === 'unavailable'
        ? 'Couldn’t find your location just now. Try again in a moment.'
        : nearMe.status === 'ready' && view === 'list'
          ? 'Sorted by distance from you. Your location stays on this device.'
          : undefined

  if (view === 'map') {
    return (
      <>
        <VisuallyHidden>
          <Heading level={1}>Places in Denver</Heading>
        </VisuallyHidden>
        <Suspense fallback={<div className="places-map places-map--loading" aria-label="Loading map" />}>
          <PlacesMap
            places={shown}
            you={nearMe.position}
            selectedId={pickedId}
            onSelect={(id) => {
              setPickedId(id)
              if (id) openQuickView({ kind: 'place', id })
            }}
            overlay={
              <>
                <div className="map-bar">
                  {viewSwitch}
                  {nearMe.status === 'ready' ? (
                    <IconButton label="Clear location" className="icon-glass" onClick={nearMe.clear}>
                      <LocateOff />
                    </IconButton>
                  ) : (
                    <IconButton label="Near me" className="icon-glass" onClick={nearMe.locate}>
                      <LocateFixed />
                    </IconButton>
                  )}
                </div>
                <FilterChips label="Filter places" options={chips} selected={selected} onToggle={toggle} scroll />
                {locationStatus && (
                  <p className="map-note" role="status">
                    {locationStatus}
                  </p>
                )}
                {shown.length === 0 && (
                  <p className="map-note" role="status">
                    No places match these filters.
                  </p>
                )}
              </>
            }
          />
        </Suspense>
      </>
    )
  }

  return (
    <ListingPage
      chips={chips}
      selected={selected}
      onToggle={toggle}
      onClear={clear}
      count={shown.length}
      noun={['place', 'places']}
      toolbar={
        <Stack gap="xs">
          <div className="places-toolbar">
            {viewSwitch}
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
          {locationStatus && (
            <Text variant="small" tone="secondary" role="status">
              {locationStatus}
            </Text>
          )}
        </Stack>
      }
      hiddenTitle="Places in Denver"
    >
      {shown.map((p) => (
        <PlaceCard key={p.id} place={p} miles={milesTo(p)} />
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
        tone={scrimFor.place(place)}
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
              <SimpleList label={unverified ? 'Reported gluten-free dishes' : 'What to order'} items={place.order} />
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
            <CoeliacNote place={place} />
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
