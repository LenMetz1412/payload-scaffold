import Link from 'next/link'
import type { FC, SVGProps } from 'react'

import type { Locale } from '@/config/locales'
import { menuTriggerVariants } from '@/sha/variants'

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

export const SecondaryNav = ({
  locale,
  placement = 'navbar',
}: {
  locale: Locale
  placement?: SecondaryNavPlacement
}) => {
  const items = getSecondaryNavItems(locale, placementOrder[placement])

  return (
    <div className="desktop:flex-nowrap flex flex-wrap items-center">
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

  return (
    <Link
      className={menuTriggerVariants({ format: 'iconLink' })}
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      title={label}
    >
      <Icon className="size-5" />
    </Link>
  )
}
