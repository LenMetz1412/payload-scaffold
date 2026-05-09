import { cache } from 'react'

import type { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import type { BaseDocument } from '@/utils/base-document'

import { getPayloadApi } from './api'

interface QueryDocumentParams {
  collection: CollectionSlugs
  slug: string
  depth?: number
  locale?: Locale
  bustCache?: boolean
}

/**
 * Queries a document from the specified collection using its slug or ID.
 *
 * @template T - The expected type of the document being queried.
 * @param {QueryDocumentParams} params - The parameters for querying the document.
 * @param {CollectionSlugs} params.collection - The collection to query the document from.
 * @param {string} params.slug - The slug or ID of the document to fetch.
 * @param {number} [params.depth=0] - (Optional) The depth of relationships to include in the response.
 * @param {Locale} [params.locale] - (Optional) The locale to use for fetching localized document data.
 * @param {boolean} [params.bustCache] - (Optional) Whether to bypass cache and fetch fresh data.
 * @returns {Promise<T | null>} - A promise that resolves to the queried document data, or null if not found.
 */

export const queryDocument = async <T extends BaseDocument>({
  collection,
  slug,
  locale,
  depth = 0,
  isStatic,
  // bustCache,
}: QueryDocumentParams & { isStatic?: boolean }): Promise<T | null> => {
  const { payloadApi, queryDefaults } = await getPayloadApi({ locale, isStatic })

  const result = await payloadApi.find({
    ...queryDefaults,
    collection,
    limit: 1,
    where: {
      OR: [
        { slug: { equals: slug } },
        { id: { equals: slug } },
        // ID fallback,
        // not all collections might have slug
        // livePreview is not reliable with localized slug and locale param
      ],
    },
    depth,
  })

  return (result.docs[0] ?? null) as unknown as T | null
}

/**
 * A cached version of the queryDocument function.
 *
 * This function uses React's caching mechanism to optimize repeated queries
 * for the same document. When bustCache is true, it bypasses the cache.
 *
 * @type {typeof queryDocument}
 */

const cachedQueryDocument = cache(queryDocument)

export const getCachedDocument = async <T extends BaseDocument>(
  params: QueryDocumentParams,
  isStatic?: boolean,
): Promise<T | null> => {
  // If bustCache is true, bypass the cache and fetch fresh data
  if (params.bustCache) {
    return queryDocument<T>({ ...params, isStatic })
  }
  // Otherwise use the cached version
  return cachedQueryDocument<T>({ ...params, isStatic })
}
