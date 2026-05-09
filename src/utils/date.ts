import { TZDate } from '@date-fns/tz'
import type { Locale as DateFnsLocale } from 'date-fns'
import { endOfDay, format, isSameDay, startOfDay } from 'date-fns'

import type { Locale as AppLocale } from '@/config/locales'
import { UNIVERSAL_TIMEZONE } from '@/config/timezone'

import { compactMonthLabels, dateLocaleMap, getDayOrdinalSuffix } from './i18n/date'

export type DatePrecision = 'time' | 'day' | 'month' | 'trimester' | 'year' | null

export const parseUniversalDate = (date: string | Date | number): Date => {
  return new TZDate(new Date(date).getTime(), UNIVERSAL_TIMEZONE)
}

export function parseUniversalOptionalDate(
  dateInput: Date | string | null | undefined,
): Date | null {
  if (!dateInput) return null

  try {
    return parseUniversalDate(dateInput)
  } catch (error) {
    console.error('Failed to parse date:', dateInput, error)
    return null
  }
}

export const formatUniversalDate = (
  date: string | Date | number,
  formatStr: string,
  options?: { locale?: DateFnsLocale },
): string => {
  return format(parseUniversalDate(date), formatStr, options)
}

export function formatUniversalOptionalDate(
  dateString: Date | string | null | undefined,
  formatString: string,
  locale: DateFnsLocale,
): string | null {
  if (!dateString) return null
  try {
    return formatUniversalDate(dateString, formatString, { locale })
  } catch (error) {
    console.error('Failed to format date:', dateString, error)
    return null
  }
}

export const isUniversalToday = (universalDate?: Date | null): boolean => {
  if (!universalDate) return false

  const todayInUniversalTZ = new TZDate(new Date(), UNIVERSAL_TIMEZONE)
  const universalDateInUniversalTZ = new TZDate(universalDate, UNIVERSAL_TIMEZONE)

  return isSameDay(todayInUniversalTZ, universalDateInUniversalTZ)
}

export const getStartOfToday = (): Date => startOfDay(new TZDate(new Date(), UNIVERSAL_TIMEZONE))
export const getStartOfTodayISO = () => getStartOfToday().toISOString()

export const getStartOfDay = (date: Date): Date => startOfDay(new TZDate(date, UNIVERSAL_TIMEZONE))
export const getStartOfDayISO = (date: Date): string => getStartOfDay(date).toISOString()

export const getEndOfDay = (date: Date): Date => endOfDay(new TZDate(date, UNIVERSAL_TIMEZONE))
export const getEndOfDayISO = (date: Date): string => getEndOfDay(date).toISOString()

export interface DatePrecisionFormatOptions {
  startDate: Date
  endDate?: Date | null
  locale: DateFnsLocale
}

export interface YearPrecision {
  year: string
  yearShort: string

  yearEnd?: string | null
  yearEndShort?: string | null
  yearLabel?: string
}

export function getYearPrecision({
  startDate,
  endDate,
  locale,
}: DatePrecisionFormatOptions): YearPrecision {
  const year = formatUniversalDate(startDate, 'yyyy', { locale })
  const yearShort = formatUniversalDate(startDate, 'yy', { locale })
  const yearEnd = formatUniversalOptionalDate(endDate, 'yyyy', locale)
  const yearEndShort = formatUniversalOptionalDate(endDate, 'yy', locale)
  const yearLabel = [...new Set([year, yearEnd].filter(Boolean))].join(' – ')

  return { year, yearShort, yearEnd, yearEndShort, yearLabel }
}

export interface TrimesterPrecision extends YearPrecision {
  quarter: string
  quarterEnd?: string | null
  sameYear: boolean
  sameQuarter: boolean
}

export function getTrimesterPrecision({
  startDate,
  endDate,
  locale,
}: DatePrecisionFormatOptions): TrimesterPrecision {
  const { year, yearShort, yearEnd, yearEndShort } = getYearPrecision({
    startDate,
    endDate,
    locale,
  })

  const startQuarter = Math.floor(startDate.getMonth() / 3) + 1
  const quarter = `Q${startQuarter}`

  let quarterEnd: string | null = null
  if (endDate) {
    const endQuarter = Math.floor(endDate.getMonth() / 3) + 1
    quarterEnd = `Q${endQuarter}`
  }

  const sameYear = !endDate || !yearEnd || year === yearEnd
  const sameQuarter = !endDate || !quarterEnd || quarterEnd === quarter

  return {
    quarter,
    quarterEnd,
    year,
    yearShort,
    yearEnd,
    yearEndShort,
    sameYear,
    sameQuarter,
  }
}

