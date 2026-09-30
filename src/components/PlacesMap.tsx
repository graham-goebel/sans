import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { divIcon, latLngBounds } from 'leaflet'
import { CircleMarker, MapContainer, Marker, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { IconButton } from '@dovetail-ds/react'
import type { Place, Safety } from '../data/types'
import { DENVER, type LatLng } from '../lib/geo'
import { Collapse, Expand } from '../icons'

interface PlacesMapProps {
  places: Place[]
  /** Where the viewer is, once they've shared it. */
  you?: LatLng
  selectedId?: string
  onSelect: (id: string | undefined) => void
}

// One cached icon per safety level and selected state.
const icons = new Map<string, ReturnType<typeof divIcon>>()
function pin(safety: Safety, selected: boolean) {
  const key = `${safety}-${selected}`
  if (!icons.has(key)) {
    icons.set(
      key,
      divIcon({
        className: '',
        html: `<span class="pin pin--${safety}${selected ? ' pin--selected' : ''}"></span>`,
        iconSize: selected ? [34, 34] : [26, 26],
        iconAnchor: selected ? [17, 34] : [13, 26],
      }),
    )
  }
  return icons.get(key)!
}

/** Keeps the view framed on what matters: you and the nearest places, or every place shown. */
function Frame({ places, you }: { places: Place[]; you?: LatLng }) {
  const map = useMap()
  useEffect(() => {
    // The map is created before its node reaches the page; measure it now.
    map.invalidateSize()
    const points = places.flatMap((p) => p.locations ?? [])
    if (you) {
      const nearest = [...points]
        .sort((a, b) => Math.hypot(a.lat - you.lat, a.lng - you.lng) - Math.hypot(b.lat - you.lat, b.lng - you.lng))
        .slice(0, 5)
      map.fitBounds(latLngBounds([you, ...nearest].map((p) => [p.lat, p.lng])), { padding: [40, 40], maxZoom: 15 })
    } else if (points.length > 0) {
      map.fitBounds(latLngBounds(points.map((p) => [p.lat, p.lng])), { padding: [32, 32], maxZoom: 14 })
    }
  }, [map, places, you])
  return null
}

/**
 * Leaflet makes pins focusable but ignores Enter and Space on them. Treat
 * both like a tap, so keyboard users can open a place too.
 */
function KeyboardPins() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    const onKeyDown = (event: KeyboardEvent) => {
      const pin = (event.target as HTMLElement).closest('.leaflet-marker-icon')
      if (pin && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        ;(pin as HTMLElement).click()
      }
    }
    container.addEventListener('keydown', onKeyDown)
    return () => container.removeEventListener('keydown', onKeyDown)
  }, [map])
  return null
}

/** The key doubles as a filter: each safety level's pins can be shown or hidden. */
const levels: { safety: Safety; label: string }[] = [
  { safety: 'dedicated', label: '100% gluten-free' },
  { safety: 'gf-menu', label: 'Separate GF menu' },
  { safety: 'gf-options', label: 'GF options' },
]

/**
 * Leaflet measures its container once. Re-measure whenever the container
 * changes size (going full screen and back), and let the wheel zoom only
 * when the map has the whole screen, so it doesn't hijack page scrolling.
 */
function FitContainer({ full }: { full: boolean }) {
  const map = useMap()
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])
  useEffect(() => {
    if (full) map.scrollWheelZoom.enable()
    else map.scrollWheelZoom.disable()
  }, [map, full])
  return null
}

/**
 * Full screen without remounting the map: it renders into one node that
 * moves between its place on the page and the end of <body>. (The page's
 * entry animation would otherwise trap a fixed-position map inside it.)
 */
function useFullScreen() {
  const [full, setFull] = useState(false)
  const [host] = useState(() => document.createElement('div'))
  const slot = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const parent = full ? document.body : slot.current
    parent?.appendChild(host)
  }, [full, host])

  useEffect(() => () => host.remove(), [host])

  // While full screen: Escape leaves, and the page behind doesn't scroll.
  useEffect(() => {
    if (!full) return
    const onKeyDown = (event: KeyboardEvent) => {
      // A sheet opened from a pin handles its own Escape.
      if (event.key === 'Escape' && !document.querySelector('[role="dialog"]')) setFull(false)
    }
    const overflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.documentElement.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [full])

  return { full, setFull, host, slot }
}

export default function PlacesMap({ places, you, selectedId, onSelect }: PlacesMapProps) {
  const [hidden, setHidden] = useState<Safety[]>([])
  const { full, setFull, host, slot } = useFullScreen()
  const mapped = places.filter((p) => p.locations?.length)
  const counts = new Map(levels.map(({ safety }) => [safety, mapped.filter((p) => p.safety === safety).length]))
  const shown = places.filter((p) => !hidden.includes(p.safety))
  const toggle = (safety: Safety) =>
    setHidden((current) => (current.includes(safety) ? current.filter((s) => s !== safety) : [...current, safety]))

  // Moving the map drops focus; put it back on the full-screen button.
  const wasFull = useRef(full)
  useEffect(() => {
    if (wasFull.current !== full) host.querySelector<HTMLElement>('.map-full-toggle')?.focus({ preventScroll: true })
    wasFull.current = full
  }, [full, host])

  const map = (
    <div className={full ? 'places-map places-map--full' : 'places-map'}>
      <MapContainer
        center={[DENVER.lat, DENVER.lng]}
        zoom={11}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: '100%' }}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        <Frame places={places} you={you} />
        <KeyboardPins />
        <FitContainer full={full} />
        {shown.flatMap((place) =>
          (place.locations ?? []).map((location, i) => (
            <Marker
              key={`${place.id}-${i}`}
              position={[location.lat, location.lng]}
              icon={pin(place.safety, place.id === selectedId)}
              title={location.label ? `${place.name}, ${location.label}` : place.name}
              alt={place.name}
              zIndexOffset={place.id === selectedId ? 1000 : 0}
              eventHandlers={{ click: () => onSelect(place.id) }}
            />
          )),
        )}
        {you && (
          <CircleMarker
            center={[you.lat, you.lng]}
            radius={8}
            pathOptions={{ color: 'white', weight: 3, fillColor: '#2f6fdf', fillOpacity: 1 }}
          />
        )}
      </MapContainer>
      <div className="map-key" role="group" aria-label="Show on the map">
        {levels.map(({ safety, label }) => (
          <button
            key={safety}
            type="button"
            className="map-key__toggle"
            aria-pressed={!hidden.includes(safety)}
            onClick={() => toggle(safety)}
          >
            <span className={`legend-dot pin--${safety}`} aria-hidden />
            {label}
            <span className="map-key__count">{counts.get(safety)}</span>
          </button>
        ))}
      </div>
      <IconButton
        label={full ? 'Exit full screen' : 'Full screen map'}
        className="icon-glass map-full-toggle"
        onClick={() => setFull(!full)}
      >
        {full ? <Collapse /> : <Expand />}
      </IconButton>
    </div>
  )

  return (
    <div ref={slot} className="places-map-slot">
      {createPortal(map, host)}
    </div>
  )
}
