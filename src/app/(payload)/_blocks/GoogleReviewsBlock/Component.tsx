'use client'

import { useEffect, useState } from 'react'

import { getGridColumnsClass } from '@/app/(app)/_components/carousel/helpers'
import { cn } from '@/utils/cn'

// ── Types ────────────────────────────────────────────────────────────────────

export interface GoogleReview {
  authorName: string
  authorPhotoUrl?: string
  rating: number
  text: string
  relativeTime: string
}

// ── Star rating ──────────────────────────────────────────────────────────────

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        fill={i < rating ? '#F4B400' : 'none'}
        stroke={i < rating ? '#F4B400' : '#d1d5db'}
        strokeWidth={1.5}
        className="h-3.5 w-3.5"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

// ── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-rose-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-cyan-500',
]

const Avatar = ({ name, photoUrl, index }: { name: string; photoUrl?: string; index: number }) => {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    )
  }
  return (
    <div
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-sans text-sm font-bold text-white',
        color,
      )}
    >
      {name?.charAt(0)?.toUpperCase() ?? '?'}
    </div>
  )
}

// ── Google G logo ─────────────────────────────────────────────────────────────

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 border border-gray-300 rounded-full p-1" aria-label="Google">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

// ── Review card ───────────────────────────────────────────────────────────────

const ReviewCard = ({ review, index }: { review: GoogleReview; index: number }) => (
  <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-md">
    <div className="flex items-center gap-3">
      <Avatar name={review.authorName} photoUrl={review.authorPhotoUrl} index={index} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-semibold text-gray-900">
          {review.authorName}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <StarRating rating={review.rating} />
          {review.relativeTime && (
            <span className="font-sans text-xs text-gray-400">{review.relativeTime}</span>
          )}
        </div>
      </div>
      <GoogleLogo />
    </div>
    <p className="font-sans text-sm leading-relaxed text-gray-500 line-clamp-3">{review.text}</p>
  </div>
)

// ── Vertical autoplay carousel ────────────────────────────────────────────────

// Approximate slot height (card height + gap). Cards use line-clamp-3 so height
// is consistent. Tune this if card sizing changes.
const SLOT = 130

const ReviewsCarousel = ({ reviews }: { reviews: GoogleReview[] }) => {
  const count = reviews.length
  const [tick, setTick] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setTick((t) => t + 1), 3500)
    return () => clearInterval(id)
  }, [paused])

  // Render 7 slots (offsets -3…+3). Outermost slots (±3) are invisible so items
  // fade in / out smoothly rather than popping.
  const slots = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 3 // -3 to +3
    const absPos = tick + offset // unique, increasing key per slot
    const reviewIdx = ((absPos % count) + count) % count
    return { absPos, reviewIdx, offset }
  })

  return (
    <div
      className="relative mx-auto h-[480px] w-full max-w-xl overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slots.map(({ absPos, reviewIdx, offset }) => {
        const abs = Math.abs(offset)
        // Opacity: full at center, dim at ±1, barely visible at ±2, gone at ±3
        const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : abs === 2 ? 0.22 : 0
        // Scale: biggest at center
        const scale = abs === 0 ? 1 : abs === 1 ? 0.88 : 0.76
        return (
          <div
            key={absPos}
            className="absolute left-0 right-0 transition-all duration-500 ease-in-out"
            style={{
              top: `calc(50% + ${offset * SLOT}px)`,
              transform: `translateY(-50%) scale(${scale})`,
              opacity,
              zIndex: 10 - abs,
            }}
          >
            <ReviewCard review={reviews[reviewIdx]} index={reviewIdx} />
          </div>
        )
      })}
    </div>
  )
}

// ── Grid ──────────────────────────────────────────────────────────────────────

const ReviewsGrid = ({ reviews }: { reviews: GoogleReview[] }) => {
  const gridClass = getGridColumnsClass(reviews.length)
  return (
    <div className={cn('grid grid-cols-1 gap-4', gridClass)}>
      {reviews.map((review, i) => (
        <ReviewCard key={i} review={review} index={i} />
      ))}
    </div>
  )
}

// ── Rating sidebar ────────────────────────────────────────────────────────────

const RatingSidebar = ({
  reviews,
}: {
  reviews: GoogleReview[]
}) => {
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const rounded = Math.round(avg * 10) / 10

  return (
    <div className="flex w-full shrink-0 flex-row gap-6 items-start justify-between border-b border-gray-400 pb-8">
      <div className="flex items-center gap-2">
        <GoogleLogo />
        <span className="text-xs font-sans font-bold uppercase tracking-tight text-black">
          Verified Reviews
        </span>
      </div>

      {/* Score */}
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col items-end gap-2">
          <span className="text-2xl font-bold leading-none text-gray-900">
            {rounded.toFixed(1)}
          </span>
          <StarRating rating={Math.round(avg)} />
        </div>
        <div className="flex flex-col items-start border-l border-gray-400 pl-4">
          <span className="text-sm font-bold text-black">{reviews.length}+</span>
          <span className="text-sm text-gray-400">Happy Customers</span>
        </div>
      </div>
    </div>
  )
}

// ── Block entry ───────────────────────────────────────────────────────────────

export const GoogleReviewsBlock = ({
  titleNode,
  reviews,
  displayMode,
}: {
  titleNode?: React.ReactNode
  reviews: GoogleReview[]
  displayMode?: string | null
}) => {
  if (!reviews.length) return null
  const isCarousel = displayMode !== 'grid'

  return (
    <div className="container my-6 mt-16 first:mt-14 lg:my-16 lg:mt-24">
      {isCarousel ? (
        <div className="flex flex-col items-start gap-8 w-full">
          <RatingSidebar reviews={reviews} />
          <div className="w-full">
            <ReviewsCarousel reviews={reviews} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <RatingSidebar reviews={reviews} />
          <ReviewsGrid reviews={reviews} />
        </div>
      )}
    </div>
  )
}
