'use client'

import type { Locale as DateFnsLocale } from 'date-fns'
import type { PropsWithChildren } from 'react'

import type { Locale as AppLocale } from '@/config/locales'
import { defaultLocale } from '@/config/locales'
import { cn } from '@/utils/cn'
import type { DatePrecision } from '@/utils/date'
import {
  getDayPrecision,
  getMonthPrecision,
  getMonthYearTimeLabel,
  getTrimesterPrecision,
  getYearPrecision,
  parseUniversalOptionalDate,
} from '@/utils/date'
import { dateLocaleMap } from '@/utils/i18n/date'

export type DatePrecisionViewType = 'item' | 'carouselItem' | 'grid' | 'list' | null | undefined
// when should the year be shown in month display?
export function shouldShowYearInMonth(type: DatePrecisionViewType, start: Date): boolean {
  if (type === 'list') return false

  if (type === 'carouselItem') {
    // show only if year is not the current year
    const startYear = start.getFullYear()
    const currentYear = new Date().getFullYear()
    return startYear !== currentYear
  }

  return true
}

interface DateBadgePrecisionProps {
  startDate?: string | null
  endDate?: string | null
  datePrecision?: DatePrecision
  locale?: AppLocale
  type?: DatePrecisionViewType
  className?: string
}

const CtnWrapper = ({ className, children }: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={cn(
        'flex w-fit flex-row items-center gap-1 bg-foreground px-2 font-sans text-background',
        className,
      )}
    >
      {children}
    </div>
  )
}

////////////////////////// YEAR

export const DateComponentYearPrecision = (props: DateBadgePrecisionProps) => {
  const { startDate, endDate, locale, type, className } = prepareDateBadgeData(props)
  if (!startDate || type === 'list') return null
  const { yearLabel } = getYearPrecision({ startDate, endDate, locale })
  return <CtnWrapper className={className}>{yearLabel}</CtnWrapper>
}

////////////////////////// TRIMESTER

export const DateComponentTrimesterPrecision = (props: DateBadgePrecisionProps) => {
  const { endDate, startDate, locale, type, className } = prepareDateBadgeData(props)

  if (!startDate || type === 'list') return null

  const { quarter, quarterEnd, year, yearEnd, sameYear, sameQuarter } = getTrimesterPrecision({
    startDate,
    endDate,
    locale,
  })

  const showRange = (!sameQuarter || !sameYear) && quarterEnd && yearEnd

  return (
    <CtnWrapper className={className}>
      <span>
        {quarter} {year}
      </span>
      {showRange && (
        <>
          <hr className="mx-2 self-center border-[1px] border-white px-1" />
          <span>
            {quarterEnd} {yearEnd}
          </span>
        </>
      )}
    </CtnWrapper>
  )
}

////////////////////////// MONTH

export const DateComponentMonthPrecision = (props: DateBadgePrecisionProps) => {
  const { endDate, startDate, locale, type, className } = prepareDateBadgeData(props)
  if (!startDate || type === 'list') return null
  const { month, monthEnd, year, yearEnd, sameYear, sameMonth } = getMonthPrecision({
    startDate,
    endDate,
    locale,
  })

  const showRange = monthEnd && ((sameYear && !sameMonth) || (!sameYear && yearEnd))

  const showYear = shouldShowYearInMonth(type ?? null, startDate)

  return (
    <CtnWrapper className={className}>
      <span>
        {month} {!sameYear && year}
      </span>
      {showRange && (
        <>
          <hr className="mx-2 self-center border-[1px] border-white px-1" />
          <span>
            {monthEnd} {!sameYear && yearEnd}
          </span>
        </>
      )}
      {sameYear && showYear && <span>{year}</span>}
    </CtnWrapper>
  )
}

////////////////////////// DAY

