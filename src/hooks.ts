import { useCallback, useState } from 'react'
import type { LatLng } from './lib/geo'

/** A set of toggled ids, for chip filters. */
export function useToggleSet<T extends string>() {
  const [selected, setSelected] = useState<T[]>([])
  const toggle = (id: T) =>
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
  return [selected, toggle, () => setSelected([])] as const
}

export type NearMeStatus = 'idle' | 'locating' | 'ready' | 'denied' | 'unavailable'

/**
 * The viewer's location, asked for only when they tap "Near me". It stays in
 * this tab: nothing is stored or sent anywhere.
 */
export function useNearMe() {
  const [status, setStatus] = useState<NearMeStatus>('idle')
  const [position, setPosition] = useState<LatLng>()

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude })
        setStatus('ready')
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    )
  }, [])

  const clear = useCallback(() => {
    setPosition(undefined)
    setStatus('idle')
  }, [])

  return { status, position, locate, clear }
}
