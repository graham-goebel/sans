import { unsplash } from './images'
import type { Review } from './types'

// Sample reviews and testimonials for the prototype. The people are fictional,
// and the testimonial photos are stock portraits.

export const recipeReviews: Record<string, Review[]> = {
  'buckwheat-pancakes': [
    { name: 'Maya R.', rating: 5, date: 'Sep 2026', text: 'Fluffier than any wheat pancake I made before my diagnosis. The brown butter is the trick.' },
    { name: 'Tom W.', rating: 4, date: 'Aug 2026', text: 'Lovely nutty flavour. I let the batter rest 15 minutes and they rose even higher.' },
  ],
  'margherita-pizza': [
    { name: 'Chiara B.', rating: 5, date: 'Sep 2026', text: 'Finally a gluten-free crust that actually stretches. Friday pizza night is back.' },
    { name: 'Dev P.', rating: 4, date: 'Jul 2026', text: 'Psyllium gel works wonders. Needed a couple of extra minutes in my oven.' },
  ],
  'green-goddess-bowl': [
    { name: 'Hana K.', rating: 5, date: 'Sep 2026', text: 'My weekday lunch on repeat. The dressing keeps for days in the fridge.' },
    { name: 'Luis M.', rating: 4, date: 'Aug 2026', text: 'Quick and bright. I added crispy chickpeas for crunch.' },
  ],
  'olive-oil-cake': [
    { name: 'Nora S.', rating: 5, date: 'Sep 2026', text: 'Nobody at the party guessed it was gluten-free. Even better on day two.' },
    { name: 'Ben A.', rating: 5, date: 'Jun 2026', text: 'One bowl, no fuss, and a beautiful crumb from the polenta.' },
  ],
  'sourdough-loaf': [
    { name: 'Iris F.', rating: 5, date: 'Sep 2026', text: 'Took three tries to get my starter going, but this crust crackles like the real thing.' },
    { name: 'Sam O.', rating: 4, date: 'Aug 2026', text: 'Worth the weekend. Waiting for it to cool completely is the hardest part.' },
  ],
  'salmon-miso': [
    { name: 'Grace L.', rating: 5, date: 'Sep 2026', text: 'Thanks for flagging the barley miso. I had no idea, and this is delicious.' },
    { name: 'Omar H.', rating: 4, date: 'Jul 2026', text: 'Twenty minutes start to finish. The glaze caramelises perfectly under the grill.' },
  ],
  'chocolate-cookies': [
    { name: 'Ella J.', rating: 5, date: 'Sep 2026', text: 'Chewy middles, crisp edges. Chilling the dough really does make the difference.' },
    { name: 'Rafa D.', rating: 5, date: 'Aug 2026', text: 'Our new family favourite, gluten-free or not.' },
  ],
  'berry-yogurt-bowl': [
    { name: 'Zoe C.', rating: 4, date: 'Sep 2026', text: 'So simple. Good reminder to buy certified oats; I got caught out before.' },
    { name: 'Kai T.', rating: 5, date: 'Aug 2026', text: 'Toasting the oats with maple syrup makes it feel like a treat.' },
  ],
}

export const productReviews: Record<string, Review[]> = {
  'seeded-sandwich-loaf': [
    { name: 'Priya S.', rating: 5, date: 'Sep 2026', text: 'It survives a packed lunch without crumbling. That’s all I ever wanted.' },
    { name: 'Josh N.', rating: 4, date: 'Aug 2026', text: 'Toasts beautifully. Softer if you keep it in the bread bin, not the fridge.' },
  ],
  'bronze-cut-rigatoni': [
    { name: 'Marco V.', rating: 5, date: 'Sep 2026', text: 'Holds its shape even as leftovers. The best gluten-free pasta I’ve tried.' },
    { name: 'Alice G.', rating: 5, date: 'Aug 2026', text: 'Sauce clings to it properly. My Italian nonna approved.' },
  ],
  'sea-salt-crackers': [
    { name: 'Wren B.', rating: 4, date: 'Sep 2026', text: 'Thin and sturdy enough for a thick hummus. A little salty for some.' },
    { name: 'Leo K.', rating: 5, date: 'Jul 2026', text: 'Always on my cheese board now.' },
  ],
  'all-purpose-flour': [
    { name: 'Fiona M.', rating: 5, date: 'Sep 2026', text: 'Swapped it into my mum’s old recipes and they just worked.' },
    { name: 'Ade O.', rating: 4, date: 'Aug 2026', text: 'Great for cakes. For bread I still use a dedicated mix.' },
  ],
  'dark-chocolate-brownie-mix': [
    { name: 'Ruby T.', rating: 5, date: 'Sep 2026', text: 'Crackly top every time. I take two minutes off the bake.' },
    { name: 'Noah P.', rating: 5, date: 'Aug 2026', text: 'Better than most bakery brownies, gluten-free or not.' },
  ],
  'maple-granola': [
    { name: 'Isla W.', rating: 4, date: 'Sep 2026', text: 'Big clusters and not too sweet. Wish the bag were bigger.' },
    { name: 'Theo R.', rating: 5, date: 'Jul 2026', text: 'Finally a granola I can trust. Certified oats matter.' },
  ],
  'butter-croissants': [
    { name: 'Clara D.', rating: 4, date: 'Sep 2026', text: 'Flaky layers straight from the freezer. A proper Sunday treat.' },
    { name: 'Max E.', rating: 4, date: 'Aug 2026', text: 'Really good, though I’d love to see them certified.' },
  ],
  'oat-milk-cookies': [
    { name: 'Lily H.', rating: 4, date: 'Sep 2026', text: 'Soft and rich. Great for anyone avoiding dairy too.' },
    { name: 'Finn A.', rating: 4, date: 'Aug 2026', text: 'My kids ask for these by name now.' },
  ],
  'pizza-base-mix': [
    { name: 'Gio F.', rating: 5, date: 'Sep 2026', text: 'Stretches by hand without tearing. Crisp edges in a hot oven.' },
    { name: 'Sara Q.', rating: 4, date: 'Aug 2026', text: 'Easy weeknight pizza. Give it the full hour to prove.' },
  ],
}

export const testimonials = [
  {
    quote: 'Eating out used to mean an interrogation. Now I open sans, check how a kitchen handles gluten, and just go.',
    name: 'Amelia P.',
    role: 'Coeliac since 2019',
    photo: unsplash('1494790108377-be9c29b29330', 160),
    recommends: true,
  },
  {
    quote: 'The product reviews are honest about texture, not just labels. It’s changed what’s in my cupboard.',
    name: 'Marco V.',
    role: 'Home cook, gluten-free household',
    photo: unsplash('1507003211169-0a1dd7228f2d', 160),
    recommends: true,
  },
  {
    quote: 'I found three safe bakeries within a week of moving cities. It felt like being handed a map.',
    name: 'Priya S.',
    role: 'Gluten-free for 8 years',
    photo: unsplash('1438761681033-6461ffad8d80', 160),
    recommends: true,
  },
]
