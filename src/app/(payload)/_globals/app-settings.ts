import type { GlobalConfig } from 'payload'

import { GlobalCollectionSlugs } from '@/config/collections/globals'
import { AdminPanelsGroups } from '@/config/collections/groups'
import { draftVersions } from '@/payload/utils/collection-config'
import {
  getGlobalCollectionAdminConfig,
  getGlobalCollectionConfig,
} from '@/payload/utils/global-config'

import { MetaFieldset } from '../_fields/meta'

export const AppSettings: GlobalConfig = {
  ...getGlobalCollectionConfig(GlobalCollectionSlugs.AppSettings),

  versions: draftVersions,
  admin: getGlobalCollectionAdminConfig(GlobalCollectionSlugs.AppSettings, AdminPanelsGroups.Admin),
  lockDocuments: { duration: 600 },
  fields: [MetaFieldset],
}
