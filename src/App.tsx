import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router'
import { BottomNav, IconButton } from '@dovetail-ds/react'
import { House, MapPin, Search, ShoppingBasket, Recipe } from './icons'
import { SiteFooter } from './components/chrome'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PreferencesProvider } from './components/Preferences'
import { QuickViewProvider } from './components/QuickView'
import { SearchSheet } from './components/SearchSheet'
import { Home } from './pages/Home'
import { AboutPage, CreditsPage, PrivacyPage, TermsPage } from './pages/Info'
import { NotFound } from './pages/NotFound'
import { PlaceDetail, PlacesPage } from './pages/Places'
import { ProductDetail, ProductsPage } from './pages/Products'
import { RecipeDetail, RecipesPage } from './pages/Recipes'

const destinations = [
  { id: 'home', label: 'Home', icon: <House />, path: '/' },
  { id: 'products', label: 'Products', icon: <ShoppingBasket />, path: '/products' },
  { id: 'recipes', label: 'Recipes', icon: <Recipe />, path: '/recipes' },
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

  const [, section, item] = location.pathname.split('/')
  // Highlight Home only on the home page itself; pages like About highlight nothing.
  const current = section ? destinations.find((d) => d.id === section)?.id : 'home'
  // Item pages (level 2) give the screen to the content; their photo carries a back button instead.
  const showNav = !item
  // The Places map fills the screen: no footer under it, no padding to clear the nav.
  const immersive = location.pathname === '/places' && new URLSearchParams(location.search).get('view') !== 'list'

  return (
    <>
      <main className={immersive ? 'app-main app-main--immersive' : showNav ? 'app-main' : 'app-main app-main--bare'}>
        {/* Keyed on the path so each page mounts fresh and plays its entrance, and a crash resets on navigation. */}
        <div className="page" key={location.pathname}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/places" element={<PlacesPage />} />
              <Route path="/places/:id" element={<PlaceDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/credits" element={<CreditsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
          {!immersive && <SiteFooter />}
        </div>
      </main>
      {showNav && (
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
      )}
      <SearchSheet open={searching} onClose={() => setSearching(false)} />
    </>
  )
}

function App() {
  return (
    <HashRouter>
      <PreferencesProvider>
        <QuickViewProvider>
          <Shell />
        </QuickViewProvider>
      </PreferencesProvider>
    </HashRouter>
  )
}

export default App
