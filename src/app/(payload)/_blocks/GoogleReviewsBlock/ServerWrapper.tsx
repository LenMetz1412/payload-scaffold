import type { GoogleReviewsBlock as GoogleReviewsBlockProps } from '@/payload-types';

import { type GoogleReview, GoogleReviewsBlock } from './Component';

// ── Google Places API fetch ───────────────────────────────────────────────────

interface PlacesReview {
  authorAttribution: { displayName: string; photoUri?: string }
  rating: number
  text?: { text: string }
  relativePublishTimeDescription: string
}

async function fetchGoogleReviews(placeId: string, minRating: number): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.warn('[GoogleReviewsBlock] GOOGLE_PLACES_API_KEY is not set.')
    return []
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating&key=${apiKey}&languageCode=de`,
      {
        next: { revalidate: 3600 },
        headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'reviews,rating' },
      },
    )
    if (!res.ok) {
      console.error('[GoogleReviewsBlock] Places API error:', await res.text())
      return []
    }
    const json = await res.json()
    return ((json.reviews ?? []) as PlacesReview[])
      .filter((r) => r.rating >= minRating && r.text?.text)
      .map((r) => ({
        authorName: r.authorAttribution.displayName,
        authorPhotoUrl: r.authorAttribution.photoUri,
        rating: r.rating,
        text: r.text!.text,
        relativeTime: r.relativePublishTimeDescription,
      }))
  } catch (err) {
    console.error('[GoogleReviewsBlock] Failed to fetch reviews:', err)
    return []
  }
}

// ── Manual reviews mapper ─────────────────────────────────────────────────────

function mapManualReviews(
  items: NonNullable<GoogleReviewsBlockProps['reviews']>,
): GoogleReview[] {
  return items.map((item) => ({
    authorName: item.authorName,
    rating: Number(item.rating ?? 5),
    text: item.reviewText,
    relativeTime: item.date ?? '',
  }))
}

// ── Server wrapper ────────────────────────────────────────────────────────────

export const GoogleReviewsBlockServer = async (props: GoogleReviewsBlockProps) => {
  const { source, placeId, minRating = '1', reviews: manualItems, displayMode } = props

  let reviews: GoogleReview[] = []

  if (source === 'google') {
    if (!placeId) return null
    reviews = await fetchGoogleReviews(placeId, Number(minRating))
  } else {
    reviews = mapManualReviews(manualItems ?? [])
  }

  return <GoogleReviewsBlock displayMode={displayMode} reviews={reviews} />
}
