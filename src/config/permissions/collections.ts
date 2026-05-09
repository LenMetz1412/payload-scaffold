import type { CollectionsPermissions } from '@/payload/utils/rbac'

import { CollectionSlugs } from '../collections'
import { GlobalCollectionSlugs } from '../collections/globals'

export const permissionsByCollection: CollectionsPermissions = {
  [GlobalCollectionSlugs.AppSettings]: {
    superAdmin: ['create', 'update', 'delete'],
    admin: ['create', 'update', 'delete'],
    editor: ['create', 'update'],
    api: [],
  },

  [GlobalCollectionSlugs.Footer]: {
    superAdmin: ['create', 'update', 'delete'],
    admin: ['create', 'update', 'delete'],
    editor: ['create', 'update', 'delete'],
    api: [],
  },

  [CollectionSlugs.Downloads]: {
    superAdmin: ['create', 'update', 'delete'],
    admin: ['create', 'update', 'delete'],
    editor: ['create', 'update', 'delete'],
    api: [],
  },

  [CollectionSlugs.Media]: {
    superAdmin: ['create', 'update', 'delete'],
    admin: ['create', 'update', 'delete'],
    editor: ['create', 'update', 'delete'],
    api: [],
  },

  [CollectionSlugs.Pages]: {
    superAdmin: ['create', 'update', 'delete'],
    admin: ['create', 'update', 'delete'],
    editor: ['create', 'update', 'delete'],
    api: [],
  },

  [CollectionSlugs.Users]: {
    superAdmin: ['create', 'update', 'delete'],
    admin: ['create', 'update', 'delete'],
    editor: [],
    api: [],
  },
}
