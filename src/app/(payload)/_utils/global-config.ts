import type { GlobalAdminOptions } from 'payload'

import type { GlobalCollectionSlugs } from '@/config/collections/globals'
import { globalCollectionLabels } from '@/config/collections/globals'
import type { AdminPanelsGroups } from '@/config/collections/groups'

import { getAdminPanelGroup } from './collection-config'
import { getCollectionAccessControl, getCollectionAdminUiVisibility } from './rbac'

/**
 * Retrieves the configuration for a collection based on its slug.
 * @param {CollectionSlugs} slug - The slug of the collection.
 * @returns An object containing the collection slug, labels, and access control.
 */
export const getGlobalCollectionConfig = (slug: GlobalCollectionSlugs) => {
  return {
    slug,
    label: globalCollectionLabels[slug],
    access: getCollectionAccessControl(slug),
  }
}

/**
 * Generates the admin configuration for a global collection.
 *
 * @param {GlobalCollectionSlugs} collection - The slug of the global collection for which the admin configuration is being generated.
 * @param {AdminPanelsGroups} [group] - An optional group for organizing the admin panel UI.
 *
 * @returns {Partial<GlobalAdminOptions>} The generated partial configuration object for the global collection admin options.
 *
 * @example
 * const adminConfig = getGlobalCollectionAdminConfig('articles', AdminPanelsGroups.Main);
 * // adminConfig will include the group and visibility settings for the 'articles' collection.
 */

export const getGlobalCollectionAdminConfig = (
  collection: GlobalCollectionSlugs,
  group?: AdminPanelsGroups,
): Partial<GlobalAdminOptions> => {
  return {
    ...(group && { group: getAdminPanelGroup(group) }),
    hidden: ({ user }) => !getCollectionAdminUiVisibility(collection, user),
  }
}
