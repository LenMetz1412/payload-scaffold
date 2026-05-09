import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from '@env'
import type { UploadConfig } from 'payload'

import type { CollectionSlugs } from '@/config/collections'
import { MediaSizes } from '@/config/collections/media'

const { PAYLOAD_PUBLIC_ASSETS_PATH } = env

/**
 * Generates the base configuration for uploading files to a collection.
 *
 * @param {Object} options - Options for configuring the uploader.
 * @param {string} options.collectionSlug - The slug of the collection to upload files to.
 * @param {Array<Object>} [options.imageSizes=[]] - Array of image size configurations. Defaults to a thumbnail size of 400x400.
 * @param {Array<string>} [options.mimeTypes=["image/*", "video/*"]] - Array of allowed MIME types. Defaults to image and video MIME types.
 * @returns {Object} The upload configuration object.
 */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const getUploaderBaseConfig = ({
  collectionSlug,
  imageSizes = [],
  mimeTypes = ['image/*', 'video/*'],
}: {
  collectionSlug: CollectionSlugs
  imageSizes?: UploadConfig['imageSizes']
  mimeTypes?: UploadConfig['mimeTypes']
}): UploadConfig => ({
  staticDir: path.resolve(dirname, PAYLOAD_PUBLIC_ASSETS_PATH, collectionSlug),
  resizeOptions: {
    withoutEnlargement: true,
  },

  withMetadata: true,

  imageSizes: [
    {
      name: MediaSizes.thumbnail,
      width: 400,
      height: 400,
      position: 'centre',
    },
    ...imageSizes,
  ],
  mimeTypes,
})
