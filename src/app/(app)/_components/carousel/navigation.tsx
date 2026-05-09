import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDictionary } from '@/i18n/context'
import { Button } from '@/sha/button'
import type { CarouselApi } from '@/sha/carousel'

export const CarouselNavigation = ({
  carouselApi,
  manyItems = 0,
}: {
  carouselApi: CarouselApi
  manyItems?: number
}) => {
  const t = useDictionary()
  const { perView, canScrollNext, canScrollPrev } = useCarouselNavigationState(carouselApi)

  const goTo = useCallback(
    (direction: 'prev' | 'next') => {
      if (!carouselApi) return
      const currentSnap = carouselApi.selectedScrollSnap()
      const offset = direction === 'prev' ? -perView : perView
      carouselApi.scrollTo(currentSnap + offset)
    },
    [carouselApi, perView],
  )

  const showNavigation = !!manyItems && manyItems > perView

  if (!showNavigation) return <></>

  return (
    <div className="flex w-full items-center justify-center pb-4 pr-4">
      <div className="flex justify-between md:flex-row md:items-end">
        <div className="items-start justify-end gap-2 md:flex">
          <Button
            size="icon"
            variant="outline"
            onClick={() => goTo('prev')}
            disabled={!canScrollPrev}
            className="disabled:pointer-events-auto"
            aria-label={t.CarouselNavigation.previous}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => goTo('next')}
            disabled={!canScrollNext}
            className="disabled:pointer-events-auto"
            aria-label={t.CarouselNavigation.next}
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const useCarouselNavigationState = (carouselApi: CarouselApi | undefined) => {
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [perView, setPerView] = useState(1)

  // Update scroll state
  useEffect(() => {
    if (!carouselApi) return

    carouselApi.scrollTo(0)

    const updateScrollState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }

    updateScrollState()
    carouselApi.on('select', updateScrollState)

    return () => {
      carouselApi.off('select', updateScrollState)
    }
  }, [carouselApi])

  // Update slides per view
  useEffect(() => {
    if (!carouselApi) return

    const updateSlidesPerView = () => {
      const containerWidth = carouselApi.containerNode().offsetWidth
      const slideWidth = carouselApi.slideNodes()[0]?.offsetWidth
      if (!slideWidth) return setPerView(1)

      setPerView(Math.floor(containerWidth / slideWidth))
    }

    updateSlidesPerView()
    carouselApi.on('resize', updateSlidesPerView)

    return () => {
      carouselApi.off('resize', updateSlidesPerView)
    }
  }, [carouselApi])

  return { canScrollPrev, canScrollNext, perView }
}
