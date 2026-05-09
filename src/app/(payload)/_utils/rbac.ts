import type { ClientUser, CollectionConfig, FieldBase } from 'payload'

import type { CollectionSlugs } from '@/config/collections'
import type { GlobalCollectionSlugs } from '@/config/collections/globals'
import { permissionsByCollection } from '@/config/permissions/collections'
import { permissionsByField } from '@/config/permissions/fields'
import type { CmsRoles } from '@/config/roles'
import { cmsRolesLabels } from '@/config/roles'
import type { User } from '@/payload-types'

export type PermissionActions = 'create' | 'read' | 'update' | 'delete'

export type PermissionCollections = CollectionSlugs | GlobalCollectionSlugs

export type PermissionSchema = Record<CmsRoles, PermissionActions[]>
export type CollectionsPermissions = Record<PermissionCollections, PermissionSchema>
export type CollectionFieldPermissions = Partial<
  Record<PermissionCollections, Record<string, PermissionSchema>>
>

export interface PemissionsListRes {
  collections: CollectionsPermissions
  fields: CollectionFieldPermissions
}

export const hasCollectionPermission = (
  collection: PermissionCollections,
  action: 'create' | 'update' | 'delete',
  role?: CmsRoles | null,
) => {
  if (!role) return false

  const rolePermissions = permissionsByCollection[collection][role]
  return rolePermissions.includes(action)
}

export const getCollectionAccessControl = (
  collection: PermissionCollections,
): CollectionConfig['access'] => ({
  create: ({ req: { user } }) => hasCollectionPermission(collection, 'create', user?.role),
  read: () => true, // we need it true because otherwise it will be omit from api res
  update: ({ req: { user } }) => hasCollectionPermission(collection, 'update', user?.role),
  delete: ({ req: { user } }) => hasCollectionPermission(collection, 'delete', user?.role),
})

type AdminLikeUser = ClientUser | User | { role?: CmsRoles | null } | null | undefined

export const getCollectionAdminUiVisibility = (
  collection: PermissionCollections,
  user?: AdminLikeUser,
): boolean => {
  return hasCollectionPermission(collection, 'update', user?.role as CmsRoles | null | undefined)
}

export const hasCollectionFieldPermission = (
  collection: PermissionCollections,
  field: string,
  role: CmsRoles,
  action: 'create' | 'update' | 'read',
) => {
  if (!permissionsByField[collection]?.[field]?.[role]) return false
  return permissionsByField[collection][field][role].includes(action)
}

export const getCollectionFieldAccessControl = (
  collection: PermissionCollections,
  field: string,
): FieldBase['access'] => ({
  create: ({ req: { user } }) => {
    if (!user?.role) return false
    return hasCollectionFieldPermission(collection, field, user.role, 'create')
  },
  read: ({ req: { user } }) => {
    if (!user?.role) return true // we need it true because otherwise it will be omit from api res
    // if there is a role then check if it has the rights to display the field or not
    return hasCollectionFieldPermission(collection, field, user.role, 'read')
  },
  update: ({ req: { user } }) => {
    if (!user?.role) return false
    return hasCollectionFieldPermission(collection, field, user.role, 'update')
  },
})

export const cmsRolesOptions = (() =>
  Object.keys(cmsRolesLabels).map((key) => ({
    label: cmsRolesLabels[key as CmsRoles],
    value: key,
  })))()
