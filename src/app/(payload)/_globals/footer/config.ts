import { link } from '@/app/(payload)/_fields/link'
import { GlobalCollectionSlugs } from '@/config/collections/globals'
import { AdminPanelsGroups } from '@/config/collections/groups'
import {
  getGlobalCollectionAdminConfig,
  getGlobalCollectionConfig,
} from '@/payload/utils/global-config'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'
import { revalidateFooter } from './revalidate'

export const Footer: GlobalConfig = {
  ...getGlobalCollectionConfig(GlobalCollectionSlugs.Footer),
  admin: getGlobalCollectionAdminConfig(GlobalCollectionSlugs.AppSettings, AdminPanelsGroups.Admin),
  fields: [
    {
      name: 'footerText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            BlocksFeature({
              blocks: [],
            }),
          ]
        },
      }),
      localized: true,
      label: {
        en: 'Footer Text',
        de: 'Footer-Text',
      },
      required: false,
    },
    {
      name: 'topics',
      type: 'array',
      label: {
        en: 'Topics',
        de: 'Themen',
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
