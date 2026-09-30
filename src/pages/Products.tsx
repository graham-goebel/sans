import { useParams } from 'react-router'
import { Badge, Heading, List, Section, Stack, Text } from '@dovetail-ds/react'
import { BadgeCheck, CakeSlice, ChefHat, Coffee, CookingPot, Cookie, Croissant, MilkOff, NutOff, Star, Store, Tag, Vegan } from 'lucide-react'
import { ProductCard, RecipeCard } from '../components/cards'
import type { ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { Rail } from '../components/Rail'
import { useToggleSet } from '../hooks'
import { products } from '../data/products'
import { recipes } from '../data/recipes'
import { traitLabel } from '../data/traits'
import type { Product, Trait } from '../data/types'

type ProductFilter = Product['category'] | 'certified' | Trait

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
  { id: 'nut-free', label: 'Nut-free', icon: NutOff },
]

const categories = new Set<string>(['bread', 'pasta', 'snacks', 'baking', 'sweets', 'breakfast'])

/** Categories widen the list (any of them); certification and diet chips narrow it (all of them). */
function matches(product: Product, selected: ProductFilter[]) {
  const picked = selected.filter((f) => categories.has(f))
  if (picked.length > 0 && !picked.includes(product.category)) return false
  if (selected.includes('certified') && !product.certified) return false
  return selected.filter((f): f is Trait => f in traitLabel).every((t) => product.traits.includes(t))
}

export function ProductsPage() {
  const [selected, toggle, clear] = useToggleSet<ProductFilter>()
  const shown = products.filter((p) => matches(p, selected))

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
  snacks: ['quick'],
}

export function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === id)
  if (!product) return <NotFoundState what="product" href="/products" />

  const related = products.filter((p) => p.id !== product.id)
  const toMake = recipes.filter((r) => pairings[product.category]?.includes(r.category))

  return (
    <>
      <DetailHero
        back={{ href: '#/products', label: 'All products' }}
        image={product.image}
        eyebrow={product.brand}
        title={product.name}
        dek={product.dek}
        meta={
          <>
            <MetaItem icon={<Tag aria-hidden />}>{product.price}</MetaItem>
            <MetaItem icon={<Star aria-hidden />}>{product.rating.toFixed(1)} from our testers</MetaItem>
          </>
        }
        badges={
          <>
            {product.certified ? (
              <Badge tone="primary">Certified gluten-free</Badge>
            ) : (
              <Badge tone="warning">Gluten-free, not certified</Badge>
            )}
            {product.traits.map((t) => (
              <Badge key={t}>{traitLabel[t]}</Badge>
            ))}
          </>
        }
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
                leading: <Store size={20} aria-hidden />,
              }))}
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
