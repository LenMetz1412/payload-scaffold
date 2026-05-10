import type { HTMLAttributeAnchorTarget } from 'react'

import type { Locale } from '@/config/locales'

export const secondaryNavItems = {
  instagram: {
    href: {
      en: '#',
      de: '#',
    },
    rel: 'noopener noreferrer',
    target: '_blank',
  },
  linkedin: {
    href: {
      en: '#',
      de: '#',
    },
    rel: 'noopener noreferrer',
    target: '_blank',
  },
} as const

export type SecondaryNavItemIdentifier = keyof typeof secondaryNavItems

export type SecondaryNavItem = {
  id: string
  title?: string
  icon: SecondaryNavItemIdentifier
  href: string
  rel?: string
  target?: HTMLAttributeAnchorTarget
}

export function getSecondaryNavItems(
  locale: Locale,
  identifiers?: SecondaryNavItemIdentifier[],
): SecondaryNavItem[] {
  const ids = identifiers ?? (Object.keys(secondaryNavItems) as SecondaryNavItemIdentifier[])

  return ids.map((id) => {
    const item = secondaryNavItems[id]
    return {
      id,
      icon: id,
      title: 'title' in item ? (item as { title: Record<Locale, string> }).title[locale] : undefined,
      href: item.href[locale],
      rel: 'rel' in item ? item.rel : undefined,
      target: 'target' in item ? item.target : undefined,
    }
  })
}
