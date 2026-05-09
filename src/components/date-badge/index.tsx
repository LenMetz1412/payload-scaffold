'use client'

import type { Locale as AppLocale } from '@/config/locales'
import type { DatePrecision } from '@/utils/date'

import {
  DateComponentDayPrecision,
  DateComponentMonthPrecision,
  DateComponentTrimesterPrecision,
  DateComponentYearPrecision,
  type DatePrecisionViewType,
} from './precision'

export interface DateBadgeProps {
  startDate?: string | null
  endDate?: string | null
  datePrecision?: DatePrecision
  locale?: AppLocale
  type?: DatePrecisionViewType
  className?: string
}

export const DateBadge = (props: DateBadgeProps) => {
  const { datePrecision = 'day' } = props

  if (datePrecision === 'year') {
    return <DateComponentYearPrecision {...props} />
  }

  if (datePrecision === 'trimester') {
    return <DateComponentTrimesterPrecision {...props} />
  }

  if (datePrecision === 'month') {
    return <DateComponentMonthPrecision {...props} />
  }

  return <DateComponentDayPrecision {...props} />
}
