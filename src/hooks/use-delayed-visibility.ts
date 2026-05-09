import { useEffect, useRef, useState } from 'react'

type UseDelayedVisibilityOptions = {
  delayMs?: number
  minDurationMs?: number
}

export function useDelayedVisibility(
  visible: boolean,
  { delayMs = 200, minDurationMs = 300 }: UseDelayedVisibilityOptions = {},
) {
  const [isVisible, setIsVisible] = useState(false)
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shownAtRef = useRef<number | null>(null)

  useEffect(() => {
    const clearShowTimeout = () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
        showTimeoutRef.current = null
      }
    }

    const clearHideTimeout = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
    }

    if (visible) {
      clearHideTimeout()
      if (isVisible) return
      clearShowTimeout()
      showTimeoutRef.current = setTimeout(() => {
        shownAtRef.current = Date.now()
        setIsVisible(true)
        showTimeoutRef.current = null
      }, delayMs)
    } else {
      clearShowTimeout()
      if (!isVisible) return
      const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : 0
      const remaining = Math.max(0, minDurationMs - elapsed)
      clearHideTimeout()
      hideTimeoutRef.current = setTimeout(() => {
        shownAtRef.current = null
        setIsVisible(false)
        hideTimeoutRef.current = null
      }, remaining)
    }

    return () => {
      clearShowTimeout()
      clearHideTimeout()
    }
  }, [visible, delayMs, minDurationMs, isVisible])

  return isVisible
}
