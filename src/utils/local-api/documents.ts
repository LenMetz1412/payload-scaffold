import { cache } from 'react'

import type { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import type { BaseDocument } from '@/utils/base-document'

import { getPayloadApi } from './api'

interface QueryDocumentsParams {
  collection: CollectionSlugs
  depth?: number
  limit?: number
  page?: number
  locale?: Locale
  isStatic?: boolean // Skip auth/draft checks for static generation
}

/**
 * Queries multiple documents from the specified collection.
 *
 * @template T - The expected type of the documents being queried.
 * @param {QueryDocumentsParams} params - The parameters for querying the documents.
 * @param {CollectionSlugs} params.collection - The collection to query documents from.
 * @param {number} [params.depth=0] - (Optional) The depth of relationships to include in the response.
 * @param {number} [params.limit=100] - (Optional) The maximum number of documents to return.
 * @param {number} [params.page] - (Optional) The page number for pagination.
 * @param {Locale} [params.locale] - (Optional) The locale to use for fetching localized document data.
 * @returns {Promise<T[]>} - A promise that resolves to an array of the queried document data.
 */

export const queryDocuments = async <T extends BaseDocument>({
  collection,
  locale,
  depth = 0,
  limit = 1000,
  page,
  isStatic,
}: QueryDocumentsParams): Promise<T[]> => {
  const { payloadApi, queryDefaults } = await getPayloadApi({ locale, isStatic })

  const result = await payloadApi.find({
    ...queryDefaults,
    collection,
    limit,
    page,
    depth,
  })

  return result.docs as unknown as T[]
}

/**
 * A cached version of the queryDocuments function.
 *
 * This function uses React's caching mechanism to optimize repeated queries
 * for the same documents.
 *
 * @type {typeof queryDocuments}
 */

export const getCachedDocuments = cache(queryDocuments)
