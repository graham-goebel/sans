import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Button, Callout, Sheet, Stack, Text } from '@dovetail-ds/react'
import { ArrowRight, Clock, Difficulty, MapPin, Store, Users } from '../icons'
import { places } from '../data/places'
import { products } from '../data/products'
import { recipes } from '../data/recipes'
import { placeChips, productChips, recipeChips, type ChipSpec } from '../lib/chips'
import { QuickViewContext, type ItemKind, type QuickViewTarget } from '../lib/quickView'
import { ChipList } from './itemChips'
import { MetaItem } from './layout'
import { PrecautionList } from './precautions'
import { SimpleList } from './SimpleList'
import { CoeliacNote } from './CoeliacNote'
import { ItemMenu } from './ItemMenu'
import { scrimFor, scrimStyle, type ScrimTone } from '../lib/scrim'

const paths: Record<ItemKind, string> = { recipe: '/recipes', product: '/products', place: '/places' }
const fullPageLabel: Record<ItemKind, string> = {
  recipe: 'See the full recipe',
  product: 'See the full product',
  place: 'See the full place',
}

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<QuickViewTarget>()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const show = (next: QuickViewTarget) => {
    setTarget(next)
    setOpen(true)
  }
  const goToFullPage = () => {
    if (!target) return
    setOpen(false)
    navigate(`${paths[target.kind]}/${target.id}`)
  }

  const content = target ? preview(target) : undefined

  return (
    <QuickViewContext.Provider value={show}>
      {children}
      {content && (
        <Sheet
          className="item-sheet"
          open={open}
          onClose={() => setOpen(false)}
          eyebrow={content.eyebrow}
          title={content.title}
          size="lg"
          action={
            <ItemMenu
              path={`${paths[target!.kind]}/${target!.id}`}
              title={content.title}
              onOpenFullPage={goToFullPage}
              directionsTo={content.directionsTo}
            />
          }
          footer={
            <Button variant="primary" fullWidth iconEnd={<ArrowRight />} onClick={goToFullPage}>
              {fullPageLabel[target!.kind]}
            </Button>
          }
        >
          <Stack gap="lg">
            <div className="quick-photo" style={scrimStyle(content.tone)}>
              <img src={content.image} alt="" />
              {content.photoNote && <span className="photo-note">{content.photoNote}</span>}
            </div>
            <Text variant="lead">{content.dek}</Text>
            <ChipList chips={content.chips} />
            {content.body}
          </Stack>
        </Sheet>
      )}
    </QuickViewContext.Provider>
  )
}

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

interface Preview {
  eyebrow: string
  title: string
  image: string
  photoNote?: string
  dek: string
  chips: ChipSpec[]
  tone: ScrimTone
  /** Where "Get directions" should point, for places. */
  directionsTo?: string
  body: ReactNode
}

/** The essentials of an item: enough to decide whether to open the full page. */
function preview({ kind, id }: QuickViewTarget): Preview | undefined {
  if (kind === 'recipe') {
    const recipe = recipes.find((r) => r.id === id)
    if (!recipe) return undefined
    const shown = recipe.ingredients.slice(0, 5)
    return {
      eyebrow: recipe.category === 'quick' ? 'Quick' : capitalise(recipe.category),
      title: recipe.title,
      image: recipe.image,
      dek: recipe.dek,
      chips: recipeChips(recipe),
      tone: scrimFor.recipe(recipe),
      body: (
        <Stack gap="md">
          <div className="meta-row">
            <MetaItem icon={<Clock aria-hidden />}>{recipe.minutes} min</MetaItem>
            <MetaItem icon={<Users aria-hidden />}>Serves {recipe.serves}</MetaItem>
            <MetaItem icon={<Difficulty aria-hidden />}>{recipe.difficulty}</MetaItem>
          </div>
          <SimpleList label="Ingredients" items={shown} />
          {recipe.ingredients.length > shown.length && (
            <Text variant="small" tone="secondary">
              + {recipe.ingredients.length - shown.length} more ingredients and the method on the full recipe.
            </Text>
          )}
        </Stack>
      ),
    }
  }

  if (kind === 'product') {
    const product = products.find((p) => p.id === id)
    if (!product) return undefined
    return {
      eyebrow: product.brand,
      title: product.name,
      image: product.image,
      dek: product.dek,
      chips: productChips(product),
      tone: scrimFor.product(product),
      body: (
        <SimpleList label="Where to buy" items={product.whereToBuy} icon={<Store aria-hidden />} />
      ),
    }
  }

  const place = places.find((p) => p.id === id)
  if (!place) return undefined
  const unverified = place.verification === 'unverified'
  return {
    eyebrow: `${capitalise(place.type)} · ${place.neighborhood}, ${place.city}`,
    title: place.name,
    image: place.image,
    photoNote: unverified ? 'Illustrative photo' : undefined,
    dek: place.dek,
    chips: placeChips(place),
    tone: scrimFor.place(place),
    directionsTo: place.locations?.length === 1 ? `${place.name}, ${place.address}, ${place.city}, CO` : undefined,
    body: (
      <Stack gap="md">
        <div className="meta-row">
          <MetaItem icon={<MapPin aria-hidden />}>{place.address}</MetaItem>
          {place.hours && <MetaItem icon={<Clock aria-hidden />}>{place.hours}</MetaItem>}
        </div>
        <PrecautionList precautions={place.precautions} />
        <CoeliacNote place={place} />
        {unverified && (
          <Callout tone="caution" title="Not yet confirmed">
            These details come from public listings and press. Call ahead before you go.
          </Callout>
        )}
      </Stack>
    ),
  }
}
