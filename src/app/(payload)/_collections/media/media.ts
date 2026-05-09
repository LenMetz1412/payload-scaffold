import type { CollectionConfig } from 'payload'

import { CollectionSlugs } from '@/config/collections'
import { AdminPanelsGroups } from '@/config/collections/groups'
import { MediaSizes } from '@/config/collections/media'
import { getCollectionAdminConfig, getCollectionConfig } from '@/payload/utils/collection-config'
import { getUploaderBaseConfig } from '@/payload/utils/uploader-config'

export const Media: CollectionConfig = {
  ...getCollectionConfig(CollectionSlugs.Media),

  admin: getCollectionAdminConfig(CollectionSlugs.Media, {
    group: AdminPanelsGroups.Media,
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'updatedAt', 'createdAt'],
  }),

  upload: getUploaderBaseConfig({
    collectionSlug: CollectionSlugs.Media,
    imageSizes: [
      {
        name: MediaSizes.md,
        width: 960,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 100,
          },
        },
        withoutEnlargement: true,
      },
      {
        name: MediaSizes.lg,
        width: 1920,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 100,
          },
        },
        withoutEnlargement: true,
      },
      {
        name: MediaSizes.xl,
        width: 4096,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 100,
          },
        },
        withoutEnlargement: true,
      },
      {
        name: MediaSizes.og,
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 100,
          },
        },
      },
    ],
    mimeTypes: ['image/*', 'video/*', 'image/svg+xml'],
  }),

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
      label: {
        en: 'Caption',
        de: 'Bildunterschrift',
      },
    },
    {
      name: 'copyright',
      type: 'text',
      label: {
        en: 'Copyright',
        de: 'Urheberrecht',
      },
    },
  ],
  timestamps: true,
}
