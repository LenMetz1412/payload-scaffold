import type { CollectionConfig } from 'payload'

import { hero } from '@/components/heros/config'
import { CollectionSlugs } from '@/config/collections'
import { AdminPanelsGroups } from '@/config/collections/groups'
import { Content } from '@/payload/blocks/Content/config'
import { CreditBlock } from '@/payload/blocks/Credit/config'
import { FaqBlock } from '@/payload/blocks/FaqBlock/config'
import { GapBlock } from '@/payload/blocks/GapBlock/config'
import { HeroBlock } from '@/payload/blocks/HeroBlock/config'
import { IFrameEmbedBlock } from '@/payload/blocks/IFrameEmbedBlock/config'
import { MediaBlock } from '@/payload/blocks/MediaBlock/config'
import { getBaseDocumentFields } from '@/payload/fields/base-document'
import { MetaFieldset } from '@/payload/fields/meta'
import {
  defaultReadAccess,
  getCollectionAdminConfig,
  getCollectionConfig,
  livePreviewVersions,
} from '@/payload/utils/collection-config'
import { createRevalidateDocHook } from '@/payload/utils/revalidate'

import { DownloadBlock } from '../_blocks/DownloadBlock/config'
import { LogoGridBlock } from '../_blocks/LogoGridBlock/config'
import { autoFillMetaHook } from '../_utils/meta-hooks'
import { getCollectionAccessControl } from '../_utils/rbac'

export const Pages: CollectionConfig = {
  ...getCollectionConfig(CollectionSlugs.Pages),

  access: {
    ...getCollectionAccessControl(CollectionSlugs.Pages),
    read: defaultReadAccess,
  },

  versions: livePreviewVersions,

  admin: getCollectionAdminConfig(CollectionSlugs.Pages, {
    preview: true,
    livePreview: true,
    group: AdminPanelsGroups.Main,
    defaultColumns: ['title', 'status', 'updatedAt'],
  }),

  hooks: {
    beforeChange: [autoFillMetaHook],
    afterChange: [createRevalidateDocHook(CollectionSlugs.Pages)],
  },

  fields: [
    ...getBaseDocumentFields(CollectionSlugs.Pages),
    {
      name: 'excludeFromSearch',
      type: 'checkbox',
      label: {
        de: 'Von Suche ausschließen',
        en: 'Exclude from search',
      },
      defaultValue: false,
      admin: {
        description: {
          de: 'Diese Seite erscheint nicht in den Suchergebnissen',
          en: 'This page will not appear in search results',
        },
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          label: {
            en: 'Contents',
            de: 'Inhalte',
          },
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                Content,
                CreditBlock,
                DownloadBlock,
                FaqBlock,
                GapBlock,
                HeroBlock,
                IFrameEmbedBlock,
                LogoGridBlock,
                MediaBlock,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: {
            en: 'SEO',
            de: 'SEO',
          },
          fields: [MetaFieldset],
        },
      ],
    },
  ],
  timestamps: true,
}
