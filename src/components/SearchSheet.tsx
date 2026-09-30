import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { EmptyState, Input, List, Sheet, Stack, Text } from '@dovetail-ds/react'
import { Search } from 'lucide-react'
import { places } from '../data/places'
import { products } from '../data/products'
import { recipes } from '../data/recipes'

interface Result {
  id: string
  kind: 'Recipe' | 'Product' | 'Place'
  title: string
  detail: string
  image: string
  path: string
  haystack: string
}

const index: Result[] = [
  ...recipes.map((r) => ({
    id: `recipe-${r.id}`,
    kind: 'Recipe' as const,
    title: r.title,
    detail: `${r.minutes} min · ${r.difficulty}`,
    image: r.image,
    path: `/recipes/${r.id}`,
    haystack: [r.title, r.category, r.dek, ...r.ingredients].join(' '),
  })),
  ...products.map((p) => ({
    id: `product-${p.id}`,
    kind: 'Product' as const,
    title: p.name,
    detail: `${p.brand} · ${p.price}`,
    image: p.image,
    path: `/products/${p.id}`,
    haystack: [p.name, p.brand, p.category, p.dek].join(' '),
  })),
  ...places.map((p) => ({
    id: `place-${p.id}`,
    kind: 'Place' as const,
    title: p.name,
    detail: `${p.neighborhood}, ${p.city}`,
    image: p.image,
    path: `/places/${p.id}`,
    haystack: [p.name, p.type, p.city, p.neighborhood, p.dek].join(' '),
  })),
]

interface SearchSheetProps {
  open: boolean
  onClose: () => void
}

export function SearchSheet({ open, onClose }: SearchSheetProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // The sheet focuses its close button on open; move focus to the field once it settles.
  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => document.getElementById('search-field')?.focus(), 80)
    return () => window.clearTimeout(timer)
  }, [open])

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) return []
    return index.filter((r) => words.every((w) => r.haystack.toLowerCase().includes(w)))
  }, [query])

  const go = (path: string) => {
    onClose()
    setQuery('')
    navigate(path)
  }

  return (
    <Sheet open={open} onClose={onClose} title="Search" size="lg">
      <Stack gap="lg">
        <Input
          aria-label="Search recipes, products and places"
          placeholder="Try “pizza”, “bakery” or “Chicago”"
          iconStart={<Search />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          id="search-field"
          type="search"
        />
        {query.trim() === '' ? (
          <Text variant="small" tone="secondary">
            Search across {recipes.length} recipes, {products.length} products and {places.length} places.
          </Text>
        ) : results.length === 0 ? (
          <EmptyState title="Nothing yet" description="Try a different word, like an ingredient or a city." />
        ) : (
          <List
            label="Search results"
            interactive
            items={results.map((r) => ({
              id: r.id,
              title: r.title,
              description: `${r.kind} · ${r.detail}`,
              leading: <img src={r.image} alt="" className="result-thumb" />,
              onClick: () => go(r.path),
            }))}
          />
        )}
      </Stack>
    </Sheet>
  )
}
