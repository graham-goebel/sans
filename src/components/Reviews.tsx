import { Avatar, Heading, Stack, Text } from '@dovetail-ds/react'
import { Star } from 'lucide-react'
import type { Review } from '../data/types'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden className={n <= rating ? 'star star--on' : 'star'} />
      ))}
    </span>
  )
}

/** Community reviews for an item: the average, then each review as a card. */
export function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <Stack gap="lg">
      <div className="reviews-header">
        <Heading level={2} size="heading-lg">
          Reviews
        </Heading>
        <span className="reviews-summary">
          <Stars rating={Math.round(average)} />
          <Text variant="small" tone="secondary" as="span">
            {average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </Text>
        </span>
      </div>
      <div className="review-grid">
        {reviews.map((review) => (
          <article key={review.name} className="review">
            <Stack gap="sm">
              <Stars rating={review.rating} />
              <Text>{review.text}</Text>
              <div className="review-byline">
                <Avatar name={review.name} size="sm" />
                <Text variant="small" as="span">
                  {review.name} <span className="review-date">· {review.date}</span>
                </Text>
              </div>
            </Stack>
          </article>
        ))}
      </div>
    </Stack>
  )
}
