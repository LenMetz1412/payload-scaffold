import type { GlobalConfig } from 'payload'

import { link } from '@/app/(payload)/_fields/link'
import { GlobalCollectionSlugs } from '@/config/collections/globals'
import { AdminPanelsGroups } from '@/config/collections/groups'
import {
  getGlobalCollectionAdminConfig,
  getGlobalCollectionConfig,
} from '@/payload/utils/global-config'

import { revalidateFooter } from './revalidate'

export const Footer: GlobalConfig = {
  ...getGlobalCollectionConfig(GlobalCollectionSlugs.Footer),
  admin: getGlobalCollectionAdminConfig(GlobalCollectionSlugs.AppSettings, AdminPanelsGroups.Admin),
  fields: [
    {
      name: 'claimText',
      type: 'textarea',
      localized: true,
      label: {
        en: 'Claim Text',
        de: 'Claim-Text',
      },
      required: false,
    },
    {
      name: 'sections',
      type: 'array',
      label: {
        en: 'Sections',
        de: 'Abschnitte',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
          label: {
            en: 'Title',
            de: 'Titel',
          },
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            link({
              overrides: {
                minRows: 1,
              },
            }),
          ],
        },
      ],
      minRows: 1,
    },
    {
      name: 'backgroundFooterImage',
      type: 'upload',
      label: 'Media',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
