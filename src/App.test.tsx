import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { places } from './data/places'
import { products } from './data/products'
import { recipes } from './data/recipes'

function visit(path: string) {
  window.location.hash = path
  return render(<App />)
}

const pages = [
  '/',
  '/recipes',
  '/products',
  '/places',
  '/about',
  '/privacy',
  '/terms',
  '/credits',
  ...recipes.map((r) => `/recipes/${r.id}`),
  ...products.map((p) => `/products/${p.id}`),
  ...places.map((p) => `/places/${p.id}`),
]

describe('every page', () => {
  it.each(pages)('%s renders a heading without crashing', (path) => {
    visit(path)
    expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0)
    expect(screen.queryByText('Something went wrong on this page')).toBeNull()
  })
})

describe('the shell', () => {
  it('says the content is sample data', () => {
    visit('/')
    expect(screen.getByRole('note').textContent).toMatch(/sample content/i)
  })

  it('shows the nav on section pages', () => {
    visit('/recipes')
    expect(screen.getByRole('link', { name: 'Recipes' })).toBeTruthy()
  })

  it('hides the nav on an item page and offers a way back', () => {
    visit(`/places/${places[0].id}`)
    expect(screen.queryByRole('link', { name: 'Recipes' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Back to all places' })).toBeTruthy()
  })

  it('marks an unverified place and lists its sources', () => {
    const place = places.find((p) => p.verification === 'unverified')!
    visit(`/places/${place.id}`)
    expect(screen.getByText('Not yet confirmed')).toBeTruthy()
    expect(screen.getAllByText('Unverified').length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: new RegExp(place.sources[0].label) })).toBeTruthy()
  })

  it('shows a friendly page for unknown addresses', () => {
    visit('/nowhere')
    expect(screen.getByText('We couldn’t find that page')).toBeTruthy()
  })
})

describe('listing filters', () => {
  it('narrows the recipe grid when a chip is pressed', async () => {
    visit('/recipes')
    expect(screen.getByText(`${recipes.length} recipes`)).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: 'Vegan' }))
    const vegan = recipes.filter((r) => r.traits.includes('vegan')).length
    expect(screen.getByText(new RegExp(`^${vegan} recipes? match your filters$`))).toBeTruthy()
  })
})