export interface MonthPrecision extends YearPrecision {
  month: string
  monthShort: string

  monthEnd?: string | null
  monthEndShort?: string | null

  sameYear: boolean
  sameMonth: boolean
}

export function getMonthPrecision({
  startDate,
  endDate,
  locale,
}: DatePrecisionFormatOptions): MonthPrecision {
  const { year, yearShort, yearEnd, yearEndShort } = getYearPrecision({
    startDate,
    endDate,
    locale,
  })

  const month = formatUniversalDate(startDate, 'MMMM', { locale })
  const monthShort = formatUniversalDate(startDate, 'MMM', { locale })

  const monthEnd = formatUniversalOptionalDate(endDate, 'MMMM', locale)
  const monthEndShort = formatUniversalOptionalDate(endDate, 'MMM', locale)

  const sameYear = !endDate || !yearEnd || year === yearEnd
  const sameMonth = !endDate || !monthEnd || monthEnd === month

  return {
    month,
    monthShort,
    year,
    yearShort,
    monthEnd,
    monthEndShort,
    yearEnd,
    yearEndShort,
    sameYear,
    sameMonth,
  }
}

export interface DayPrecision extends MonthPrecision {
  day: string
  dayEnd: string | null
  weekDay: string
  weekDayEnd: string | null
  time: string | null
  timeEnd: string | null
  sameDay: boolean
}

export function getDayPrecision({
  startDate,
  endDate,
  locale,
  precision,
}: { precision: DatePrecision } & DatePrecisionFormatOptions): DayPrecision {
  const monthInfo = getMonthPrecision({ startDate, endDate, locale })
  const day = formatUniversalDate(startDate, 'dd', { locale })
  const dayEnd = formatUniversalOptionalDate(endDate, 'dd', locale)

  return {
    ...monthInfo,
    day,
    dayEnd,
    weekDay: formatUniversalDate(startDate, 'EEEEEE', { locale }),
    weekDayEnd: formatUniversalOptionalDate(endDate, 'EEEEEE', locale),
    time: precision === 'time' ? formatUniversalOptionalDate(startDate, 'p', locale) : null,
    timeEnd: precision === 'time' ? formatUniversalOptionalDate(endDate, 'p', locale) : null,
    sameDay: !endDate || !dayEnd || day === dayEnd,
  }
}

export const getMonthYearTimeLabel = ({
  month,
  year,
  time,
  sameMonth,
  sameYear,
  hasEndDate,
  showTime,
}: {
  month?: string | null
  year?: string | null
  time?: string | null
  sameMonth: boolean
  sameYear: boolean
  hasEndDate: boolean
  showTime: boolean
}): string | null => {
  // != month
  if (!sameMonth && month) {
    if (showTime) {
      // Return null if time is missing for END label checks
      if (!sameYear && year) return time ? `${month} ${year}, ${time}` : null
      return time ? `${month}, ${time}` : null
    }

    // !=year
    if (!sameYear && year) {
      return `${month} ${year}`
    }

    return month
  }

  // == month != year
  if (hasEndDate && !sameYear && month && year) {
    if (showTime) {
      // Return null if time is missing  for END label checks
      return time ? `${month} ${year}, ${time}` : null
    }
    return `${month} ${year}`
  }

  // == month == year
  return showTime ? (time ?? null) : null
}

export function isEndDateBeforeStartDate(start?: string, end?: string) {
  if (!start || !end) return false

  const s = new Date(start)
  const e = new Date(end)
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return false
  return e < s
}

export function hasEndDateWithoutStartDate(start?: string, end?: string) {
  return Boolean(end && !start)
}

export const formatPickerDate = (d: Date | undefined): string | undefined => {
  if (!d) return undefined

  const year = d.getFullYear()
  const month = d.getMonth()
  const day = d.getDate()

  // as numeric TZDate does not fully disgest dst with string constructor
  const berlinDate = new TZDate(year, month, day, 0, 0, 0, 0, UNIVERSAL_TIMEZONE)

  return berlinDate.toISOString()
}

