import { useCallback, useEffect, useRef } from 'react'

import type { HeroSlide } from './RenderHero'
import { DEFAULT_IMAGE_DURATION_MS, isVideoSlide } from './useHeroCarouselAutoPlay'

type UseSlideProgressArgs = {
  slides: HeroSlide[]
  selectedIndex: number
  hasMultipleSlides: boolean
  getVideoRef: (index: number) => HTMLVideoElement | null
  isVisible?: boolean
}

export function useSlideProgress({
  slides,
  selectedIndex,
  hasMultipleSlides,
  getVideoRef,
  isVisible = true,
}: UseSlideProgressArgs) {
  const progressBarRefsMap = useRef<Map<number, HTMLSpanElement>>(new Map())
  const progressBarRefCallbacks = useRef<Map<number, (el: HTMLSpanElement | null) => void>>(
    new Map(),
  )
  const savedElapsedRef = useRef<{ index: number; elapsed: number }>({ index: -1, elapsed: 0 })

  const setProgressBarRef = useCallback((index: number) => {
    if (!progressBarRefCallbacks.current.has(index)) {
      progressBarRefCallbacks.current.set(index, (el: HTMLSpanElement | null) => {
        if (el) progressBarRefsMap.current.set(index, el)
        else progressBarRefsMap.current.delete(index)
      })
    }
    return progressBarRefCallbacks.current.get(index)!
  }, [])

  const setBarTransform = (index: number, progress: number) => {
    const el = progressBarRefsMap.current.get(index)
    if (el) el.style.transform = `scaleX(${Math.max(0, Math.min(1, progress / 100))})`
  }

  useEffect(() => {
    if (!hasMultipleSlides || !slides.length) {
      setBarTransform(selectedIndex, 0)
      return
    }

    const currentSlide = slides[selectedIndex]
    const isVideo = isVideoSlide(currentSlide)

    let frameId: number | null = null
    let cancelled = false

    const cleanup = () => {
      cancelled = true
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    const lastRenderedProgress = { value: -1 }

    const setClampedProgress = (value: number) => {
      const clamped = Math.max(0, Math.min(100, value))
      const snapped = clamped >= 99.5 ? 100 : Math.round(clamped * 10) / 10
      if (snapped !== lastRenderedProgress.value) {
        lastRenderedProgress.value = snapped
        setBarTransform(selectedIndex, snapped)
      }
    }

    // Image slide
    if (!isVideo) {
      const duration = DEFAULT_IMAGE_DURATION_MS

      const initialElapsed =
        savedElapsedRef.current.index === selectedIndex ? savedElapsedRef.current.elapsed : 0
      savedElapsedRef.current = { index: selectedIndex, elapsed: initialElapsed }

      if (!isVisible) {
        setClampedProgress((initialElapsed / duration) * 100)
        return cleanup
      }

      const startTime = performance.now()

      const tick = (now: number) => {
        if (cancelled) return

        const elapsed = initialElapsed + (now - startTime)
        const progress = (elapsed / duration) * 100

        setClampedProgress(progress)

        if (elapsed < duration) {
          frameId = requestAnimationFrame(tick)
        } else {
          setClampedProgress(100)
        }
      }

      frameId = requestAnimationFrame(tick)

      return () => {
        savedElapsedRef.current = {
          index: selectedIndex,
          elapsed: Math.min(duration, initialElapsed + (performance.now() - startTime)),
        }
        setBarTransform(selectedIndex, 0)
        cleanup()
      }
    }

    savedElapsedRef.current = { index: -1, elapsed: 0 }

    if (!isVisible) return cleanup

    const video = getVideoRef(selectedIndex)

    if (!video) {
      setBarTransform(selectedIndex, 0)
      return cleanup
    }

    setBarTransform(selectedIndex, 0)

    const updateFromVideo = () => {
      if (cancelled) return

      const duration = video.duration

      if (!duration || !Number.isFinite(duration) || duration <= 0) {
        frameId = requestAnimationFrame(updateFromVideo)
        return
      }

      const currentTime = video.currentTime
      const rawProgress = (currentTime / duration) * 100

      setClampedProgress(rawProgress)

      if (!video.ended) {
        frameId = requestAnimationFrame(updateFromVideo)
      } else {
        setClampedProgress(100)
      }
    }

    frameId = requestAnimationFrame(updateFromVideo)

    return () => {
      setBarTransform(selectedIndex, 0)
      cleanup()
    }
  }, [getVideoRef, hasMultipleSlides, isVisible, selectedIndex, slides])

  return { setProgressBarRef }
}
