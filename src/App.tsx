import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router'
import { BottomNav, IconButton } from '@dovetail-ds/react'
import { House, MapPin, Search, ShoppingBasket, UtensilsCrossed } from 'lucide-react'
import { SearchSheet } from './components/SearchSheet'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { PlaceDetail, PlacesPage } from './pages/Places'
import { ProductDetail, ProductsPage } from './pages/Products'
import { RecipeDetail, RecipesPage } from './pages/Recipes'

const destinations = [
  { id: 'home', label: 'Home', icon: <House />, path: '/' },
  { id: 'products', label: 'Products', icon: <ShoppingBasket />, path: '/products' },
  { id: 'recipes', label: 'Recipes', icon: <UtensilsCrossed />, path: '/recipes' },
  { id: 'places', label: 'Places', icon: <MapPin />, path: '/places' },
]

function Shell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searching, setSearching] = useState(false)

  // Each new page starts at the top, like turning a page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const section = location.pathname.split('/')[1]
  const current = destinations.find((d) => d.id === section)?.id ?? 'home'

  return (
    <>
      <main className="app-main">
        {/* Keyed on the path so each page mounts fresh and plays its entrance. */}
        <div className="page" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/places/:id" element={<PlaceDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <div className="nav-dock">
        <BottomNav
          variant="floating"
          items={destinations.map(({ id, label, icon, path }) => ({ id, label, icon, href: `#${path}` }))}
          current={current}
          onNavigate={(id) => navigate(destinations.find((d) => d.id === id)!.path)}
          action={
            <IconButton label="Search" variant="solid" size="lg" onClick={() => setSearching(true)}>
              <Search />
            </IconButton>
          }
        />
      </div>
      <SearchSheet open={searching} onClose={() => setSearching(false)} />
    </>
  )
}

function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}

export default App
