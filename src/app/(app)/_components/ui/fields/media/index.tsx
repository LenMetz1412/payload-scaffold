import { env } from '@env'
import { useMemo } from 'react'

import type { GenericMediaCollection, GenericMediaSizes } from '@/config/collections/media'
import { MediaSizes } from '@/config/collections/media'

import { UiMediaImageField } from './image'
import { UiMediaVideoField } from './video'

// !! super basic extend it as you please

export interface UiMediaFieldProps {
  media: GenericMediaCollection
  mediaSize?: MediaSizes
  // ADD HERE PROJECT DEPENDENT PROPS like styles etc
}

export const UiMediaField = (
  props: Omit<UiMediaFieldProps, 'media'> & {
    media: unknown
  },
) => {
  const { media } = props
  /**
   * if the related asset was independently deleted (or missing)
   * payloadcms returns anyways the relation id
   */
  if (!media || typeof media === 'string') return <></>
  return <MediaField {...{ ...props, media: media as GenericMediaCollection }} />
}

const MediaField = (props: UiMediaFieldProps) => {
  const { media, mediaSize = MediaSizes.md } = props
  const { url, mimeType } = media
  const sizes = media.sizes as GenericMediaSizes | undefined

  const isVideo = useMemo(() => mimeType?.includes('video'), [mimeType])
  const isImage = useMemo(() => mimeType?.includes('image'), [mimeType])

  /**
   * payload cms does not generate size if resize dimensions are equal to target dimesions
   * https://github.com/payloadcms/payload/blob/1fd61fb9898a08b28b22be61d9b64aa58aa61088/src/uploads/imageResizer.ts#L63
   *
   */
  const mediaUrl = useMemo(() => {
    const path = sizes?.[mediaSize]?.url ?? url
    if (!path) return null
    return [env.NEXT_PUBLIC_SERVER_URL, path].join('')
  }, [sizes, url, mediaSize])

  if (!mediaUrl) return <></>

  if (isImage) return <UiMediaImageField {...{ ...props, src: mediaUrl }} />
  if (isVideo) return <UiMediaVideoField {...{ ...props, src: mediaUrl }} />

  return <>mimeType not supported {mimeType}</>
}
