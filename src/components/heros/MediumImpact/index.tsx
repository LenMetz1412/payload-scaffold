'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { useHeroTheme } from '@/contexts/HeroThemeContext'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/sha/carousel'
import { cn } from '@/utils/cn'
import type { HeroSlide, PageHeroProps } from '../RenderHero'
import { getHeroHeading } from '../shared-hero'
import { isVideoSlide, useCarouselAutoplay, useCarouselSelection } from '../useHeroCarouselAutoPlay'

export const MediumImpactHero: React.FC<PageHeroProps> = ({
  slide,
  locale,
}) => {
  const slides = slide ?? []
  const hasMultipleSlides = slides.length > 1
  const { setHeroTheme } = useHeroTheme()
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const selectedIndex = useCarouselSelection(carouselApi)
  const containerRef = useRef<HTMLDivElement>(null)

  const { registerVideo, scrollNext, scrollPrev, scrollTo } = useCarouselAutoplay({
    slides,
    carouselApi,
    selectedIndex,
    enabled: hasMultipleSlides,
    containerRef,
  })
  const { heading1, heading2 } = getHeroHeading({})

  useEffect(() => {
    setHeroTheme('light')
  }, [setHeroTheme])

  if (!slides.length) {
    return null
  }

  const singleSlide = slides[0]

  const renderMediumImpactContent = (slide: HeroSlide, index: number) => {
    const isVideo = isVideoSlide(slide)
    const shouldLoopVideo = !hasMultipleSlides && isVideo
    const shouldAutoPlay = !hasMultipleSlides && isVideo
    const shouldPrioritize = index === 0

    return (
      <div>
        <div className="container relative min-h-[60vh] overflow-hidden lg:min-h-[60vh]">
          {slide.media && typeof slide.media === 'object' && (
            <div>
              <Media
                className="-mx-4 md:-mx-8 2xl:-mx-16"
                imgClassName="size-full object-cover object-center"
                priority={shouldPrioritize}
                fill
                isHero
                videoProps={{
                  ref: registerVideo(index),
                  loop: shouldLoopVideo,
                  autoPlay: shouldAutoPlay,
                }}
                resource={slide.media}
              />
              {slide.media.caption && (
                <div className="mt-3">
                  <RichText data={slide.media.caption} enableGutter={false} locale={locale} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="container my-4 w-full lg:my-8">
          {(heading1 || heading2) && (
            <h1 className="w-full whitespace-pre-wrap text-center">
              {heading2 && (
                <p className="label mb-2 w-fit text-pretty text-2xl md:text-3xl lg:text-4xl xl:text-4xl">
                  {heading2}
                </p>
              )}
              {heading1 && (
                <p className="w-fit leading-none md:text-5xl lg:text-6xl xl:text-7xl">{heading1}</p>
              )}
            </h1>
          )}

          {!heading1 && !heading2 && slide.richText && (
            <RichText
              className="mb-2 mt-8 w-full md:mt-40"
              data={slide.richText}
              enableGutter={false}
              enableProse={true}
              locale={locale}
            />
          )}

          {Array.isArray(slide.links) && slide.links.length > 0 && (
            <ul className="flex gap-4">
              {slide.links.map(({ id, link }) => (
                <li key={id}>
                  <CMSLink {...link} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  const getSlideKey = (item: HeroSlide, index: number) => item.id ?? `slide-${index}`

  return (
    <div ref={containerRef} className="relative mt-[90px] md:mt-36 lg:mt-48 xl:mt-60">
      {carouselApi && (
        <>
          <button
            className="absolute left-40 top-0 z-20 h-full w-1/5 cursor-pointer"
            aria-label="Vorherigen Slide anzeigen"
            onClick={scrollPrev}
          />
          <button
            className="absolute right-40 top-0 z-20 h-full w-1/5 cursor-pointer"
            aria-label="Nächsten Slide anzeigen"
            onClick={scrollNext}
          />
        </>
      )}

      {hasMultipleSlides ? (
        <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
          <CarouselContent>
            {slides.map((item, index) => (
              <CarouselItem key={getSlideKey(item, index)}>
                {renderMediumImpactContent(item, index)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div key={getSlideKey(singleSlide, 0)}>{renderMediumImpactContent(singleSlide, 0)}</div>
      )}

      {hasMultipleSlides && (
        <div className="container mt-8">
          <div className="flex w-full items-center justify-center space-x-2">
            {slides.map((item, index) => (
              <button
                key={getSlideKey(item, index)}
                className={cn(
                  'block h-2 w-2 rounded-full transition-colors',
                  index === selectedIndex ? 'bg-blue-400' : 'bg-gray-300',
                )}
                type="button"
                aria-label={`Choose slide ${index + 1}`}
                aria-current={index === selectedIndex}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}