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
  it('says in the footer that the content is a prototype', () => {
    visit('/')
    expect(screen.getByRole('contentinfo').textContent).toMatch(/Prototype\..*unverified.*sample content/i)
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

describe('quick view', () => {
  it('opens a card in a sheet, with a way to the full page', async () => {
    visit('/recipes')
    const first = recipes[0]
    await userEvent.click(screen.getAllByRole('link', { name: first.title })[0])
    expect(window.location.hash).toBe('#/recipes')
    const sheet = await screen.findByRole('dialog')
    expect(sheet.textContent).toContain(first.dek)
    expect(sheet.textContent).toContain('Wheat-free')
    expect(screen.getByRole('button', { name: 'More options' })).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: 'See the full recipe' }))
    expect(window.location.hash).toBe(`#/recipes/${first.id}`)
  })
})

describe('cards', () => {
  it('shows a featured partner as a logo card, named by its logo', () => {
    const featured = products.find((p) => p.featured)!
    visit('/products')
    const logo = screen.getByRole('img', { name: `${featured.brand}: ${featured.name}` })
    expect(logo.closest('a')?.getAttribute('href')).toBe(`#/products/${featured.id}`)
    expect(screen.getByText('Featured')).toBeTruthy()
  })

  it('keeps "Unverified" off place cards but on the place itself', () => {
    visit('/places')
    expect(document.querySelector('.card-grid .flag--unverified')).toBeNull()
    visit(`/places/${places[0].id}`)
    expect(screen.getAllByText('Unverified').length).toBeGreaterThan(0)
  })
})

describe('products', () => {
  it('doesn’t show prices, which vary by shop', () => {
    visit('/products')
    expect(screen.queryByText(products[0].price)).toBeNull()
    visit(`/products/${products[0].id}`)
    expect(screen.queryByText(products[0].price)).toBeNull()
  })
})

describe('search', () => {
  it('opens with recommendations before anything is typed', async () => {
    visit('/')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    const sheet = await screen.findByRole('dialog')
    expect(sheet.textContent).toContain('Recommended')
    expect(sheet.textContent).toContain('Teocalli Cocina')
  })
})

describe('preferences', () => {
  it('opens from the profile button and remembers choices on this device', async () => {
    window.localStorage.clear()
    visit('/')
    await userEvent.click(screen.getAllByRole('button', { name: 'Your preferences' })[0])
    await screen.findByRole('dialog')
    await userEvent.click(screen.getByRole('radio', { name: /Coeliac disease/ }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Dairy' }))
    expect(JSON.parse(window.localStorage.getItem('sans:preferences')!)).toMatchObject({
      condition: 'coeliac',
      avoid: ['dairy'],
    })
  })

  it('starts recipes filtered to what you avoid', () => {
    window.localStorage.setItem('sans:preferences', JSON.stringify({ avoid: ['dairy'] }))
    visit('/recipes')
    const dairyFree = recipes.filter((r) => r.traits.includes('dairy-free')).length
    expect(screen.getByRole('button', { name: 'Dairy-free' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText(new RegExp(`^${dairyFree} recipes? match your filters$`))).toBeTruthy()
    window.localStorage.clear()
  })

  it('warns people with coeliac disease about shared kitchens', () => {
    window.localStorage.setItem('sans:preferences', JSON.stringify({ condition: 'coeliac' }))
    const shared = places.find((p) => p.safety === 'gf-options')!
    visit(`/places/${shared.id}`)
    expect(screen.getByText('Shared kitchen')).toBeTruthy()
    window.localStorage.clear()
  })

  it('still works when storage is blocked', () => {
    const getItem = Storage.prototype.getItem
    Storage.prototype.getItem = () => {
      throw new Error('blocked')
    }
    visit('/')
    expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0)
    Storage.prototype.getItem = getItem
  })
})

describe('places map', () => {
  it('switches to the map view and back', async () => {
    visit('/places')
    await userEvent.click(screen.getByRole('tab', { name: 'Map' }))
    expect(window.location.hash).toBe('#/places?view=map')
    expect(await screen.findByText('Tap a pin to preview the place.')).toBeTruthy()
    await userEvent.click(screen.getByRole('tab', { name: 'List' }))
    expect(window.location.hash).toBe('#/places')
  })

  it('explains when location is turned off', async () => {
    const original = navigator.geolocation
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition: (_ok: unknown, fail: (e: object) => void) => fail({ code: 1, PERMISSION_DENIED: 1 }) },
    })
    visit('/places')
    await userEvent.click(screen.getByRole('button', { name: 'Near me' }))
    expect(screen.getByRole('status').textContent).toMatch(/Location is turned off/)
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: original })
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
