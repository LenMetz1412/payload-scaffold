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
import { useSlideProgress } from '../useSlideProgress'

const blockHeightClass: Record<string, string> = {
  full: 'min-h-[67vh] md:min-h-[70vh] lg:min-h-[80vh]',
  medium: 'min-h-[40vh] md:min-h-[45vh] lg:min-h-[50vh]',
  small: 'min-h-[25vh] md:min-h-[28vh] lg:min-h-[33vh]',
}

export const HighImpactHero: React.FC<PageHeroProps> = ({
  slide,
  theme,
  imageOverlay,
  locale,
  blockHeight,
}) => {
  const height = blockHeight ?? 'full'
  const slides = slide ?? []
  const hasMultipleSlides = slides.length > 1

  const { heroTheme, setHeroTheme } = useHeroTheme()
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const selectedIndex = useCarouselSelection(carouselApi)
  const containerRef = useRef<HTMLDivElement>(null)

  const [renderedSlides, setRenderedSlides] = useState<Set<number>>(() => new Set([0]))

  useEffect(() => {
    if (!hasMultipleSlides) return
    setRenderedSlides((prev) => {
      const next = new Set(prev)
      next.add(selectedIndex)
      next.add((selectedIndex + 1) % slides.length)
      return next
    })
  }, [selectedIndex, hasMultipleSlides, slides.length])

  const { registerVideo, scrollTo, getVideoRef, isVisible } = useCarouselAutoplay({
    slides,
    carouselApi,
    selectedIndex,
    enabled: hasMultipleSlides,
    containerRef,
  })

  const { setProgressBarRef } = useSlideProgress({
    slides,
    selectedIndex,
    hasMultipleSlides,
    getVideoRef,
    isVisible,
  })

  const { heading1, heading2 } = getHeroHeading({})

  useEffect(() => {
    setHeroTheme(theme ?? 'light')
  }, [setHeroTheme, theme])

  if (!slides.length) return null

  const renderHighImpactContent = (slide: HeroSlide, index: number) => {
    const isVideo = isVideoSlide(slide)
    const shouldLoopVideo = !hasMultipleSlides && isVideo
    const shouldAutoPlay = !hasMultipleSlides && isVideo
    const shouldPrioritize = index === 0
    const shouldRenderMedia = !hasMultipleSlides || renderedSlides.has(index)

    const sizes = '(min-width: 1920px) 1920px, (min-width: 1400px) 1400px, 100vw'

    return (
      <div
        className={cn(
          'relative flex w-full items-center justify-center text-black',
          heroTheme === 'dark' ? 'text-background' : 'text-foreground',
        )}
      >
        <div
          className={cn(
            'relative z-10 flex w-full items-center justify-center overflow-hidden',
            blockHeightClass[height],
          )}
        >
          {slide.media && typeof slide.media === 'object' && shouldRenderMedia && (
            <div className="absolute inset-0 -z-10">
              <Media
                className="absolute inset-0"
                fill
                imgClassName="h-full w-full object-cover"
                videoClassName="block h-full w-full object-cover"
                size={sizes}
                videoProps={{
                  ref: registerVideo(index),
                  loop: shouldLoopVideo,
                  autoPlay: shouldAutoPlay,
                }}
                priority={shouldPrioritize}
                resource={slide.media}
                isHero={shouldPrioritize}
              />
            </div>
          )}

          {imageOverlay && imageOverlay !== 'original' && (
            <div
              className={cn(
                'pointer-events-none absolute inset-0 z-0',
                imageOverlay === 'darken' ? 'bg-black/20' : 'bg-white/40',
              )}
            />
          )}

          <div className="pointer-events-none z-10 w-full max-w-[92vw] place-items-center text-center xl:max-w-[82vw]">
            {(heading1 || heading2) && (
              <h1 className="pointer-events-auto flex w-full flex-col place-items-center whitespace-pre-wrap text-center">
                {heading2 && (
                  <p
                    className={cn(
                      'label pointer-events-auto mb-2 w-fit text-pretty text-center text-2xl md:text-3xl lg:text-4xl xl:text-4xl',
                      heroTheme === 'dark' && 'border-background bg-background text-foreground',
                    )}
                    dangerouslySetInnerHTML={{ __html: heading2 }}
                  />
                )}
                {heading1 && (
                  <p
                    dangerouslySetInnerHTML={{ __html: heading1 }}
                    className="pointer-events-auto w-fit leading-none md:text-5xl lg:text-6xl xl:text-7xl"
                  />
                )}
              </h1>
            )}

            {!heading1 && !heading2 && slide.richText && (
              <RichText
                className={cn(
                  'mt-35 pointer-events-auto mb-2 md:mt-28',
                  heroTheme === 'dark' && 'prose-invert',
                )}
                data={slide.richText}
                enableGutter={false}
                enableProse={true}
                locale={locale}
              />
            )}

            {!heading1 && !heading2 && Array.isArray(slide.links) && slide.links.length > 0 && (
              <ul className="flex w-full flex-wrap place-items-center justify-center gap-2 md:flex-row md:gap-4">
                {slide.links.map(({ id, link }) => (
                  <li key={id}>
                    <CMSLink
                      {...link}
                      locale={locale}
                      className={cn(
                        'pointer-events-auto',
                        heroTheme === 'dark' &&
                          link.appearance === 'outline' &&
                          'border-background hover:border-foreground',
                        heroTheme === 'dark' &&
                          link.appearance === 'filled' &&
                          'border-background bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background',
                      )}
                      size="lg"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }

  const getSlideKey = (item: HeroSlide, index: number) => item.id ?? `slide-${index}`

  return (
    <div ref={containerRef} className="relative">
      {hasMultipleSlides ? (
        <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
          <CarouselContent>
            {slides.map((item, index) => (
              <CarouselItem key={getSlideKey(item, index)}>
                {renderHighImpactContent(item, index)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        slides.map((item, index) => (
          <div key={getSlideKey(item, index)}>{renderHighImpactContent(item, index)}</div>
        ))
      )}

      {hasMultipleSlides && (
        <div className="absolute bottom-8 left-0 w-full">
          <div className="flex items-end justify-center gap-x-4">
            {slides.map((item, index) => (
              <button
                key={getSlideKey(item, index)}
                className={cn(
                  'relative inline-block h-2 w-8 overflow-hidden pt-2 transition-all duration-300',
                  'before:pointer-events-auto before:absolute before:-bottom-8 before:-left-1 before:-right-1 before:-top-8 before:content-[""]',
                  index === selectedIndex ? 'w-16' : '',
                  heroTheme === 'dark'
                    ? index === selectedIndex
                      ? 'bg-background/40'
                      : 'bg-background'
                    : index === selectedIndex
                      ? 'bg-foreground/35'
                      : 'bg-foreground',
                )}
                type="button"
                aria-label={`Choose slide ${index + 1}`}
                aria-current={index === selectedIndex}
                onClick={() => scrollTo(index)}
              >
                <span
                  ref={setProgressBarRef(index)}
                  className={cn(
                    'absolute inset-0 origin-left scale-x-0 transform-gpu',
                    heroTheme === 'dark' ? 'bg-background' : 'bg-foreground',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
