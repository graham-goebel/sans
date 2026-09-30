import { useParams } from 'react-router'
import { Checkbox, Heading, Section, Stack, Text } from '@dovetail-ds/react'
import { CakeSlice, ChefHat, Clock, Croissant, EggOff, MilkOff, NutOff, Sunrise, Timer, Users, UtensilsCrossed, Vegan } from 'lucide-react'
import { RecipeCard } from '../components/cards'
import type { ChipOption } from '../components/FilterChips'
import { DetailHero, ListingPage, MetaItem, NotFoundState } from '../components/layout'
import { recipeChips } from '../lib/chips'
import { Rail } from '../components/Rail'
import { Reviews } from '../components/Reviews'
import { useToggleSet } from '../hooks'
import { matchesRecipe, type RecipeFilter } from '../lib/filters'
import { recipes } from '../data/recipes'
import { recipeReviews } from '../data/reviews'

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

export function RecipesPage() {
  const [selected, toggle, clear] = useToggleSet<RecipeFilter>()
  const shown = recipes.filter((r) => matchesRecipe(r, selected))

  return (
    <ListingPage
      eyebrow="Recipes"
      title={
        <>
          Cook it <em>yourself</em>
        </>
      }
      lead="Tested gluten-free recipes, from quick weeknight bowls to a proper sourdough."
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
        back={{ to: '/recipes', label: 'Back to all recipes' }}
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
        chips={recipeChips(recipe)}
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
      <Section>
        <Reviews reviews={recipeReviews[recipe.id] ?? []} />
      </Section>
      <Section tone="subtle">
        <Rail eyebrow="Keep cooking" title="More recipes" to="/recipes">
          {more.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </Rail>
      </Section>
    </>
  )
}
