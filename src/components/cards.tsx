import type { CSSProperties, MouseEvent } from 'react'
import { Card, Image } from '@dovetail-ds/react'
import { placeSummary } from '../data/places'
import type { Place, Product, Recipe } from '../data/types'
import { formatMiles } from '../lib/geo'
import { FlagChips } from './flags'
import { useQuickViewClick } from '../lib/quickView'
import { scrimFor, scrimStyle, type ScrimTone } from '../lib/scrim'

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

interface LogoCardProps {
  href: string
  image: string
  logo: string
  name: string
  tone: ScrimTone
  onClick: (event: MouseEvent) => void
}

/**
 * A featured partner's card: their photo under the page's colour scrim, with
 * their logo centred in place of the title. The logo's alt text names the
 * link for screen readers.
 */
function LogoCard({ href, image, logo, name, tone, onClick }: LogoCardProps) {
  return (
    <div className="card-wrap" onClick={onClick}>
      <a className="logo-card" href={href} style={scrimStyle(tone)}>
        <img className="logo-card__photo" src={image} alt="" />
        <img className="logo-card__logo" src={logo} alt={name} />
        <span className="logo-card__label">Featured</span>
      </a>
    </div>
  )
}

/** Product shot bled to the card's top and sides, the details underneath, like a shop shelf. Opens the quick view. */
export function ProductCard({ product }: { product: Product }) {
  const onClick = useQuickViewClick('product', product.id)
  if (product.featured) {
    return (
      <LogoCard
        href={`#/products/${product.id}`}
        image={product.image}
        logo={product.featured.logo}
        name={`${product.brand}: ${product.name}`}
        tone={scrimFor.product(product)}
        onClick={onClick}
      />
    )
  }
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

/**
 * Tall photo card for somewhere to eat or shop, with its distance once we know where you are.
 * Opens the quick view. "Unverified" isn't shown here; the quick view and page carry it.
 */
export function PlaceCard({ place, miles }: { place: Place; miles?: number }) {
  const onClick = useQuickViewClick('place', place.id)
  if (place.featured) {
    return (
      <LogoCard
        href={`#/places/${place.id}`}
        image={place.image}
        logo={place.featured.logo}
        name={place.name}
        tone={scrimFor.place(place)}
        onClick={onClick}
      />
    )
  }
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
      <FlagChips flags={place.flags} iconOnly />
    </div>
  )
}
