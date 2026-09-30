import type { Review } from './types'

// Sample reviews and testimonials for the prototype. The people are fictional.

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

export const placeReviews: Record<string, Review[]> = {
  'flour-and-fern': [
    { name: 'Amelia P.', rating: 5, date: 'Sep 2026', text: 'I cried a little ordering a croissant without asking a single question.' },
    { name: 'Hugo L.', rating: 5, date: 'Aug 2026', text: 'The cardamom knot is worth the Saturday queue. Get there early.' },
  ],
  'osteria-lume': [
    { name: 'Julia C.', rating: 5, date: 'Sep 2026', text: 'The server walked me through the whole menu. The cacio e pepe was perfect.' },
    { name: 'Ravi N.', rating: 4, date: 'Jul 2026', text: 'Pricey but careful. They remembered my note from the booking.' },
  ],
  'morning-glory': [
    { name: 'Sofia G.', rating: 5, date: 'Sep 2026', text: 'Everything in the case is safe. Breakfast tacos on the patio are the move.' },
    { name: 'Eli M.', rating: 4, date: 'Aug 2026', text: 'Relaxed and friendly. Busy on weekends but worth the wait.' },
  ],
  'kin-kitchen': [
    { name: 'Tessa R.', rating: 4, date: 'Sep 2026', text: 'Clear menu markings and a knowledgeable team. Skip the fries, as they warn.' },
    { name: 'Owen B.', rating: 4, date: 'Aug 2026', text: 'The grilled little gems are excellent. Great date spot.' },
  ],
  'the-good-market': [
    { name: 'Mia K.', rating: 5, date: 'Sep 2026', text: 'The green shelf tags save me so much label reading.' },
    { name: 'Carlos Z.', rating: 4, date: 'Jul 2026', text: 'Good range of staples and local gluten-free bread.' },
  ],
  saltbox: [
    { name: 'Jade W.', rating: 5, date: 'Sep 2026', text: 'Fried chicken and onion rings, safely, for the first time in years.' },
    { name: 'Felix S.', rating: 5, date: 'Aug 2026', text: 'The hot honey sandwich is unreal. Buns don’t fall apart.' },
  ],
  'crumb-coffee': [
    { name: 'Anya V.', rating: 4, date: 'Sep 2026', text: 'Love that the GF toast has its own toaster. The flat white is excellent.' },
    { name: 'Dan F.', rating: 4, date: 'Aug 2026', text: 'Careful with the tongs every time I’ve been in.' },
  ],
  'verde-cantina': [
    { name: 'Lucia R.', rating: 4, date: 'Sep 2026', text: 'Ask for the dedicated-fryer chips. The al pastor tacos are the best in town.' },
    { name: 'Pete Y.', rating: 4, date: 'Jul 2026', text: 'Staff knew which salsas had beer without checking. Reassuring.' },
  ],
  'forno-nero': [
    { name: 'Gia M.', rating: 5, date: 'Sep 2026', text: 'Real wood-fired pizza with a chewy, blistered crust. No worrying at all.' },
    { name: 'Will T.', rating: 5, date: 'Aug 2026', text: 'The nduja and hot honey pizza is the best thing I’ve eaten this year.' },
  ],
}

export const testimonials = [
  {
    quote: 'Eating out used to mean an interrogation. Now I open sans, check how a kitchen handles gluten, and just go.',
    name: 'Amelia P.',
    role: 'Coeliac since 2019',
  },
  {
    quote: 'The product reviews are honest about texture, not just labels. It’s changed what’s in my cupboard.',
    name: 'Marco V.',
    role: 'Home cook, gluten-free household',
  },
  {
    quote: 'I found three safe bakeries within a week of moving cities. It felt like being handed a map.',
    name: 'Priya S.',
    role: 'Gluten-free for 8 years',
  },
]
