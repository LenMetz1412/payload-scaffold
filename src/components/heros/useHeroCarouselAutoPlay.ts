import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

import type { CarouselApi } from '@/sha/carousel'

import type { HeroSlide } from './RenderHero'

export const DEFAULT_IMAGE_DURATION_MS = 5000
const PROGRESS_COMPLETION_BUFFER_MS = 150

export const isVideoSlide = (slide?: HeroSlide): boolean =>
  Boolean(
    slide?.media && typeof slide.media === 'object' && slide.media.mimeType?.includes('video'),
  )

export const useCarouselSelection = (carouselApi?: CarouselApi) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!carouselApi) return

    carouselApi.scrollTo(0)

    const updateSelection = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap())
    }

    updateSelection()
    carouselApi.on('select', updateSelection)

    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  return selectedIndex
}

export const useCarouselAutoplay = ({
  slides,
  carouselApi,
  selectedIndex,
  enabled = true,
  containerRef,
}: {
  slides: HeroSlide[]
  carouselApi?: CarouselApi
  selectedIndex: number
  enabled?: boolean
  containerRef?: RefObject<HTMLElement | null>
}) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const slideTimerStartRef = useRef<number>(Date.now())
  const pausedRemainingRef = useRef<number | null>(null)
  const prevSelectedIndexRef = useRef<number>(selectedIndex)
  const videoNeedsResetRef = useRef<boolean>(true)

  useEffect(() => {
    const el = containerRef?.current
    if (!el || !enabled) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef, enabled])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scrollTo = useCallback(
    (index: number) => {
      clearTimer()
      carouselApi?.scrollTo(index)
    },
    [carouselApi, clearTimer],
  )

  const scrollNext = useCallback(() => {
    clearTimer()
    carouselApi?.scrollNext()
  }, [carouselApi, clearTimer])

  const scrollPrev = useCallback(() => {
    clearTimer()
    carouselApi?.scrollPrev()
  }, [carouselApi, clearTimer])

  const registerVideo = useCallback(
    (index: number) => (node: HTMLVideoElement | null) => {
      videoRefs.current[index] = node
    },
    [],
  )

  const getVideoRef = useCallback((index: number) => {
    return videoRefs.current[index] ?? null
  }, [])

  useEffect(() => {
    if (!enabled || !carouselApi) return undefined

    clearTimer()
    const slide = slides[selectedIndex]

    const isNewSlide = selectedIndex !== prevSelectedIndexRef.current
    prevSelectedIndexRef.current = selectedIndex
    if (isNewSlide) {
      pausedRemainingRef.current = null
      videoNeedsResetRef.current = true
    }

    if (isVideoSlide(slide)) {
      const video = videoRefs.current[selectedIndex]

      if (!isVisible) {
        video?.pause()
        return undefined
      }

      if (!video) return undefined

      if (videoNeedsResetRef.current) {
        video.currentTime = 0
        videoNeedsResetRef.current = false
      }

      video.pause()
      const playPromise = video.play()
      if (playPromise instanceof Promise) {
        playPromise.catch(() => null)
      }

      const handleEnded = () => {
        clearTimer()
        timerRef.current = setTimeout(() => {
          scrollNext()
        }, PROGRESS_COMPLETION_BUFFER_MS)
      }

      video.addEventListener('ended', handleEnded)

      return () => {
        video.removeEventListener('ended', handleEnded)
        video.pause()
        clearTimer()
      }
    }

    if (!isVisible) {
      if (pausedRemainingRef.current === null) {
        const elapsed = Date.now() - slideTimerStartRef.current
        pausedRemainingRef.current = Math.max(
          0,
          DEFAULT_IMAGE_DURATION_MS + PROGRESS_COMPLETION_BUFFER_MS - elapsed,
        )
      }
      return undefined
    }

    const delay =
      pausedRemainingRef.current ?? DEFAULT_IMAGE_DURATION_MS + PROGRESS_COMPLETION_BUFFER_MS
    pausedRemainingRef.current = null
    slideTimerStartRef.current = Date.now()

    timerRef.current = setTimeout(() => {
      scrollNext()
    }, delay)

    return () => {
      clearTimer()
    }
  }, [carouselApi, clearTimer, enabled, isVisible, scrollNext, selectedIndex, slides])

  return {
    registerVideo,
    scrollNext,
    scrollPrev,
    scrollTo,
    getVideoRef,
    isVisible,
  }
}
