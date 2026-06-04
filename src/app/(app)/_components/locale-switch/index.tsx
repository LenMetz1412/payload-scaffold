'use client'

import { GlobeIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

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
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (locale: Locale) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`)
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger fullWidth={asMobileNavBarItem}>
        <div className={cn('flex items-center gap-2')}>
          <GlobeIcon className="size-5 desktop:size-4" />
          <span className="uppercase">{t.locales.short[currentLocale]}</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-5 w-23">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} onSelect={() => switchLocale(locale)}>
            <span className={cn('font-sans', { 'font-medium': locale === currentLocale })}>
              {t.locales[format][locale]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
