import { cache } from 'react'

import type { Locale } from '@/config/locales'
import type { Config } from '@/payload-types'

import { getPayloadApi } from './api'

type Global = keyof Config['globals']

interface GetGlobalParams {
  slug: Global
  depth?: number
  locale?: Locale
  isStatic?: boolean // Skip auth/draft checks for static generation
}

/**
 * Queries the global collection for a specific global document.
 *
 * @param {GetGlobalParams} params - The parameters for the query.
 * @param {Global} params.slug - The slug of the global document to fetch.
 * @param {number} [params.depth=0] - (Optional) The depth of relationships to include in the response.
 * @param {Locale} [params.locale] - (Optional) The locale to use for fetching localized global data.
 * @returns {Promise<unknown>} - A promise that resolves to the global document data.
 */

export const queryGlobalCollection = async ({
  slug,
  locale,
  depth = 0,
  isStatic,
}: GetGlobalParams) => {
  const { payloadApi, queryDefaults } = await getPayloadApi({ locale, isStatic })

  return await payloadApi.findGlobal({
    ...queryDefaults,
    slug,
    depth,
  })
}

/**
 * A cached version of the queryGlobalCollection function.
 *
 * This function uses React's caching mechanism to optimize repeated queries
 * for the same global document.
 *
 * @type {typeof queryGlobalCollection}
 */

export const getCachedGlobalCollection = cache(queryGlobalCollection)
