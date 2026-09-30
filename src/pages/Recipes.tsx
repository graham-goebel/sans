import { useParams } from 'react-router'
import { Badge, Checkbox, Heading, Section, Stack, Text } from '@dovetail-ds/react'
import { CakeSlice, ChefHat, Clock, Croissant, EggOff, MilkOff, NutOff, Sunrise, Timer, Users, UtensilsCrossed, Vegan } from 'lucide-react'
import { RecipeCard } from '../components/cards'
import type { ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { Rail } from '../components/Rail'
import { useToggleSet } from '../hooks'
import { unsplash } from '../data/images'
import { recipes } from '../data/recipes'
import { traitLabel } from '../data/traits'
import type { Recipe, Trait } from '../data/types'

type RecipeFilter = Recipe['category'] | Trait

const chips: ChipOption<RecipeFilter>[] = [
  { id: 'breakfast', label: 'Breakfast', icon: Sunrise },
  { id: 'mains', label: 'Mains', icon: UtensilsCrossed },
  { id: 'baking', label: 'Baking', icon: Croissant },
  { id: 'desserts', label: 'Desserts', icon: CakeSlice },
  { id: 'quick', label: 'Under 30 min', icon: Timer },
  { id: 'dairy-free', label: 'Dairy-free', icon: MilkOff },
  { id: 'vegan', label: 'Vegan', icon: Vegan },
  { id: 'egg-free', label: 'Egg-free', icon: EggOff },
  { id: 'nut-free', label: 'Nut-free', icon: NutOff },
]

const categories = new Set<string>(['breakfast', 'mains', 'baking', 'desserts'])

/** Categories widen the list (any of them); "Under 30 min" and diet chips narrow it (all of them). */
function matches(recipe: Recipe, selected: RecipeFilter[]) {
  const picked = selected.filter((f) => categories.has(f))
  if (picked.length > 0 && !picked.includes(recipe.category)) return false
  if (selected.includes('quick') && recipe.minutes > 30) return false
  return selected.filter((f): f is Trait => f in traitLabel).every((t) => recipe.traits.includes(t))
}

export function RecipesPage() {
  const [selected, toggle, clear] = useToggleSet<RecipeFilter>()
  const shown = recipes.filter((r) => matches(r, selected))

  return (
    <ListingPage
      eyebrow="Recipes"
      title={
        <>
          Cook it <em>yourself</em>
        </>
      }
      lead="Tested gluten-free recipes, from quick weeknight bowls to a proper sourdough."
      image={unsplash('1490645935967-10de6ba17061', 1600)}
      chips={chips}
      selected={selected}
      onToggle={toggle}
      onClear={clear}
      count={shown.length}
      noun={['recipe', 'recipes']}
    >
      {shown.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </ListingPage>
  )
}

export function RecipeDetail() {
  const { id } = useParams()
  const recipe = recipes.find((r) => r.id === id)
  if (!recipe) return <NotFoundState what="recipe" href="/recipes" />

  const more = recipes.filter((r) => r.id !== recipe.id)

  return (
    <>
      <DetailHero
        back={{ href: '#/recipes', label: 'All recipes' }}
        image={recipe.image}
        eyebrow={recipe.category === 'quick' ? 'Quick' : recipe.category}
        title={recipe.title}
        dek={recipe.dek}
        meta={
          <>
            <MetaItem icon={<Clock aria-hidden />}>{recipe.minutes} min</MetaItem>
            <MetaItem icon={<Users aria-hidden />}>Serves {recipe.serves}</MetaItem>
            <MetaItem icon={<ChefHat aria-hidden />}>{recipe.difficulty}</MetaItem>
          </>
        }
        badges={
          <>
            <Badge tone="primary">Gluten-free</Badge>
            {recipe.traits.map((t) => (
              <Badge key={t}>{traitLabel[t]}</Badge>
            ))}
          </>
        }
      />
      <Section>
        <div className="detail-layout">
          <Stack gap="md">
            <Heading level={2} size="heading-lg">
              Ingredients
            </Heading>
            <Stack gap="sm">
              {recipe.ingredients.map((item) => (
                <Checkbox key={item} label={item} />
              ))}
            </Stack>
          </Stack>
          <Stack gap="md">
            <Heading level={2} size="heading-lg">
              Method
            </Heading>
            <ol className="steps">
              {recipe.steps.map((step) => (
                <li key={step}>
                  <Text>{step}</Text>
                </li>
              ))}
            </ol>
          </Stack>
        </div>
      </Section>
      <Section tone="subtle">
        <Rail eyebrow="Keep cooking" title="More recipes" href="#/recipes">
          {more.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </Rail>
      </Section>
    </>
  )
}
