import { CollectionSlugs } from '@/config/collections'
import { adminPanelsGroups, AdminPanelsGroups } from '@/config/collections/groups'
import { searchPlugin } from '@payloadcms/plugin-search'
import { COLLECTION_PRIORITIES } from './base'
import { beforeSyncWithSearch } from './beforeSync'
import { searchFieldsOverrides } from './fieldOverrides'

export const initSearchPlugin = () => {
  return searchPlugin({
    collections: [CollectionSlugs.Pages],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        group: adminPanelsGroups[AdminPanelsGroups.Admin],
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFieldsOverrides]
      },
    },
    defaultPriorities: COLLECTION_PRIORITIES,
    localize: true,
    syncDrafts: true,
    deleteDrafts: false,
  })
}
