import { Card, Image } from '@dovetail-ds/react'
import { placeSummary } from '../data/places'
import type { Place, Product, Recipe } from '../data/types'
import { FlagChips } from './flags'

/** Portrait photo card: the recipe's picture with its title set over it. */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="card-wrap">
      <Card
        className="photo-card"
        href={`#/recipes/${recipe.id}`}
        background={recipe.image}
        onMedia="white"
        eyebrow={`${recipe.minutes} min · ${recipe.difficulty}`}
        title={recipe.title}
      />
      <FlagChips flags={recipe.flags} />
    </div>
  )
}

/** Product shot bled to the card's top and sides, the details underneath, like a shop shelf. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card-wrap">
      <Card
        href={`#/products/${product.id}`}
        style={{ overflow: 'hidden', height: '100%' }}
        media={
          <div className="card-bleed">
            <Image src={product.image} alt="" ratio="square" radius="none" />
          </div>
        }
        eyebrow={product.brand}
        title={product.name}
        description={product.price}
      />
      <FlagChips flags={product.flags} certified={product.certified} />
    </div>
  )
}

/** Landscape photo card for somewhere to eat or shop. */
export function PlaceCard({ place }: { place: Place }) {
  return (
    <div className="card-wrap">
      <Card
        className="photo-card photo-card--landscape"
        href={`#/places/${place.id}`}
        background={place.image}
        onMedia="white"
        eyebrow={`${place.neighborhood}, ${place.city}`}
        title={place.name}
        description={placeSummary(place)}
      />
      <FlagChips flags={place.flags} unverified={place.verification === 'unverified'} />
    </div>
  )
}
