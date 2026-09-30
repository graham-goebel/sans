import { useParams } from 'react-router'
import { Heading, List, Section, Stack, Text } from '@dovetail-ds/react'
import { BadgeCheck, CakeSlice, EggOff, ChefHat, Coffee, CookingPot, Cookie, Croissant, MilkOff, NutOff, Star, Store, Vegan } from 'lucide-react'
import { ProductCard, RecipeCard } from '../components/cards'
import type { ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { productChips } from '../lib/chips'
import { Rail } from '../components/Rail'
import { Reviews } from '../components/Reviews'
import { scrimFor } from '../lib/scrim'
import { useToggleSet } from '../hooks'
import { avoidTrait, usePreferences } from '../lib/preferences'
import { matchesProduct, type ProductFilter } from '../lib/filters'
import { products } from '../data/products'
import { recipes } from '../data/recipes'
import { productReviews } from '../data/reviews'
import type { Product } from '../data/types'

const chips: ChipOption<ProductFilter>[] = [
  { id: 'certified', label: 'Certified GF', icon: BadgeCheck },
  { id: 'bread', label: 'Bread', icon: Croissant },
  { id: 'pasta', label: 'Pasta', icon: CookingPot },
  { id: 'snacks', label: 'Snacks', icon: Cookie },
  { id: 'baking', label: 'Baking', icon: ChefHat },
  { id: 'sweets', label: 'Sweets', icon: CakeSlice },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'dairy-free', label: 'Dairy-free', icon: MilkOff },
  { id: 'vegan', label: 'Vegan', icon: Vegan },
  { id: 'egg-free', label: 'Egg-free', icon: EggOff },
  { id: 'nut-free', label: 'Nut-free', icon: NutOff },
]

export function ProductsPage() {
  const { preferences } = usePreferences()
  const [selected, toggle, clear] = useToggleSet<ProductFilter>(preferences.avoid.map((a) => avoidTrait[a]))
  const shown = products.filter((p) => matchesProduct(p, selected))

  return (
    <ListingPage
      eyebrow="Products"
      title={
        <>
          The <em>good</em> shelf
        </>
      }
      lead="Gluten-free groceries we’d buy again, tested for taste and texture, not just the label."
      chips={chips}
      selected={selected}
      onToggle={toggle}
      onClear={clear}
      count={shown.length}
      noun={['product', 'products']}
      shelf
    >
      {shown.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ListingPage>
  )
}

/** Recipes that use a product's category, so a product page can suggest what to make. */
const pairings: Partial<Record<Product['category'], Array<(typeof recipes)[number]['category']>>> = {
  bread: ['breakfast', 'quick'],
  pasta: ['mains', 'quick'],
  baking: ['baking', 'desserts'],
  sweets: ['desserts', 'baking'],
  breakfast: ['breakfast'],
  snacks: ['quick'] }

export function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === id)
  if (!product) return <NotFoundState what="product" href="/products" />

  const related = products.filter((p) => p.id !== product.id)
  const toMake = recipes.filter((r) => pairings[product.category]?.includes(r.category))

  return (
    <>
      <DetailHero
        tone={scrimFor.product(product)}
        back={{ to: '/products', label: 'Back to all products' }}
        image={product.image}
        eyebrow={product.brand}
        title={product.name}
        dek={product.dek}
        meta={
          <>
            <MetaItem icon={<Star aria-hidden />}>{product.rating.toFixed(1)} from our testers</MetaItem>
          </>
        }
        chips={productChips(product)}
      />
      <Section>
        <div className="detail-layout">
          <Stack gap="md">
            <Heading level={2} size="heading-lg">
              Where to buy
            </Heading>
            <List
              label="Where to buy"
              items={product.whereToBuy.map((where) => ({
                id: where,
                title: where,
                leading: <Store size={20} aria-hidden /> }))}
            />
          </Stack>
          <Stack gap="md">
            <Heading level={2} size="heading-lg">
              Our take
            </Heading>
            <Text variant="lead" tone="primary">
              {product.description}
            </Text>
          </Stack>
        </div>
      </Section>
      <Section>
        <Reviews reviews={productReviews[product.id] ?? []} />
      </Section>
      {toMake.length > 0 && (
        <Section tone="secondary-muted">
          <Rail eyebrow="Put it to use" title="Recipes to make with it" to="/recipes">
            {toMake.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </Rail>
        </Section>
      )}
      <Section tone="subtle">
        <Rail eyebrow="Also on the shelf" title="More products" to="/products" size="narrow">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Rail>
      </Section>
    </>
  )
}
