'use client'

import { useEffect, useState } from 'react'

import { mediaQueries } from '@/config/breakpoints'

export const breakpoints = mediaQueries

export type Breakpoint = keyof typeof breakpoints

export function useMediaQuery(
  query: Breakpoint | string,
  onChange?: (matches: boolean) => void,
): boolean {
  const mediaQuery = query in breakpoints ? breakpoints[query as Breakpoint] : query

  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(mediaQuery)
    const updateMatches = () => {
      const newMatches = media.matches
      setMatches(newMatches)
      onChange?.(newMatches)
    }
    updateMatches()
    media.addEventListener('change', updateMatches)

    return () => media.removeEventListener('change', updateMatches)
  }, [mediaQuery, onChange])

  return matches
}
