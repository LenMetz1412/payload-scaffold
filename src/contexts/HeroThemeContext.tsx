'use client'

import type React from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

export type HeroTheme = 'light' | 'dark'

interface HeroThemeContextType {
  heroTheme: HeroTheme
  setHeroTheme: (theme: HeroTheme) => void
}

const HeroThemeContext = createContext<HeroThemeContextType | undefined>(undefined)

export function HeroThemeProvider({
  children,
  initTheme = 'light',
}: {
  children: React.ReactNode
  initTheme?: HeroTheme
}) {
  const [heroTheme, setHeroTheme] = useState<HeroTheme>(initTheme)

  const value = useMemo(
    () => ({
      heroTheme,
      setHeroTheme
    }),
    [heroTheme, setHeroTheme],
  )

  return (
    <HeroThemeContext.Provider value={value}>
      {children}
    </HeroThemeContext.Provider>
  )
}

export function useHeroTheme() {
  const context = useContext(HeroThemeContext)
  if (!context) {
    throw new Error('useHeroTheme must be used within a HeroThemeProvider')
  }
  return context
}