export const parsePickerDateToLocal = (isoString: string): Date => {
  // picker uses browser tz
  const [datePart] = isoString.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const getPickerDisplayMonths = (
  startDate: Date | undefined,
  endDate: Date | undefined,
): { start: Date; end: Date } => {
  const start = startDate ?? new Date()

  const end =
    endDate ??
    (() => {
      const oneMonthLater = new Date(start)
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)
      return oneMonthLater
    })()

  return { start, end }
}

export function formatCompactDateRange(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
  locale?: DateFnsLocale,
  datePrecision?: DatePrecision,
): string {
  const start = parseUniversalOptionalDate(startDate)
  if (!start) return ''

  const end = parseUniversalOptionalDate(endDate)
  if (datePrecision === 'year') {
    // console.log('formatCompactDateRange: using year precision')
    const { year, yearEnd } = getYearPrecision({
      startDate: start,
      endDate: end,
      locale: locale!,
    })

    if (!end || !yearEnd || yearEnd === year) {
      return year
    }

    return `${year}–${yearEnd}`
  }

  if (datePrecision === 'month') {
    const { monthShort, monthEndShort, year, yearEnd } = getMonthPrecision({
      startDate: start,
      endDate: end,
      locale: locale!,
    })

    if (!end || !monthEndShort || !yearEnd) {
      return `${monthShort} ${year}`
    }

    if (monthEndShort === monthShort && yearEnd === year) {
      return `${monthShort} ${year}`
    }

    if (yearEnd === year) {
      return `${monthShort}–${monthEndShort} ${year}`
    }

    return `${monthShort} ${year}–${monthEndShort} ${yearEnd}`
  }

  const dayInfo = getDayPrecision({
    startDate: start,
    endDate: end,
    locale: locale!,
    precision: null,
  })

  // day
  if (!end || dayInfo.sameDay) {
    return `${dayInfo.day}. ${dayInfo.monthShort} ${dayInfo.year}`
  }

  // === month and year
  if (dayInfo.sameMonth && dayInfo.sameYear) {
    return `${dayInfo.day}.–${dayInfo.dayEnd}. ${dayInfo.monthShort} ${dayInfo.year}`
  }

  // === year !== months
  if (dayInfo.sameYear) {
    return `${dayInfo.day}. ${dayInfo.monthShort}–${dayInfo.dayEnd}. ${dayInfo.monthEndShort} ${dayInfo.year}`
  }

  // !== years
  return `${dayInfo.day}. ${dayInfo.monthShort} ${dayInfo.year}–${dayInfo.dayEnd}. ${dayInfo.monthEndShort} ${dayInfo.yearEnd}`
}

const pdfCompactMonth = (date: string | Date, appLocale: AppLocale): string => {
  const monthIndex = Number(formatUniversalDate(date, 'M')) - 1
  return compactMonthLabels[appLocale][monthIndex]
}

