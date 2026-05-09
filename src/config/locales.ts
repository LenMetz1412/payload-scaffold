export const locales = ['de', 'en'] as const

export const defaultLocale: Locale = 'de'

export type Locale = (typeof locales)[number]
