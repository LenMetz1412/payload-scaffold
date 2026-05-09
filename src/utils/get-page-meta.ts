import type { DataFromGlobalSlug } from 'payload'

import type { CollectionSlugs } from '@/config/collections'
import { GlobalCollectionSlugs } from '@/config/collections/globals'
import type { Locale } from '@/config/locales'
import type { MetaFieldset } from '@/payload-types'
import type { BaseDocument } from '@/utils/base-document'

import { getCachedGlobalCollection } from './local-api/global'
import { generateMeta } from './seo'

/**
 * Retrieves the global meta information for the app settings collection.
 *
 * @param {Locale} [locale] - The locale to fetch the global collection for.
 * @param {number} [depth] - The depth of the query, used for nested document resolution.
 * @returns {Promise<MetaFieldset | undefined>} A promise resolving to the meta information or `undefined` if not found.
 */

export const getAppGlobalMeta = async ({
  locale,
  depth,
  isStatic,
}: {
  locale?: Locale
  depth?: number
  isStatic?: boolean
}): Promise<MetaFieldset | undefined> => {
  const { meta } = (await getCachedGlobalCollection({
    slug: GlobalCollectionSlugs.AppSettings,
    locale,
    depth,
    isStatic,
  })) as DataFromGlobalSlug<GlobalCollectionSlugs.AppSettings>

  return meta
}

/**
 * Generates the meta information for a specific page, combining document and global meta information.
 *
 * @param {Object} params - Parameters for generating the page meta.
 * @param {BaseDocument | null} [params.doc] - The document for which to generate the meta information.
 * @param {Locale} params.locale - The locale of the document or page.
 * @param {CollectionSlugs} [params.collection] - The collection slug for the document.
 * @returns {Promise<MetaFieldset>} A promise resolving to the combined meta information.
 */

export const getPageMeta = async ({
  doc,
  locale,
  collection,
  isStatic,
}: {
  doc?: BaseDocument | null
  locale: Locale
  collection?: CollectionSlugs
  isStatic?: boolean
}) => {
  const globalMeta = await getAppGlobalMeta({ locale, depth: 2, isStatic })
  return await generateMeta({ globalMeta, doc, collection, locale })
}