export const getPdfDateParts = ({
  startDate,
  endDate,
  datePrecision,
  locale,
}: {
  startDate?: string | null
  endDate?: string | null
  datePrecision?: DatePrecision
  locale: AppLocale
}): { start: string; end?: string; time?: string } | null => {
  if (!startDate) return null

  if (datePrecision === 'year') {
    const date = parseUniversalDate(startDate)
    return { start: date.getFullYear().toString() }
  }

  if (datePrecision === 'trimester') {
    const date = parseUniversalDate(startDate)
    const quarter = Math.floor(date.getMonth() / 3) + 1
    return { start: `Q${quarter} ${date.getFullYear()}` }
  }

  if (datePrecision === 'month') {
    const { monthEnd, year, yearEnd, sameYear, sameMonth } = getMonthPrecision({
      startDate: parseUniversalDate(startDate),
      endDate: parseUniversalOptionalDate(endDate),
      locale: dateLocaleMap[locale],
    })
    if (monthEnd && sameYear && !sameMonth && endDate) {
      return {
        start: `${pdfCompactMonth(startDate, locale)}–${pdfCompactMonth(endDate, locale)} ${year}`,
      }
    }
    if (monthEnd && !sameYear && yearEnd && endDate) {
      return {
        start: `${pdfCompactMonth(startDate, locale)} ${year}`,
        end: `${pdfCompactMonth(endDate, locale)} ${yearEnd}`,
      }
    }
    return { start: `${pdfCompactMonth(startDate, locale)} ${year}` }
  }

  if (datePrecision === 'time') {
    const fnsLocale = dateLocaleMap[locale]
    const dayInfo = getDayPrecision({
      startDate: parseUniversalDate(startDate),
      endDate: parseUniversalOptionalDate(endDate),
      locale: fnsLocale,
      precision: 'time',
    })
    const dateStr = `${dayInfo.day}. ${pdfCompactMonth(startDate, locale)} ${dayInfo.year}`
    const isSameDay = dayInfo.sameDay && dayInfo.sameMonth && dayInfo.sameYear
    const startStr = dayInfo.time ? `${dateStr}, ${dayInfo.time}` : dateStr

    if (!isSameDay && endDate) {
      const endDateStr = `${dayInfo.dayEnd}. ${pdfCompactMonth(endDate, locale)} ${dayInfo.yearEnd ?? dayInfo.year}`
      const endStr = dayInfo.timeEnd ? `${endDateStr}, ${dayInfo.timeEnd}` : endDateStr
      return { start: startStr, end: endStr }
    }

    if (isSameDay && dayInfo.time && dayInfo.timeEnd && dayInfo.timeEnd !== dayInfo.time) {
      return { start: `${dateStr},`, time: `${dayInfo.time} – ${dayInfo.timeEnd}` }
    }

    return { start: startStr }
  }

  // day precision (default)
  const dayInfo = getDayPrecision({
    startDate: parseUniversalDate(startDate),
    endDate: parseUniversalOptionalDate(endDate),
    locale: dateLocaleMap[locale],
    precision: null,
  })

  // single day
  if (!endDate || dayInfo.sameDay) {
    return { start: `${dayInfo.day}. ${pdfCompactMonth(startDate, locale)} ${dayInfo.year}` }
  }

  // same month: short range fits on one line
  if (dayInfo.sameMonth && dayInfo.sameYear) {
    return {
      start: `${dayInfo.day}.–${dayInfo.dayEnd}. ${pdfCompactMonth(startDate, locale)} ${dayInfo.year}`,
    }
  }

  // different months (same or different year): split into start + end
  return {
    start: `${dayInfo.day}. ${pdfCompactMonth(startDate, locale)} ${dayInfo.year}`,
    end: `${dayInfo.dayEnd}. ${pdfCompactMonth(endDate, locale)} ${dayInfo.sameYear ? dayInfo.year : dayInfo.yearEnd}`,
  }
}

