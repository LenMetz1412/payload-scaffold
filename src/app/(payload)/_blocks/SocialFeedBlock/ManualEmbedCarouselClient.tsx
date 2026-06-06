'use client'

import { useEffect, useRef, useState } from 'react'

import { CarouselNavigation } from '@/app/(app)/_components/carousel/navigation'
import type { SocialFeedBlock as SocialFeedBlockProps } from '@/payload-types'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/sha/carousel'

const detectPlatform = (html: string) => {
  if (html.includes('instagram.com')) return 'instagram'
  if (html.includes('tiktok.com')) return 'tiktok'
  return null
}

const SCRIPTS: Record<string, string> = {
  instagram: 'https://www.instagram.com/embed.js',
  tiktok: 'https://www.tiktok.com/embed.js',
}

const loadScript = (src: string) => {
  if (document.querySelector(`script[src="${src}"]`)) return
  const s = document.createElement('script')
  s.src = src
  s.async = true
  document.body.appendChild(s)
}

const EmbedItem = ({ embedCode, caption }: { embedCode: string; caption?: string | null }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const platform = detectPlatform(embedCode)
    if (!platform) return
    if (SCRIPTS[platform]) loadScript(SCRIPTS[platform])
    const timer = window.setTimeout(() => {
      // @ts-expect-error — instagram global
      if (platform === 'instagram') window.instgrm?.Embeds?.process()
    }, 300)
    return () => window.clearTimeout(timer)
  }, [embedCode])

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={ref}
        className="flex w-full justify-center [&_.instagram-media]:!min-w-0 [&_.instagram-media]:!w-full [&_.instagram-media]:!max-w-full"
        dangerouslySetInnerHTML={{ __html: embedCode }}
        suppressHydrationWarning
      />
      {caption && <p className="text-sm text-gray-400">{caption}</p>}
    </div>
  )
}

export const ManualEmbedCarouselClient = ({
  items,
}: {
  items: NonNullable<SocialFeedBlockProps['items']>
}) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  return (
    <div className="w-full">
      <CarouselNavigation carouselApi={carouselApi} manyItems={items.length} />
      <Carousel setApi={setCarouselApi} opts={{ align: 'start' }} className="relative w-full">
        <CarouselContent>
          {items.map((item, i) => (
            <CarouselItem key={item.id ?? i} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <EmbedItem embedCode={item.embedCode} caption={item.caption} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
