import type { CSSProperties } from 'react'
import { Card, Image } from '@dovetail-ds/react'
import { placeSummary } from '../data/places'
import type { Place, Product, Recipe } from '../data/types'
import { formatMiles } from '../lib/geo'
import { FlagChips } from './flags'
import { useQuickViewClick } from '../lib/quickView'

// Photo-background cards: the picture is the edge, so no border around it.
const photoCardStyle: CSSProperties = { border: 0 }

/** Portrait photo card: the recipe's picture with its title set over it. Opens the quick view. */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const onClick = useQuickViewClick('recipe', recipe.id)
  return (
    <div className="card-wrap" onClick={onClick}>
      <Card
        className="photo-card"
        style={photoCardStyle}
        href={`#/recipes/${recipe.id}`}
        background={recipe.image}
        onMedia="white"
        eyebrow={`${recipe.minutes} min · ${recipe.difficulty}`}
        title={recipe.title}
      />
      <FlagChips flags={recipe.flags} iconOnly />
    </div>
  )
}

// Tighter padding for the small shelf cards; the photo's bleed follows it.
const productCardStyle = {
  overflow: 'hidden',
  height: '100%',
  '--dt-card-padding': 'var(--dt-space-inset-md)',
} as CSSProperties

/** Product shot bled to the card's top and sides, the details underneath, like a shop shelf. Opens the quick view. */
export function ProductCard({ product }: { product: Product }) {
  const onClick = useQuickViewClick('product', product.id)
  return (
    <div className="card-wrap" onClick={onClick}>
      <Card
        href={`#/products/${product.id}`}
        style={productCardStyle}
        media={
          <div className="card-bleed">
            <Image src={product.image} alt="" ratio="square" radius="none" />
          </div>
        }
        eyebrow={product.brand}
        title={product.name}
      />
      <FlagChips flags={product.flags} certified={product.certified} iconOnly />
    </div>
  )
}

/** Tall photo card for somewhere to eat or shop, with its distance once we know where you are. Opens the quick view. */
export function PlaceCard({ place, miles }: { place: Place; miles?: number }) {
  const onClick = useQuickViewClick('place', place.id)
  return (
    <div className="card-wrap" onClick={onClick}>
      <Card
        className="photo-card"
        style={photoCardStyle}
        href={`#/places/${place.id}`}
        background={place.image}
        onMedia="white"
        eyebrow={
          miles === undefined
            ? `${place.neighborhood}, ${place.city}`
            : `${formatMiles(miles)} · ${place.neighborhood}`
        }
        title={place.name}
        description={placeSummary(place)}
      />
      <FlagChips flags={place.flags} unverified={place.verification === 'unverified'} iconOnly />
    </div>
  )
}
