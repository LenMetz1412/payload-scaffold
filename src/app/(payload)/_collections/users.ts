import type { CollectionConfig } from 'payload'

import { CollectionSlugs } from '@/config/collections'
import { AdminPanelsGroups } from '@/config/collections/groups'
import { getCollectionAdminConfig, getCollectionConfig } from '@/payload/utils/collection-config'
import {
  cmsRolesOptions,
  getCollectionFieldAccessControl,
  hasCollectionPermission,
} from '@/payload/utils/rbac'

const { access, ...inlineConfig } = getCollectionConfig(CollectionSlugs.Users)

export const Users: CollectionConfig = {
  ...inlineConfig,

  auth: {
    maxLoginAttempts: 15,
  },

  admin: getCollectionAdminConfig(CollectionSlugs.Users, {
    group: AdminPanelsGroups.Admin,
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  }),

  access: {
    ...access,
    // overwrite, user can update only itself unless superAdmin
    update: ({ req: { user }, id }) => {
      if (!user || !user.role) return false
      return !!(
        hasCollectionPermission(CollectionSlugs.Users, 'update', user?.role) || user.id === id
      )
    },
  },

  fields: [
    {
      name: 'role',
      type: 'select',
      hasMany: false,
      required: true,
      admin: {
        isClearable: false,
      },
      options: cmsRolesOptions,
      access: getCollectionFieldAccessControl(CollectionSlugs.Users, 'role'),
    },
  ],
  timestamps: true,
}
