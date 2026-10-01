import { useEffect, type ReactNode } from 'react'
import { divIcon, latLngBounds, type PointExpression } from 'leaflet'
import { CircleMarker, MapContainer, Marker, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Place } from '../data/types'
import { DENVER, type LatLng } from '../lib/geo'

interface PlacesMapProps {
  places: Place[]
  /** Where the viewer is, once they've shared it. */
  you?: LatLng
  selectedId?: string
  onSelect: (id: string | undefined) => void
  /** Controls floated over the top of the map: the view switch and filters. */
  overlay?: ReactNode
}

// Room for the controls over the top of the map and the nav over its foot,
// so framing never tucks a place underneath them.
const framePadding: { paddingTopLeft: PointExpression; paddingBottomRight: PointExpression } = {
  paddingTopLeft: [36, 150],
  paddingBottomRight: [36, 120],
}

// One cached icon per place and selected state, so markers keep their DOM (and focus) across renders.
const icons = new Map<string, ReturnType<typeof divIcon>>()

/** A small square photo of the place, ringed in its safety colour, with a point at the foot. */
function thumbnail(place: Place, selected: boolean) {
  const key = `${place.id}-${selected}`
  if (!icons.has(key)) icons.set(key, makeThumbnail(place, selected))
  return icons.get(key)!
}

function makeThumbnail(place: Place, selected: boolean) {
  const size = selected ? 60 : 46
  // The card photos are large; a pin needs only a small one.
  const src = place.image.replace(/([?&])w=\d+/, '$1w=160')
  return divIcon({
    className: '',
    html: `<span class="thumb safety--${place.safety}${selected ? ' thumb--selected' : ''}"><img src="${src}" alt="" /></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size + 7],
  })
}

/** Keeps the view framed on what matters: you and the nearest places, or every place shown. */
function Frame({ places, you }: { places: Place[]; you?: LatLng }) {
  const map = useMap()
  useEffect(() => {
    const points = places.flatMap((p) => p.locations ?? [])
    if (you) {
      const nearest = [...points]
        .sort((a, b) => Math.hypot(a.lat - you.lat, a.lng - you.lng) - Math.hypot(b.lat - you.lat, b.lng - you.lng))
        .slice(0, 5)
      map.fitBounds(latLngBounds([you, ...nearest].map((p) => [p.lat, p.lng])), { ...framePadding, maxZoom: 15 })
    } else if (points.length > 0) {
      map.fitBounds(latLngBounds(points.map((p) => [p.lat, p.lng])), { ...framePadding, maxZoom: 14 })
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

/** The whole screen is the map: photo pins for each place, the controls floated over it. */
export default function PlacesMap({ places, you, selectedId, onSelect, overlay }: PlacesMapProps) {
  return (
    <div className="places-map">
      <MapContainer
        center={[DENVER.lat, DENVER.lng]}
        zoom={11}
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
        {places.flatMap((place) =>
          (place.locations ?? []).map((location, i) => (
            <Marker
              key={`${place.id}-${i}`}
              position={[location.lat, location.lng]}
              icon={thumbnail(place, place.id === selectedId)}
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
      {overlay && <div className="map-overlay">{overlay}</div>}
    </div>
  )
}
