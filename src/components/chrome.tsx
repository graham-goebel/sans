import { Link, Text } from '@dovetail-ds/react'
import { FlaskConical } from 'lucide-react'
import { site } from '../site'

/** A slim notice across the top of every page while the content is sample data. */
export function PrototypeBanner() {
  if (!site.sampleContent) return null
  return (
    <div className="prototype-banner" role="note">
      <FlaskConical aria-hidden />
      <Text variant="small" as="span">
        Prototype: Denver places are unverified leads, and products, recipes and reviews are sample content.{' '}
        <Link href="#/about" tone="inherit">
          Learn more
        </Link>
      </Text>
    </div>
  )
}

const footerLinks = [
  { href: '#/about', label: 'About & disclaimer' },
  { href: '#/privacy', label: 'Privacy' },
  { href: '#/terms', label: 'Terms' },
  { href: '#/credits', label: 'Photo credits' },
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="wordmark" style={{ fontSize: '1.5rem' }}>
        sans<em>.</em>
      </span>
      <Text variant="fine">
        sans shares information, not medical advice. Always check labels and tell staff you need gluten-free food
        when you order.
      </Text>
      <nav aria-label="Site">
        <ul className="footer-links">
          {footerLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} underline="hover" tone="inherit">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  )
}
