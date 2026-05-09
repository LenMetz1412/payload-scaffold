// !! read !! implies visibility in adminUI, if not added the field will be hidden

import type { CollectionFieldPermissions } from '@/payload/utils/rbac'

export const permissionsByField: CollectionFieldPermissions = {
  users: {
    role: {
      superAdmin: ['read', 'create', 'update'],
      admin: ['read', 'create', 'update'],
      editor: ['read'],
      api: ['read'],
    },
  },
}
