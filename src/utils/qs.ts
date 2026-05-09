import qs from 'qs'

import type { Locale } from '@/config/locales'
import { defaultLocale, locales } from '@/config/locales'

export interface BaseRoutingParams {
  locale?: string | string[] | undefined
  collectionOrDocSlug?: string | string[] | undefined
  slug?: string | string[] | undefined
}

/**
 * Parses query parameters from a URL.
 *
 * @param url - The URL string to parse.
 * @returns An object containing the parsed parameters.
 */
export const parseQueryParams = <T>(url: string): T => {
  const queryString = new URL(url).search
  return qs.parse(queryString, { ignoreQueryPrefix: true }) as T
}

/**
 * Validates the locale parameter.
 *
 * @param locale - The locale to validate.
 * @returns The validated locale or null if invalid.
 */

export const isValidLocale = (locale: unknown): locale is Locale => {
  return typeof locale === 'string' && locales.includes(locale as Locale)
}

export const validateLocale = (locale: unknown): Locale | null => {
  return isValidLocale(locale) ? locale : null
}

export const validateLocaleWithFallback = (locale: unknown): Locale => {
  return validateLocale(locale) ?? defaultLocale
}

export const normalizeLocalizedPageParams = <T>(
  params: T & { locale: string | string[] | undefined },
): Omit<T, 'locale'> & { locale: Locale } => {
  const locale = validateLocaleWithFallback(params.locale)

  return {
    ...params,
    locale,
  }
}

/**
 * Validates a string parameter.
 *
 * @param param - The parameter to validate.
 * @returns The validated string or null if invalid.
 */
export const validateStringParam = (param: string | string[] | undefined): string | null => {
  if (typeof param === 'string') return param
  return null
}

export const searchParamsToObject = (
  searchParams: URLSearchParams,
): Record<string, string | string[]> => {
  return qs.parse(searchParams.toString(), {
    arrayLimit: 50,
    parseArrays: true,
  }) as Record<string, string | string[]>
}
