import { useEffect, useMemo, useState, type ComponentType, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { EmptyState, Heading, Input, List, Sheet, Stack, Tag, Text } from '@dovetail-ds/react'
import { Coffee, Croissant, Search, SearchX, ShoppingBasket, Store, Utensils, Recipe } from '../icons'
import { recommendations, search, type Kind, type Result } from '../lib/search'

const kinds: { id: Kind; label: string; icon: ComponentType }[] = [
  { id: 'recipe', label: 'Recipes', icon: Recipe },
  { id: 'product', label: 'Products', icon: ShoppingBasket },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'cafe', label: 'Cafés', icon: Coffee },
  { id: 'bakery', label: 'Bakeries', icon: Croissant },
  { id: 'market', label: 'Markets', icon: Store },
]

/** Results are listed in three groups; Places covers every kind of place. */
const groups: { title: string; kinds: Kind[] }[] = [
  { title: 'Recipes', kinds: ['recipe'] },
  { title: 'Products', kinds: ['product'] },
  { title: 'Places', kinds: ['restaurant', 'cafe', 'bakery', 'market'] },
]

/** Tag renders a span with role="button"; give it a button's keys. */
const pressOnKeys = (action: () => void) => (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    action()
  }
}

interface SearchSheetProps {
  open: boolean
  onClose: () => void
}

export function SearchSheet({ open, onClose }: SearchSheetProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Kind[]>([])
  const navigate = useNavigate()

  // The sheet focuses its close button on open; move focus to the field once it settles.
  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => document.getElementById('search-field')?.focus(), 80)
    return () => window.clearTimeout(timer)
  }, [open])

  const hasQuery = query.trim() !== ''

  // Everything the query matches, before the type chips narrow it down.
  const matched = useMemo(() => search(query), [query])
  const searching = hasQuery || selected.length > 0
  const shown = matched.filter((r) => selected.length === 0 || selected.includes(r.kind))

  const toggle = (kind: Kind) =>
    setSelected((current) => (current.includes(kind) ? current.filter((k) => k !== kind) : [...current, kind]))

  const go = (path: string) => {
    onClose()
    setQuery('')
    setSelected([])
    navigate(path)
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Search"
      size="lg"
      className="search-sheet item-sheet"
      // A fixed height, so the sheet doesn't jump as results come and go.
      style={{ height: 'min(620px, calc(100% - var(--dt-sheet-top-gap)))' }}
      footer={
        <div className="search-filters" role="group" aria-label="Show only">
          {kinds.map(({ id, label, icon: Icon }) => {
            const count = hasQuery ? matched.filter((r) => r.kind === id).length : undefined
            return (
              <Tag
                key={id}
                selected={selected.includes(id)}
                onClick={() => toggle(id)}
                onKeyDown={pressOnKeys(() => toggle(id))}
              >
                <span className="chip">
                  <Icon aria-hidden />
                  {label}
                  {count !== undefined && <span className="chip-count">{count}</span>}
                </span>
              </Tag>
            )
          })}
        </div>
      }
    >
      <Stack gap="lg">
        <Input
          aria-label="Search recipes, products and places"
          placeholder="Try “pizza”, “bakery” or “LoHi”"
          iconStart={<Search />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          id="search-field"
          type="search"
        />
        {!searching ? (
          <Stack gap="md">
            <Text variant="eyebrow" tone="brand">
              Recommended
            </Text>
            <ResultGroups results={recommendations} onOpen={go} />
          </Stack>
        ) : shown.length === 0 ? (
          <EmptyState
            icon={<SearchX />}
            title="Nothing yet"
            description={
              selected.length > 0
                ? 'Try another word, or turn off a filter below.'
                : 'Try a different word, like an ingredient or a city.'
            }
          />
        ) : (
          <ResultGroups results={shown} onOpen={go} />
        )}
      </Stack>
    </Sheet>
  )
}

/** Results grouped as Recipes, Products and Places, each with a count. */
function ResultGroups({ results, onOpen }: { results: Result[]; onOpen: (path: string) => void }) {
  return (
    <Stack gap="xl">
      {groups.map((group) => {
        const items = results.filter((r) => group.kinds.includes(r.kind))
        if (items.length === 0) return null
        return (
          <Stack key={group.title} gap="xs">
            <Heading level={3} size="heading-sm">
              {group.title} <span className="group-count">{items.length}</span>
            </Heading>
            <List
              label={group.title}
              interactive
              items={items.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.detail,
                leading: <img src={r.image} alt="" className="result-thumb" />,
                onClick: () => onOpen(r.path),
              }))}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}
