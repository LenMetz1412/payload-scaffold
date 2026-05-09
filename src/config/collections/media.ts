import type { Media } from '@/payload-types'

export enum MediaSizes {
  thumbnail = 'thumbnail',
  card = 'card',
  og = 'og',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export type GenericMediaCollection = Media // | ProjectMedia etc

export type GenericMediaSizes = Partial<
  Record<
    MediaSizes,
    {
      url?: string
      width?: number
      height?: number
      mimeType?: string
      filesize?: number
      filename?: string
    }
  >
>
