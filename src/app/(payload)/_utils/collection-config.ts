import { env } from '@env'
import type { Access, CollectionAdminOptions } from 'payload'

import type { CollectionSlugs } from '@/config/collections'
import { collectionLabels } from '@/config/collections'
import type { AdminPanelsGroups } from '@/config/collections/groups'
import { adminPanelsGroups } from '@/config/collections/groups'
import type { Locale } from '@/config/locales'
import { defaultLocale, locales } from '@/config/locales'

import { getCollectionAccessControl, getCollectionAdminUiVisibility } from './rbac'

/**
 * Retrieves the configuration for a collection based on its slug.
 * @param {CollectionSlugs} slug - The slug of the collection.
 * @returns An object containing the collection slug, labels, and access control.
 */
export const getCollectionConfig = (slug: CollectionSlugs) => {
  return {
    slug,
    labels: collectionLabels[slug],
    access: getCollectionAccessControl(slug),
  }
}

interface GetCollectionAdminConfigOpt {
  livePreview?: boolean
  preview?: boolean
  group?: AdminPanelsGroups
  useAsTitle?: CollectionAdminOptions['useAsTitle']
  defaultColumns?: CollectionAdminOptions['defaultColumns']
  pagination?: CollectionAdminOptions['pagination']
}

/**
 * Generates the admin configuration for a given collection in the Payload CMS admin panel.
 *
 * @param {CollectionSlugs} collection - The slug of the collection for which to generate the admin config.
 * @param {GetCollectionAdminConfigOpt} [configOpts] - Optional settings for configuring the collection's admin panel.
 * @param {boolean} [configOpts.livePreview] - Enables live preview of the collection's content if `true`.
 * @param {boolean} [configOpts.preview] - Enables the preview functionality for the collection if `true`.
 * @param {string} [configOpts.group] - Assigns the collection to an admin group in the panel.
 * @param {string} [configOpts.useAsTitle="title"] - The field used as the title for collection items in the admin list view.
 * @param {string[]} [configOpts.defaultColumns=["title"]] - The default columns displayed in the collection's admin list view.
 * @param {Object} [configOpts.pagination] - Pagination settings for the collection in the admin panel.
 * @param {number} [configOpts.pagination.defaultLimit=50] - The default number of items per page in the admin panel.
 *
 * @returns {Partial<CollectionAdminOptions>} Partial configuration options for the collection's admin panel.
 *
 **/

export const getCollectionAdminConfig = (
  collection: CollectionSlugs,
  configOpts?: GetCollectionAdminConfigOpt,
): Partial<CollectionAdminOptions> => {
  const {
    livePreview,
    preview,
    group,
    useAsTitle = 'title',
    defaultColumns = ['title'],
    pagination = { defaultLimit: 50 },
  } = configOpts ?? {}

  return {
    useAsTitle,
    defaultColumns,
    pagination,

    ...(group && { group: getAdminPanelGroup(group) }),

    hidden: ({ user }) => !getCollectionAdminUiVisibility(collection, user),

    ...(livePreview && {
      livePreview: {
        url: ({ data, locale }) => {
          // livePreview is not reliable with localized slug and locale param
          const path = generatePreviewPath({
            id: `${typeof data.id === 'string' ? data.id : ''}`,
            locale: locale as unknown as Locale,
            collection,
          })
          return [env.NEXT_PUBLIC_SERVER_URL, path].join('/')
        },
      },
    }),

    ...(preview && {
      preview: (doc, { locale }) =>
        generatePreviewPath({
          id: `${typeof doc.id === 'string' ? doc.id : ''}`,
          locale: locale as unknown as Locale,
          collection,
        }),
    }),
  }
}

/**
 * Generates a preview path for a document.
 * @param {object} params - The parameters for generating the preview path.
 * @param {string} params.id - The id of the document.
 * @param {Locale} params.locale - The locale of the document.
 * @param {CollectionSlugs} params.collection - The collection of the document.
 * @returns A string representing the preview path.
 */
type PayloadLocale = Locale | string | { code?: string | null } | null | undefined

const normalizeLocale = (locale: PayloadLocale): Locale => {
  if (typeof locale === 'string') {
    return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale
  }

  if (locale && typeof locale === 'object') {
    const localeCode = typeof locale.code === 'string' ? locale.code : null
    if (localeCode && locales.includes(localeCode as Locale)) {
      return localeCode as Locale
    }
  }

  return defaultLocale
}

export const generatePreviewPath = ({
  locale,
  collection,
  id,
}: {
  id: string
  locale: PayloadLocale
  collection: CollectionSlugs
}) => {
  const resolvedLocale = normalizeLocale(locale)
  const path = `/${resolvedLocale}/${collection}/${id}`
  return `/next/preview?path=${encodeURIComponent(path)}`
}

/**
 * Retrieves the admin panel group configuration based on the group name.
 * @param {AdminPanelsGroups} group - The name of the admin panel group.
 * @returns The configuration for the specified admin panel group.
 */
export const getAdminPanelGroup = (group: AdminPanelsGroups) => {
  return adminPanelsGroups[group]
}

/**
 * Configuration for live preview versions.
 * @returns An object with settings for draft autosave and maximum versions per document.
 */
export const livePreviewVersions = (() => ({
  drafts: {
    autosave: true,
  },
  maxPerDoc: 50,
}))()

/**
 * Configuration for manual draft versions.
 * @returns An object with settings for draft and maximum versions per document.
 */
export const draftVersions = (() => ({
  drafts: true,
  maxPerDoc: 50,
}))()

/**
 *  - Allows full doc access if a user is authenticated (optionally extendable for roles/collections).
 *  - If no user is present, only returns documents that are either:
 *    - Published (`_status: 'published'`)
 *    - Or have no `_status` field at all.
 * @returns An object with settings for default read access.
 */
export const defaultReadAccess: Access = ({ req }) => {
  // if (req.user && req.user?.role === 'admin') return true
  if (req.user) return true
  return {
    or: [
      {
        _status: {
          equals: 'published',
        },
      },
    ],
  }
}
