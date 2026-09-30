import { Card, Image } from '@dovetail-ds/react'
import { safetyLabel } from '../data/places'
import type { Place, Product, Recipe } from '../data/types'

/** Portrait photo card: the recipe's picture with its title set over it. */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card
      className="photo-card"
      href={`#/recipes/${recipe.id}`}
      background={recipe.image}
      onMedia="white"
      eyebrow={`${recipe.minutes} min · ${recipe.difficulty}`}
      title={recipe.title}
    />
  )
}

/** Product shot on top, the details underneath, like a shop shelf. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      href={`#/products/${product.id}`}
      media={<Image src={product.image} alt="" ratio="square" />}
      eyebrow={product.brand}
      title={product.name}
      description={product.certified ? `${product.price} · Certified GF` : product.price}
    />
  )
}

/** Landscape photo card for somewhere to eat or shop. */
export function PlaceCard({ place }: { place: Place }) {
  return (
    <Card
      className="photo-card photo-card--landscape"
      href={`#/places/${place.id}`}
      background={place.image}
      onMedia="white"
      eyebrow={`${place.neighborhood}, ${place.city}`}
      title={place.name}
      description={`${safetyLabel[place.safety]} · ${place.price}`}
    />
  )
}