const DayLabel = ({
  day,
  weekDay,
  monthYearTime,
}: {
  day: string | number
  weekDay?: string | null
  monthYearTime?: string | null
}) => {
  return (
    <div className="flex w-fit flex-row flex-nowrap items-start gap-2 px-2 py-1 lg:px-0 lg:py-0 lg:pr-2">
      <div className="content-end text-6xl leading-none">{day}</div>
      <div className="flex h-full flex-col gap-0">
        <div className="pt-[6px]">{weekDay}</div>
        {!!monthYearTime && <div className="mb-1 flex-grow content-end">{monthYearTime}</div>}
      </div>
    </div>
  )
}
export const DateComponentDayPrecision = (props: DateBadgePrecisionProps) => {
  const { startDate, endDate, locale, type, datePrecision, className } = prepareDateBadgeData(props)
  const appLocale = props.locale ?? defaultLocale

  if (!startDate) return null

  const dayPrecision = getDayPrecision({ startDate, endDate, locale, precision: datePrecision })
  const {
    day,
    dayEnd,
    weekDay,
    weekDayEnd,
    month,
    monthEnd,
    year,
    yearEnd,
    sameDay,
    sameMonth,
    sameYear,
  } = dayPrecision

  const showYear = shouldShowYearInMonth(type ?? null, startDate)
  const isListType = type === 'list'
  const showTime = datePrecision === 'time'
  const isSameCalendarDay = sameDay && sameMonth && sameYear
  const isMultiDayWithTime = showTime && !isSameCalendarDay

  const showTimeRangeInSingleBadge =
    showTime &&
    isSameCalendarDay &&
    !!dayPrecision.time &&
    !!dayPrecision.timeEnd &&
    dayPrecision.time !== dayPrecision.timeEnd

  // For multi-day time events: time range goes into the black badge
  const uhrSuffix = appLocale === 'de' ? ' Uhr' : ''
  const timeBadgeLabel =
    isMultiDayWithTime && dayPrecision.time
      ? dayPrecision.timeEnd && dayPrecision.time !== dayPrecision.timeEnd
        ? `${dayPrecision.time} – ${dayPrecision.timeEnd}${uhrSuffix}`
        : `${dayPrecision.time}${uhrSuffix}`
      : null

  // For multi-day time events: month is integrated into the white DayLabel
  const multiDayStartMonthLabel = isMultiDayWithTime
    ? sameYear
      ? dayPrecision.monthShort
      : `${dayPrecision.monthShort} ${dayPrecision.yearShort}`
    : null

  const multiDayEndMonthLabel =
    isMultiDayWithTime && dayPrecision.monthEndShort
      ? sameYear
        ? dayPrecision.monthEndShort
        : `${dayPrecision.monthEndShort} ${dayPrecision.yearEndShort}`
      : null

  const monthYearTimeStartDefault = getMonthYearTimeLabel({
    month: dayPrecision.monthShort,
    year: dayPrecision.yearShort,
    time: dayPrecision.time,
    sameMonth,
    sameYear,
    hasEndDate: !!endDate,
    showTime,
  })

  const monthYearTimeStart = isMultiDayWithTime
    ? multiDayStartMonthLabel
    : showTimeRangeInSingleBadge
      ? `${dayPrecision.time} – ${dayPrecision.timeEnd}`
      : monthYearTimeStartDefault

  const monthYearTimeEnd = isMultiDayWithTime
    ? multiDayEndMonthLabel
    : getMonthYearTimeLabel({
        month: dayPrecision.monthEndShort,
        year: dayPrecision.yearEndShort,
        time: dayPrecision.timeEnd,
        sameMonth,
        sameYear,
        hasEndDate: !!endDate,
        showTime,
      })

  const showEndDateBadge = dayEnd && weekDayEnd && (!sameDay || !sameMonth || !sameYear)
  const showHeaderRange = !!monthEnd && ((sameYear && !sameMonth) || (!sameYear && !!yearEnd))

  return (
    <>
      {!isListType && (
        <CtnWrapper className={className}>
          {timeBadgeLabel ? (
            <span>{timeBadgeLabel}</span>
          ) : (
            <>
              <span>
                {month} {!sameYear && year}
              </span>
              {showHeaderRange && (
                <>
                  <hr className="mx-2 self-center border-[1px] border-white px-1" />
                  <span>
                    {monthEnd} {!sameYear && yearEnd}
                  </span>
                </>
              )}
              {sameYear && showYear && <span>{year}</span>}
            </>
          )}
        </CtnWrapper>
      )}
      {(() => {
        const dayLabelRow = (
          <div className="flex flex-row flex-nowrap items-center gap-2 bg-background font-sans text-foreground">
            <DayLabel day={day} weekDay={weekDay} monthYearTime={monthYearTimeStart} />
            {showEndDateBadge && (
              <>
                <hr
                  className={cn(
                    'mr-1 w-[1.5rem] shrink-0 border-4 border-primary md:mr-2',
                    (type !== 'grid' || sameYear) && 'md:w-[3.5rem]',
                  )}
                />
                <DayLabel day={dayEnd} weekDay={weekDayEnd} monthYearTime={monthYearTimeEnd} />
              </>
            )}
          </div>
        )

        if (isListType && timeBadgeLabel) {
          return (
            <div className="flex flex-col-reverse lg:flex-col">
              {dayLabelRow}
              <CtnWrapper className={className}>{timeBadgeLabel}</CtnWrapper>
            </div>
          )
        }

        return dayLabelRow
      })()}
    </>
  )
}

export const prepareDateBadgeData = (props: DateBadgePrecisionProps) => {
  const {
    startDate,
    endDate,
    locale = defaultLocale,
    datePrecision = 'day',
    type = 'item',
    ...rest
  } = props

  const parsedStartDate = parseUniversalOptionalDate(startDate)
  const parsedEndDate = parseUniversalOptionalDate(endDate)
  const selectedLocale: DateFnsLocale = dateLocaleMap[locale]

  return {
    ...rest,
    datePrecision,
    type,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    locale: selectedLocale,
  }
}
