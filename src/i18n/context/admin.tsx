import { type PropsWithChildren, useEffect, useState } from 'react'

import type { Locale } from '@/config/locales'
import { validateLocaleWithFallback } from '@/utils/qs'
import { type Dictionary, getDictionary } from '..'
import { DictionaryProvider } from '.'

export function AdminDictionaryProvider({
  locale,
  children,
}: { locale: Locale } & PropsWithChildren) {
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(validateLocaleWithFallback(locale)).then(setDict)
  }, [locale])

  if (!dict) return null

  return <DictionaryProvider dictionary={dict}>{children}</DictionaryProvider>
}
