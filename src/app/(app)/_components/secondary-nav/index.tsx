import Link from 'next/link'
import type { FC, SVGProps } from 'react'

import type { Locale } from '@/config/locales'
import { menuTriggerVariants } from '@/sha/variants'

import { FacebookIcon } from '../icons/facebook'
import { InstagramIcon } from '../icons/instagram'
import { LeichteSpracheIcon } from '../icons/leichte-sprache'
import { LinkedInIcon } from '../icons/linked-in'
import { NewsletterIcon } from '../icons/newsletter'
import { LocaleSwitch } from '../locale-switch'
import {
  getSecondaryNavItems,
  type SecondaryNavItem,
  type SecondaryNavItemIdentifier,
} from './items'

type SecondaryNavPlacement = 'navbar' | 'footer'

const placementOrder: Record<SecondaryNavPlacement, SecondaryNavItemIdentifier[]> = {
  navbar: ['easyLanguage', 'instagram', 'linkedin', 'newsletter'],
  footer: ['easyLanguage', 'instagram', 'linkedin', 'facebook'],
}

const icons: Record<SecondaryNavItemIdentifier, FC<SVGProps<SVGSVGElement>>> = {
  easyLanguage: LeichteSpracheIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  newsletter: NewsletterIcon,
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
