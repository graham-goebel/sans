import {
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
import { BadgeCheck, ScanSearch, ShieldCheck, Smartphone } from 'lucide-react'
import { PlaceCard, ProductCard, RecipeCard } from '../components/cards'
import { ButtonLink, Masthead } from '../components/layout'
import { Rail } from '../components/Rail'
import { unsplash } from '../data/images'
import { places } from '../data/places'
import { products } from '../data/products'
import { recipes } from '../data/recipes'
import { testimonials } from '../data/reviews'
import { site } from '../site'

// The promoted slots, picked by id so they are easy to swap.
const partnerProduct = products.find((p) => p.id === 'bronze-cut-rigatoni')!
const placeOfTheMonth = places.find((p) => p.id === 'flour-and-fern')!

export function Home() {
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
          <Rail eyebrow="Go" title="Places" to="/places" size="wide" autoplay={7000}>
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

      {/* Info: the basics */}
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

      {/* Promoted: place of the month */}
      <Section>
        <Stack gap="lg">
          <Stack gap="2xs">
            <Text variant="eyebrow" tone="brand">
              Place of the month
            </Text>
            <Heading level={2} size="heading-xl">
              Worth the trip
            </Heading>
          </Stack>
          <Cover
            src={placeOfTheMonth.image}
            alt=""
            ratio="4:3"
            radius="container"
            eyebrow={`100% gluten-free · ${placeOfTheMonth.neighborhood}, ${placeOfTheMonth.city}`}
            title={placeOfTheMonth.name}
            actions={
              <ButtonLink to={`/places/${placeOfTheMonth.id}`} variant="secondary">
                Read more
              </ButtonLink>
            }
          />
          <Text variant="lead">{placeOfTheMonth.dek}</Text>
        </Stack>
      </Section>

      {/* Social proof: the community in its own words */}
      <TestimonialBlock
        tone="brand-muted"
        eyebrow="From the community"
        title="People who get it"
        lead={site.sampleContent ? 'Sample quotes, written to show how this will look.' : undefined}
        quotes={testimonials}
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
