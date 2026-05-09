import { DEFAULT_APP_ROUTE_COLLECTION } from '@/config/collections'
import type { Locale } from '@/config/locales'
import { getCollectionByLocalizedSlug } from '@/utils/i18n/collections'
import { getCachedDocument } from '@/utils/local-api/document'

export type AppPageParams = { [key: string]: string | string[] | undefined }

/**
 * This utility function retrieves a collection based on a localized slug.
 * If no collection matches the given slug,
 * it defaults to retrieving a document from a predefined collection (DEFAULT_APP_ROUTE_COLLECTION).
 * The function returns either the collection or the default collection along with the document.
 *
 * @param {Object} params - The parameters for fetching the collection or document.
 * @param {Locale} params.locale - The locale to retrieve the collection or document for.
 * @param {string} params.collectionOrDocSlug - The slug of the collection or document.
 * @returns {Promise<Object>} An object containing the collection and, optionally, the document.
 * @returns {string} return.collection - The slug of the matching collection or the default collection.
 * @returns {Object} [return.doc] - The document retrieved from the default collection, if no collection was found.
 *
 * @example
 * const { collection, doc } = await getCollectionOrDefaultCollectionDoc({
 *   locale: 'en',
 *   collectionOrDocSlug: 'my-collection',
 * });
 *
 * if (doc) {
 *   console.log('Fetched document from default collection:', doc);
 * } else {
 *   console.log('Fetched collection:', collection);
 * }
 *
 */

export const getCollectionOrDefaultCollectionDoc = async (
  {
    locale,
    collectionOrDocSlug,
  }: {
    locale: Locale
    collectionOrDocSlug: string
  },
  isStatic?: boolean,
) => {
  const collection = getCollectionByLocalizedSlug(collectionOrDocSlug, locale)
  const slug = collectionOrDocSlug ? collectionOrDocSlug : 'home'
  if (collection) return { collection }

  const doc = await getCachedDocument(
    {
      collection: DEFAULT_APP_ROUTE_COLLECTION,
      locale,
      slug: slug,
      depth: 2,
    },
    isStatic,
  )

  return { collection: DEFAULT_APP_ROUTE_COLLECTION, doc }
}
