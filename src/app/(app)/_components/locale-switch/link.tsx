'use client'

import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { useLocalizedRoute } from '@/app/hooks/use-localized-route'
import type { Locale } from '@/config/locales'

export const LocaleLink = ({
  locale,
  currentLocale,
  label,
}: {
  locale: Locale
  currentLocale: Locale
  label: string
}) => {
  const isActive = useMemo(() => locale === currentLocale, [locale, currentLocale])

  const href = useLocalizedRoute({ targetLocale: locale, enabled: !isActive })

  return (
    <div className="flex w-full justify-between gap-2">
      <Link className="w-full font-sans" href={href}>
        {label}
      </Link>
      {isActive && <CheckIcon className="h-5 w-5" />}
    </div>
  )
}
