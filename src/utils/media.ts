import type { GenericMediaCollection } from '@/config/collections/media'

export const isValidMedia = (media: unknown) => media && typeof media !== 'string'

export const getMediaAsBackgroundUrl = (media: unknown, withBackgroundImage?: boolean) => {
  if (!withBackgroundImage || !isValidMedia(media)) return undefined
  return `url(${(media as GenericMediaCollection).url})`
}
