import type { Locale } from '@/config/locales'
import { defaultLocale, locales } from '@/config/locales'

const dictionaries: Record<Locale, () => Promise<typeof import('@/i18n/dictionaries/de.json')>> = {
  en: () => import('@/i18n/dictionaries/en.json').then((module) => module.default),
  de: () => import('@/i18n/dictionaries/de.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) =>
  dictionaries[locales.includes(locale) ? locale : defaultLocale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
