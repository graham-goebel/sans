import {
  Avatar,
  Cover,
  CtaBlock,
  FeatureGridBlock,
  Heading,
  Image,
  Section,
  SplitBlock,
  Stack,
  TestimonialBlock,
  Text,
} from '@dovetail-ds/react'
import { BadgeCheck, ScanSearch, ShieldCheck, Smartphone, ThumbsUp } from 'lucide-react'
import { PlaceCard, ProductCard, RecipeCard } from '../components/cards'
import { ButtonLink, Masthead } from '../components/layout'
import { Rail } from '../components/Rail'
import { unsplash } from '../data/images'
import { places } from '../data/places'
import { products } from '../data/products'
import { recipes } from '../data/recipes'
import { testimonials } from '../data/reviews'
import { usePreferences } from '../lib/preferences'
import { site } from '../site'

// The promoted slot, picked by id so it's easy to swap.
const partnerProduct = products.find((p) => p.id === 'bronze-cut-rigatoni')!
const denverPhoto = unsplash('1414235077428-338989a2e8c0', 1600)
const dedicatedCount = places.filter((p) => p.safety === 'dedicated').length

export function Home() {
  const { preferences } = usePreferences()
  // People new to gluten-free see the basics right after the hero.
  const newcomer = preferences.experience === 'new'

  // Info: the basics
  const basics = (
    <FeatureGridBlock
      tone="subtle"
      align="start"
      eyebrow="Gluten-free, decoded"
      title="Three habits worth building"
      lead="Gluten turns up in more places than bread. These three habits catch most of it."
      items={[
        {
          icon: <ScanSearch />,
          title: 'Read the whole label',
          description: 'Look past “wheat”: barley, rye, malt and brewer’s yeast all contain gluten.',
        },
        {
          icon: <ShieldCheck />,
          title: 'Ask about cross-contact',
          description: 'Shared fryers, toasters and pasta water can undo a gluten-free dish.',
        },
        {
          icon: <BadgeCheck />,
          title: 'Look for the mark',
          description: 'Certified products are tested well below the 20 ppm legal limit.',
        },
      ]}
    />
  )

  return (
    <>
      <Masthead />

      {/* Hero */}
      <Section media={unsplash('1529543544282-ea669407fca3', 2000)} minHeight="min(78vh, 720px)" width="default">
        <Stack gap="md">
          <Text variant="eyebrow">Autumn edition</Text>
          <Heading level={1} size="display-lg">
            Gluten-free, <em>beautifully</em> done.
          </Heading>
          <Text variant="lead" measure="narrow">
            The recipes, groceries and places worth knowing about when you can’t eat gluten.
          </Text>
        </Stack>
      </Section>

      {newcomer && basics}

      {/* The three sections, each a swipeable row */}
      <Section>
        <Stack gap="2xl">
          <Rail eyebrow="Cook" title="Recipes" to="/recipes" autoplay={5000}>
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </Rail>
          <Rail eyebrow="Shop" title="Products" to="/products" size="narrow" autoplay={6000}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Rail>
          <Rail eyebrow="Go · Denver" title="Places" to="/places" autoplay={7000}>
            {places.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </Rail>
        </Stack>
      </Section>

      {/* Promoted: a partner product */}
      <SplitBlock
        tone="secondary-muted"
        eyebrow="Partner pick"
        title={partnerProduct.name}
        body={partnerProduct.description}
        points={['Certified gluten-free', 'Holds its bite, even reheated', 'Corn and rice, nothing else']}
        actions={
          <ButtonLink to={`/products/${partnerProduct.id}`} variant="primary">
            See the pasta
          </ButtonLink>
        }
        media={<Image src={partnerProduct.image} alt={partnerProduct.name} ratio="4:3" radius="container" />}
      >
        <Text variant="fine">Sponsored. Brands can’t buy a place in our tested lists.</Text>
      </SplitBlock>

      {!newcomer && basics}

      {/* Denver: where sans is starting, and how far along it is */}
      <Section>
        <Stack gap="lg">
          <Stack gap="2xs">
            <Text variant="eyebrow" tone="brand">
              Now in Denver
            </Text>
            <Heading level={2} size="heading-xl">
              Starting in the Mile High City
            </Heading>
          </Stack>
          <Cover
            src={denverPhoto}
            alt=""
            ratio="4:3"
            radius="container"
            eyebrow={`${places.length} places · ${dedicatedCount} reported 100% gluten-free`}
            title="Denver, first look"
            actions={
              <ButtonLink to="/places" variant="secondary">
                See Denver places
              </ButtonLink>
            }
          />
          <Text variant="lead">
            We’ve gathered Denver’s gluten-free restaurants, bakeries and markets from public listings and press, and
            we’re confirming each one directly. Until a place is confirmed, it’s marked unverified.
          </Text>
        </Stack>
      </Section>

      {/* Social proof: the community in its own words */}
      <TestimonialBlock
        tone="brand-muted"
        eyebrow="From the community"
        title="People who get it"
        lead={site.sampleContent ? 'Sample quotes, written to show how this will look.' : undefined}
        quotes={testimonials.map((t) => ({
          quote: (
            <>
              {t.quote}
              {t.recommends && (
                <span className="recommends">
                  <ThumbsUp aria-hidden /> Recommends sans
                </span>
              )}
            </>
          ),
          name: t.name,
          role: t.role,
          avatar: <Avatar name={t.name} src={t.photo} size="md" />,
        }))}
      />

      {/* Marketing: the community app, announced but not yet out */}
      <CtaBlock
        tone="brand"
        eyebrow="The sans community"
        title="Find your gluten-free people."
        lead="A sans app for reviewing places, sharing finds and swapping recipes with people who eat the way you do."
        actions={
          <span className="coming-soon">
            <Smartphone aria-hidden />
            Coming soon to iPhone and Android
          </span>
        }
      />
    </>
  )
}
