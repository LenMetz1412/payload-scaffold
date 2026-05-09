import type { CollectionSlugs } from '@/config/collections'
import { collectionLabels } from '@/config/collections'
import type { Locale } from '@/config/locales'
import { defaultLocale } from '@/config/locales'
import type { BaseDocument } from '@/utils/base-document'
import { getDocSlugOrId } from '@/utils/docHelpers'

import { getLocalizedCollectionsSlug } from './collections'

export interface LocalizedPathParams {
  collection?: CollectionSlugs
  doc?: BaseDocument | null
  locale?: Locale
}

/**
 * Generates a localized path for a given collection and document.
 *
 * @param {LocalizedPathParams} params - The parameters for generating the path.
 * @param {CollectionSlugs} params.collection - The slug of the collection.
 * @param {BaseDocument} [params.doc] - An optional document; if provided, its slug or id will be used in the path.
 * @param {Locale} [params.locale=defaultLocale] - The locale to use for the path; defaults to the application's default locale.
 *
 * @returns {{ label: string; path: string }} An object containing:
 *   - {string} label - A user-friendly label for the document or collection.
 *   - {string} path - The generated localized path.
 *
 * @example
 * const pathInfo = getLocalizedPath({
 *   collection: 'articles',
 *   doc: { id: '123', title: 'My Article', slug: 'my-article' },
 *   locale: 'en',
 * });
 * // pathInfo will be: { label: 'My Article', path: '/en/articles/my-article' }
 */

export const getLocalizedPath = ({
  collection,
  doc,
  locale = defaultLocale,
}: LocalizedPathParams): { label: string; path: string } => {
  const pathSegments = [
    locale,
    collection ? getLocalizedCollectionsSlug(collection, locale) : null,
    getDocSlugOrId(doc),
  ].filter(Boolean)

  const label =
    [doc?.title?.trim(), doc?.id].filter((a) => !!a).shift() ??
    (collection ? collectionLabels[collection].plural[locale] : null) ??
    collection ??
    'No title'

  const path = `/${pathSegments.join('/')}`

  return { label, path }
}
