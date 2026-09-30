import type { ReactNode } from 'react'
import { Callout, Heading, Prose, Section, Stack, Text } from '@dovetail-ds/react'
import { Masthead } from '../components/layout'
import { site } from '../site'

const UPDATED = 'September 2026'

function InfoPage({ eyebrow, title, draft = false, children }: { eyebrow: string; title: string; draft?: boolean; children: ReactNode }) {
  return (
    <>
      <Masthead />
      <Section spacing="compact" width="narrow">
        <Stack gap="xl">
          <Stack gap="sm">
            <Text variant="eyebrow" tone="brand">
              {eyebrow}
            </Text>
            <Heading level={1} size="display-md">
              {title}
            </Heading>
            <Text variant="small" tone="secondary">
              Last updated {UPDATED}
            </Text>
          </Stack>
          {draft && (
            <Callout tone="caution" title="Draft">
              This is a starting template, not legal advice. Have it reviewed before sans launches publicly.
            </Callout>
          )}
          <div className="info-prose">
            <Prose>{children}</Prose>
          </div>
        </Stack>
      </Section>
    </>
  )
}

export function AboutPage() {
  return (
    <InfoPage eyebrow="About" title="About sans">
      <p>
        sans is a companion for people who eat gluten-free, whether for coeliac disease, a sensitivity or by choice.
        It gathers recipes, groceries and places to eat, with a clear note on how each one handles gluten.
      </p>
      {site.sampleContent && (
        <>
          <h2>This is a prototype</h2>
          <p>
            The <strong>Denver places</strong> are real, but <strong>unverified</strong>: their details come from public
            listings, reviews and press, and haven’t yet been confirmed with each place. Each one lists its sources.
            Always check with the place before you eat there.
          </p>
          <p>
            The products, brands, recipes, reviews and testimonials are <strong>sample content</strong> written to show
            how the app will work. They are not real recommendations.
          </p>
        </>
      )}
      <h2>Not medical advice</h2>
      <p>
        sans shares general information to help you plan. It is not medical advice and doesn’t replace guidance from
        your doctor or dietitian.
      </p>
      <p>
        Kitchens, suppliers and recipes change without notice. Even a place marked 100% gluten-free can make mistakes.
        Always read the label, and tell staff you need gluten-free food every time you order. If you have coeliac
        disease or a serious reaction to gluten, you are the best judge of what’s safe for you.
      </p>
      <h2>How we describe places</h2>
      <ul>
        <li>
          <strong>100% gluten-free:</strong> the whole kitchen is gluten-free.
        </li>
        <li>
          <strong>Separate GF menu:</strong> a dedicated menu with extra precautions in a shared kitchen.
        </li>
        <li>
          <strong>GF options:</strong> some dishes are gluten-free as made; cross-contact is possible.
        </li>
      </ul>
      <p>
        A place marked <strong>unverified</strong> hasn’t been confirmed with the place yet. Once it has, it shows when
        its details were last checked.
      </p>
    </InfoPage>
  )
}

export function PrivacyPage() {
  return (
    <InfoPage eyebrow="Privacy" title="Privacy" draft>
      <p>
        sans doesn’t ask you for an account, and it doesn’t collect, store or sell personal information. There are no
        analytics, advertising trackers or cookies.
      </p>
      <h2>What other services see</h2>
      <p>
        Photos are loaded from Unsplash, and the site is hosted on GitHub Pages. Like any website, those services
        receive your IP address and browser details when your device requests a page or image, under their own privacy
        policies.
      </p>
      <h2>Changes</h2>
      <p>
        If sans adds accounts, reviews or analytics, this page will be updated first to explain what is collected and
        why.
      </p>
    </InfoPage>
  )
}

export function TermsPage() {
  return (
    <InfoPage eyebrow="Terms" title="Terms of use" draft>
      <p>By using sans you agree to these terms.</p>
      <h2>Information only</h2>
      <p>
        Content in sans is provided for general information, as is, without warranty. We work to keep it accurate,
        but places, products and recipes change, and we can’t guarantee that any food is free of gluten.
      </p>
      <h2>Your responsibility</h2>
      <p>
        You are responsible for checking labels, asking staff and deciding what is safe for you to eat. sans is not
        liable for any reaction, illness or loss arising from use of the information it contains.
      </p>
      <h2>Content and trademarks</h2>
      <p>
        Brand names and places belong to their owners. Photographs are credited on the photo credits page and used
        under their licences.
      </p>
    </InfoPage>
  )
}

export function CreditsPage() {
  return (
    <InfoPage eyebrow="Credits" title="Photo credits">
      <p>
        Photographs in sans come from <a href="https://unsplash.com">Unsplash</a> and are used under the{' '}
        <a href="https://unsplash.com/license">Unsplash License</a>. Thank you to the photographers who share their
        work there.
      </p>
      <p>
        Photos on Denver places are illustrative: they don’t show the business itself unless the place has given us
        its own.
      </p>
      <p>
        Headlines are set in Instrument Serif, licensed under the SIL Open Font License. Icons are from Lucide, under
        the ISC License.
      </p>
    </InfoPage>
  )
}
