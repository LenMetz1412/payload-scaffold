'use client'

import type React from 'react'
import { useEffect } from 'react'

import { useHeroTheme } from '@/contexts/HeroThemeContext'

import type { PageHeroProps } from '../RenderHero'

export const NoneHero: React.FC<PageHeroProps> = ({}) => {
  const { setHeroTheme } = useHeroTheme()

  useEffect(() => {
    setHeroTheme('light')
  }, [setHeroTheme])

  return <div className="mt-32 lg:mt-44 xl:mt-48">&nbsp;</div>
}
