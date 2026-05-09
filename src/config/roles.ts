export type CmsRoles = 'superAdmin' | 'admin' | 'editor' | 'api'

export const cmsRolesLabels: Record<CmsRoles, string> = {
  superAdmin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  api: 'Api',
}
