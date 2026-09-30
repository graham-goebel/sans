import { useEffect } from 'react'
import { divIcon, latLngBounds } from 'leaflet'
import { CircleMarker, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Place, Safety } from '../data/types'
import { DENVER, type LatLng } from '../lib/geo'

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

export default function PlacesMap({ places, you, selectedId, onSelect }: PlacesMapProps) {
  return (
    <div className="places-map">
      <MapContainer center={[DENVER.lat, DENVER.lng]} zoom={11} scrollWheelZoom={false} style={{ height: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        <Frame places={places} you={you} />
        {places.flatMap((place) =>
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
    </div>
  )
}
