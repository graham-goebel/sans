import { Callout } from '@dovetail-ds/react'
import type { Place } from '../data/types'
import { usePreferences } from '../lib/preferences'

/** For people who told us they have coeliac disease: a word of caution on shared kitchens. */
export function CoeliacNote({ place }: { place: Place }) {
  const { preferences } = usePreferences()
  if (!preferences.conditions.includes('coeliac') || place.safety !== 'gf-options') return null
  return (
    <Callout tone="caution" title="Shared kitchen">
      You told us you have coeliac disease. Places with gluten-free options cook in a shared kitchen, so ask how
      they prevent cross-contact before you order.
    </Callout>
  )
}
