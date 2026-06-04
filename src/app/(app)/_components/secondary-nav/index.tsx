import Link from 'next/link'
import type { FC, SVGProps } from 'react'

import type { Locale } from '@/config/locales'

import { InstagramIcon } from '../icons/instagram'
import { LinkedInIcon } from '../icons/linked-in'
import { LocaleSwitch } from '../locale-switch'
import {
  getSecondaryNavItems,
  type SecondaryNavItem,
  type SecondaryNavItemIdentifier,
} from './items'

type SecondaryNavPlacement = 'navbar' | 'footer'

const placementOrder: Record<SecondaryNavPlacement, SecondaryNavItemIdentifier[]> = {
  navbar: ['instagram', 'linkedin'],
  footer: ['instagram', 'linkedin'],
}

const icons: Record<SecondaryNavItemIdentifier, FC<SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
}

const brandBackgrounds: Record<SecondaryNavItemIdentifier, string> = {
  instagram:
    'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
  linkedin: '#0077B5',
}

export const SecondaryNav = ({
  locale,
  placement = 'navbar',
}: {
  locale: Locale
  placement?: SecondaryNavPlacement
}) => {
  const items = getSecondaryNavItems(locale, placementOrder[placement])

  return (
    <div className="desktop:flex-nowrap flex flex-wrap items-center gap-1">
      {items.map((item) => (
        <SecondaryNavItemLink key={item.id} item={item} />
      ))}

      <LocaleSwitch currentLocale={locale} />
    </div>
  )
}

const SecondaryNavItemLink = ({ item }: { item: SecondaryNavItem }) => {
  const { icon, href, rel, target } = item
  const Icon = icons[icon]
  const label = item.title ?? icon
  const color = brandBackgrounds[icon]

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      title={label}
      className="group relative flex size-8 items-center justify-center overflow-hidden rounded border-gray-300"
    >
      <span
        className="absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0"
        style={{ background: color }}
      />
      <Icon className="relative z-10 size-4 transition-[color,transform] duration-500 group-hover:text-white" />
    </Link>
  )
}
