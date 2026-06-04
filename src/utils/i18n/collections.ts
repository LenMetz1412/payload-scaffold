import {
  CollectionSlugs,
  collectionLabels,
  DEFAULT_APP_ROUTE_COLLECTION,
  localizedCollectionsSlugs,
} from '@/config/collections'
import type { Locale } from '@/config/locales'
import { getUserLocale } from '@/utils/i18n/user-locale'

export interface LocalizedLabels {
  singular: Partial<Record<Locale, string>>
  plural: Partial<Record<Locale, string>>
}

/**
 * Checks if a given string is a valid CollectionSlug.
 *
 * @param {string} value - The value to check.
 * @returns {boolean} True if the value is a valid CollectionSlug, otherwise false.
 */

export const isCollectionSlug = (value: string): value is CollectionSlugs => {
  return Object.values(CollectionSlugs).includes(value as CollectionSlugs)
}

/**
 * Retrieves the localized labels for a collection.
 *
 * @param {Object} params - Parameters for getting the localized labels.
 * @param {CollectionSlugs} params.collection - The collection to retrieve labels for.
 * @param {Locale} [params.locale=userLocale] - The locale to use, defaults to navigator locale or the application's default locale.
 * @returns {LocalizedLabels | undefined} The localized singular and plural labels for the collection.
 */

export const getCollectionLocalizedLabels = ({
  collection,
  locale = getUserLocale(),
}: {
  collection?: CollectionSlugs
  locale?: Locale
}) => {
  if (!collection) return
  const labels = collectionLabels[collection]
  return {
    singular: labels.singular[locale],
    plural: labels.plural[locale]!,
  }
}

/**
 * Retrieves the localized slug for a collection based on the locale.
 *
 * @param {CollectionSlugs} collection - The collection slug to localize.
 * @param {Locale} locale - The locale to use.
 * @returns {string | null} The localized slug for the collection or null if it matches the default app route.
 */

export const getLocalizedCollectionsSlug = (collection: CollectionSlugs, locale: Locale) => {
  if (collection === DEFAULT_APP_ROUTE_COLLECTION) return null
  const localizedCollectionSlugs = localizedCollectionsSlugs[collection]
  if (!localizedCollectionSlugs) return collection
  return localizedCollectionSlugs[locale]
}

/**
 * Retrieves the original collection slug based on the localized slug and locale.
 *
 * @param {string} localizedSlug - The localized slug.
 * @param {Locale} locale - The locale to check against.
 * @returns {CollectionSlugs | undefined} The original collection slug if found, otherwise undefined.
 */

export const getCollectionByLocalizedSlug = (
  localizedSlug: string,
  locale: Locale,
): CollectionSlugs | undefined => {
  for (const collection in localizedCollectionsSlugs) {
    const localizedEntries = localizedCollectionsSlugs[collection as CollectionSlugs]
    if (localizedEntries && localizedEntries[locale] === localizedSlug) {
      return collection as CollectionSlugs
    }
  }

  if (isCollectionSlug(localizedSlug) && localizedSlug !== DEFAULT_APP_ROUTE_COLLECTION) return localizedSlug

  return undefined
}
