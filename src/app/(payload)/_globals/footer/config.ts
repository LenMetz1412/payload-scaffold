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
      name: 'socials',
      type: 'group',
      label: {
        en: 'Social Media',
        de: 'Social Media',
      },
      fields: [
        {
          name: 'instagram',
          type: 'group',
          label: 'Instagram',
          fields: [
            { name: 'enabled', type: 'checkbox', label: { en: 'Show Instagram', de: 'Instagram anzeigen' }, defaultValue: false },
            { name: 'url', type: 'text', label: 'URL', admin: { condition: (_, s) => Boolean(s?.enabled) } },
          ],
        },
        {
          name: 'linkedin',
          type: 'group',
          label: 'LinkedIn',
          fields: [
            { name: 'enabled', type: 'checkbox', label: { en: 'Show LinkedIn', de: 'LinkedIn anzeigen' }, defaultValue: false },
            { name: 'url', type: 'text', label: 'URL', admin: { condition: (_, s) => Boolean(s?.enabled) } },
          ],
        },
        {
          name: 'facebook',
          type: 'group',
          label: 'Facebook',
          fields: [
            { name: 'enabled', type: 'checkbox', label: { en: 'Show Facebook', de: 'Facebook anzeigen' }, defaultValue: false },
            { name: 'url', type: 'text', label: 'URL', admin: { condition: (_, s) => Boolean(s?.enabled) } },
          ],
        },
        {
          name: 'tiktok',
          type: 'group',
          label: 'TikTok',
          fields: [
            { name: 'enabled', type: 'checkbox', label: { en: 'Show TikTok', de: 'TikTok anzeigen' }, defaultValue: false },
            { name: 'url', type: 'text', label: 'URL', admin: { condition: (_, s) => Boolean(s?.enabled) } },
          ],
        },
      ],
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
