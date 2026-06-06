'use client'

import { useState } from 'react'

import { CarouselNavigation } from '@/app/(app)/_components/carousel/navigation'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/sha/carousel'

import { PostCard, type InstagramPost } from './InstagramFeed'

export const SocialFeedCarouselClient = ({ posts }: { posts: InstagramPost[] }) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  return (
    <div className="w-full">
      <CarouselNavigation carouselApi={carouselApi} manyItems={posts.length} />
      <Carousel setApi={setCarouselApi} opts={{ align: 'start' }} className="relative w-full">
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem key={post.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <PostCard post={post} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
