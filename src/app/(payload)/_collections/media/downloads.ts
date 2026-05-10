import type { CollectionConfig } from 'payload'

import { CollectionSlugs } from '@/config/collections'
import { AdminPanelsGroups } from '@/config/collections/groups'
import { getCollectionAdminConfig, getCollectionConfig } from '@/payload/utils/collection-config'

// import { generateWebpFromPDF } from '@/utils/generatePDFThumb'

export const Downloads: CollectionConfig = {
  ...getCollectionConfig(CollectionSlugs.Downloads),
  trash: true,

  admin: getCollectionAdminConfig(CollectionSlugs.Downloads, {
    group: AdminPanelsGroups.Media,
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'updatedAt', 'createdAt'],
  }),

  upload: {
    staticDir: 'system/downloads',
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'previewImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Preview Thumbnail',
    },
  ],
}

export default Downloads
