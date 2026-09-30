import type { ComponentType } from 'react'
import { Text } from '@dovetail-ds/react'
import {
  BadgeCheck,
  BookOpen,
  CookingPot,
  Droplets,
  GraduationCap,
  MessageCircleWarning,
  Package,
  Sandwich,
  ShieldCheck,
  TriangleAlert,
  Utensils,
} from 'lucide-react'
import type { Precaution, PrecautionKind } from '../data/types'

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

/** How a place handles gluten, one line each, with an icon per precaution. */
export function PrecautionList({ precautions }: { precautions: Precaution[] }) {
  return (
    <ul className="precautions" aria-label="Precautions">
      {precautions.map((p) => {
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
  )
}