export const getSimpleDateLabel = ({
  startDate,
  endDate,
  datePrecision,
  locale,
}: {
  startDate?: string | null
  endDate?: string | null
  datePrecision?: DatePrecision
  locale: AppLocale
}) => {
  if (!startDate) return null

  if (datePrecision === 'year') {
    const date = parseUniversalDate(startDate)
    return date.getFullYear().toString()
  }

  if (datePrecision === 'trimester') {
    const date = parseUniversalDate(startDate)
    const quarter = Math.floor(date.getMonth() / 3) + 1
    return `Q${quarter} ${date.getFullYear()}`
  }

  if (datePrecision === 'month') {
    const { month, monthEnd, year, yearEnd, sameYear, sameMonth } = getMonthPrecision({
      startDate: parseUniversalDate(startDate),
      endDate: parseUniversalOptionalDate(endDate),
      locale: dateLocaleMap[locale],
    })
    const showRange = monthEnd && ((sameYear && !sameMonth) || (!sameYear && yearEnd))
    if (showRange) {
      const start = sameYear ? month : `${month} ${year}`
      const end = `${monthEnd} ${yearEnd ?? year}`
      return `${start} – ${end}`
    }
    return `${month} ${year}`
  }

  if (datePrecision === 'time') {
    const fnsLocale = dateLocaleMap[locale]
    const dayInfo = getDayPrecision({
      startDate: parseUniversalDate(startDate),
      endDate: parseUniversalOptionalDate(endDate),
      locale: fnsLocale,
      precision: 'time',
    })
    const isSameDay = dayInfo.sameDay && dayInfo.sameMonth && dayInfo.sameYear
    const uhrSuffix = locale === 'de' ? ' Uhr' : ''
    const d = getDayOrdinalSuffix(locale)

    if (!isSameDay && endDate) {
      const dateStart = `${dayInfo.day}${d} ${pdfCompactMonth(startDate, locale)}${!dayInfo.sameYear ? ` ${dayInfo.year}` : ''}`
      const dateEnd = `${dayInfo.dayEnd}${d} ${pdfCompactMonth(endDate, locale)} ${dayInfo.yearEnd ?? dayInfo.year}`
      const timeRange =
        dayInfo.time && dayInfo.timeEnd && dayInfo.time !== dayInfo.timeEnd
          ? `, ${dayInfo.time} – ${dayInfo.timeEnd}${uhrSuffix}`
          : dayInfo.time
            ? `, ${dayInfo.time}${uhrSuffix}`
            : ''
      return `${dateStart} – ${dateEnd}${timeRange}`
    }

    if (isSameDay && dayInfo.time && dayInfo.timeEnd && dayInfo.timeEnd !== dayInfo.time) {
      return `${dayInfo.day}${d} ${pdfCompactMonth(startDate, locale)} ${dayInfo.year}, ${dayInfo.time} – ${dayInfo.timeEnd}${uhrSuffix}`
    }

    const timeStr = dayInfo.time ? `, ${dayInfo.time}${uhrSuffix}` : ''
    return `${dayInfo.day}${d} ${pdfCompactMonth(startDate, locale)} ${dayInfo.year}${timeStr}`
  }

  // day precision
  const dayInfo = getDayPrecision({
    startDate: parseUniversalDate(startDate),
    endDate: parseUniversalOptionalDate(endDate),
    locale: dateLocaleMap[locale],
    precision: 'day',
  })
  const d = getDayOrdinalSuffix(locale)

  if (!endDate || (dayInfo.sameDay && dayInfo.sameMonth && dayInfo.sameYear)) {
    return `${dayInfo.day}${d} ${pdfCompactMonth(startDate, locale)} ${dayInfo.year}`
  }

  if (dayInfo.sameMonth && dayInfo.sameYear) {
    return `${dayInfo.day}${d}–${dayInfo.dayEnd}${d} ${pdfCompactMonth(startDate, locale)} ${dayInfo.year}`
  }

  if (dayInfo.sameYear) {
    return `${dayInfo.day}${d} ${pdfCompactMonth(startDate, locale)} – ${dayInfo.dayEnd}${d} ${pdfCompactMonth(endDate, locale)} ${dayInfo.year}`
  }

  return `${dayInfo.day}${d} ${pdfCompactMonth(startDate, locale)} ${dayInfo.year} – ${dayInfo.dayEnd}${d} ${pdfCompactMonth(endDate, locale)} ${dayInfo.yearEnd}`
}

export const formatDateRange = ({
  startDate: start,
  endDate: end,
  locale: appLocale,
}: {
  startDate?: string | null
  endDate?: string | null
  locale: AppLocale
}): string | null => {
  if (!start) return null

  const locale = dateLocaleMap[appLocale]
  const startLabel = formatUniversalDate(start, 'd MMMM yyyy', { locale })
  const endLabel = end ? formatUniversalDate(end, 'd MMMM yyyy', { locale }) : undefined

  if (!endLabel || startLabel === endLabel) return startLabel

  return `${startLabel} – ${endLabel}`
}

export const getLongMonth = ({ date, locale }: { date?: string | null; locale: AppLocale }) => {
  if (!date) return null
  return formatUniversalDate(date, 'MMMM', { locale: dateLocaleMap[locale] })
}

export const getMonthYear = ({ date, locale }: { date?: string | null; locale: AppLocale }) => {
  if (!date) return null
  return formatUniversalDate(date, 'MMMM yyyy', {
    locale: dateLocaleMap[locale],
  })
}

export const dateToTimestamp = (date: string | null | undefined): number | null => {
  if (!date) return null
  const ts = new Date(date).getTime()
  return Number.isNaN(ts) ? null : ts
}
