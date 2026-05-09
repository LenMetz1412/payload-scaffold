import type { Locale } from 'date-fns'
import { de as deLocale, enGB } from 'date-fns/locale'

import type { Locale as AppLocale } from '@/config/locales'

export const dateLocaleMap: Record<AppLocale, Locale> = {
  de: deLocale,
  en: enGB,
}

export const compactMonthLabels: Record<AppLocale, string[]> = {
  de: [
    'Jan.',
    'Feb.',
    'Mär.',
    'Apr.',
    'Mai',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Okt.',
    'Nov.',
    'Dez.',
  ],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

export const getDayOrdinalSuffix = (locale: AppLocale): string => (locale === 'de' ? '.' : '')

export const splitDateTime = ({
  isoString,
  timeZone,
  hasTimePrecision,
}: {
  isoString?: string | null
  timeZone?: string
  hasTimePrecision?: boolean
}) => {
  if (!isoString) return { date: undefined, time: undefined }
  const d = new Date(isoString)

  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
  const optionsTime: Intl.DateTimeFormatOptions = {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  const date = d.toLocaleDateString('en-CA', optionsDate)
  const time = hasTimePrecision ? d.toLocaleTimeString('en-GB', optionsTime) : undefined

  return { date, time }
}
