'use client'

import { useLocale } from '@payloadcms/ui'

import { SearchBar } from '@/components/search'
import { AdminDictionaryProvider } from '@/i18n/context/admin'
import { validateLocaleWithFallback } from '@/utils/qs'

export const BeforeDashboard = () => {
  const rawLocale = useLocale()
  const locale = validateLocaleWithFallback(rawLocale.code)

  return (
    <AdminDictionaryProvider locale={locale}>
      <div className="relative z-50 w-full rounded-md bg-accent p-3 text-black">
        <SearchBar
          locale={locale}
          variant="inline"
          adminMode
          inputClassName="bg-accent text-accent-foreground"
        />
      </div>
    </AdminDictionaryProvider>
  )
}
