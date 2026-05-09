'use client'

import type React from 'react'
import { useEffect } from 'react'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { useHeroTheme } from '@/contexts/HeroThemeContext'

import type { PageHeroProps } from '../RenderHero'
import { getHeroHeading } from '../shared-hero'

export const LowImpactHero: React.FC<PageHeroProps> = ({
  richText,
  links,
  locale,
}) => {
  const { setHeroTheme } = useHeroTheme()
  const { heading1, heading2 } = getHeroHeading()
  const hasHeading = Boolean(heading1 || heading2)
  const hasLinks = Array.isArray(links) && links.length > 0

  useEffect(() => {
    setHeroTheme('light')
  })

  if (!hasHeading && !richText && !hasLinks) {
    return null
  }

  return (
    <div className="container mt-36 md:mt-44 lg:mt-64 xl:mt-[350px]">
      {hasHeading && (
        <h1 className="w-full whitespace-pre-wrap">
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

      {!hasHeading && richText && (
        <RichText
          className="mb-2 mt-36 w-full md:mt-44 lg:mt-64 xl:mt-[350px]"
          data={richText}
          enableGutter={false}
          enableProse={true}
        />
      )}

      {!hasHeading && hasLinks && (
        <ul className="ml-8 flex w-full flex-wrap gap-2 md:ml-28 md:flex-row md:gap-4">
          {links.map(({ id, link }, index) => (
            <li key={id ?? index}>
              <CMSLink {...link} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
