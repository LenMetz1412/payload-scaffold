'use client'

import { GlobeIcon } from 'lucide-react'

import type { Locale } from '@/config/locales'
import { locales } from '@/config/locales'
import { useDictionary } from '@/i18n/context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/sha/dropdown-menu'
import { cn } from '@/utils/cn'

import { LocaleLink } from './link'

export const LocaleSwitch = ({
  currentLocale,
  format = 'long',
  asMobileNavBarItem,
}: {
  currentLocale: Locale
  format?: 'short' | 'long'
  asMobileNavBarItem?: boolean
}) => {
  const t = useDictionary()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger fullWidth={asMobileNavBarItem}>
        <div className={cn('flex items-center gap-2')}>
          <GlobeIcon className="size-5 desktop:size-4" />
          <span className="uppercase">{t.locales.short[currentLocale]}</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale}>
            <LocaleLink {...{ locale, currentLocale, label: t.locales[format][locale] }} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
