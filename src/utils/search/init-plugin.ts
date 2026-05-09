import { searchPlugin } from '@payloadcms/plugin-search'

import { COLLECTION_PRIORITIES, SEARCHABLE_COLLECTIONS } from './base'
import { beforeSyncWithSearch } from './beforeSync'
import { searchFieldsOverrides } from './fieldOverrides'

export const initSearchPlugin = () => {
  return searchPlugin({
    collections: [...SEARCHABLE_COLLECTIONS],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
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
