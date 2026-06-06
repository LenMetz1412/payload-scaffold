import { getGridColumnsClass } from '@/app/(app)/_components/carousel/helpers'
import RichText from '@/components/RichText'
import type { Locale } from '@/config/locales'
import type { SocialFeedBlock as SocialFeedBlockProps } from '@/payload-types'
import { cn } from '@/utils/cn'

import { type InstagramPost, PostCard } from './InstagramFeed'
import { ManualEmbedCarouselClient } from './ManualEmbedCarouselClient'
import { SocialFeedCarouselClient } from './SocialFeedCarouselClient'

async function fetchInstagramPosts(count: number): Promise<InstagramPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/instagram/feed?count=${count}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

const InstagramGrid = ({ posts }: { posts: InstagramPost[] }) => {
  const gridClass = getGridColumnsClass(posts.length)
  return (
    <div className={cn('grid grid-cols-2 gap-2', gridClass)}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

const ManualGrid = ({ items }: { items: NonNullable<SocialFeedBlockProps['items']> }) => {
  const gridClass = getGridColumnsClass(items.length)
  return (
    <div className={cn('grid grid-cols-1 gap-4', gridClass)}>
      {items.map((item, i) => (
        <div key={item.id ?? i} className="flex flex-col gap-2">
          <div
            className="flex w-full justify-center [&_.instagram-media]:!min-w-0 [&_.instagram-media]:!w-full [&_.instagram-media]:!max-w-full"
            dangerouslySetInnerHTML={{ __html: item.embedCode }}
            suppressHydrationWarning
          />
          {item.caption && <p className="text-sm text-gray-400">{item.caption}</p>}
        </div>
      ))}
    </div>
  )
}

export const SocialFeedBlock = async ({
  title,
  displayMode,
  source,
  postCount,
  items,
  locale,
}: SocialFeedBlockProps & { locale?: Locale }) => {
  const isCarousel = displayMode !== 'grid'
  const manualItems = items ?? []

  let instagramPosts: InstagramPost[] = []
  if (source === 'instagram') {
    instagramPosts = await fetchInstagramPosts(postCount ?? 6)
  }

  return (
    <div className="container my-6 first:mt-14 lg:my-16">
      {title && (
        <div className="mb-6 md:mb-10">
          <RichText data={title} enableGutter={false} locale={locale} />
        </div>
      )}

      {source === 'instagram' ? (
        instagramPosts.length > 0 ? (
          isCarousel ? (
            <SocialFeedCarouselClient posts={instagramPosts} />
          ) : (
            <InstagramGrid posts={instagramPosts} />
          )
        ) : null
      ) : manualItems.length > 0 ? (
        isCarousel ? (
          <ManualEmbedCarouselClient items={manualItems} />
        ) : (
          <ManualGrid items={manualItems} />
        )
      ) : null}
    </div>
  )
}
