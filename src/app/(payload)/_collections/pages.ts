import type { CollectionConfig } from 'payload'

import { hero } from '@/components/heros/config'
import { CollectionSlugs } from '@/config/collections'
import { AdminPanelsGroups } from '@/config/collections/groups'
import { Content } from '@/payload/blocks/Content/config'
import { FaqBlock } from '@/payload/blocks/FaqBlock/config'
import { HeroBlock } from '@/payload/blocks/HeroBlock/config'
import { IFrameEmbedBlock } from '@/payload/blocks/IFrameEmbedBlock/config'
import { MediaBlock } from '@/payload/blocks/MediaBlock/config'
import { SocialFeedBlock } from '@/payload/blocks/SocialFeedBlock/config'
import { SpaceBlock } from '@/payload/blocks/SpaceBlock/config'
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
import { GoogleReviewsBlock } from '../_blocks/GoogleReviewsBlock/config'
import { LogoGridBlock } from '../_blocks/LogoGridBlock/config'
import { autoFillMetaHook } from '../_utils/meta-hooks'
import { getCollectionAccessControl } from '../_utils/rbac'

export const Pages: CollectionConfig = {
  ...getCollectionConfig(CollectionSlugs.Pages),
  trash: true,

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
                DownloadBlock,
                FaqBlock,
                GoogleReviewsBlock,
                HeroBlock,
                SocialFeedBlock,
                SpaceBlock,
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
