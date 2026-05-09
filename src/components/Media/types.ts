import type { StaticImageData } from 'next/image'
import type { ElementType, Ref, VideoHTMLAttributes } from 'react'

import type { Media } from '@/payload-types'

export type MediaType = Media | string | number | undefined

export interface MediaProps {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource: MediaType // for Payload media
  size?: string // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
  customCSS?: string
  videoProps?: VideoHTMLAttributes<HTMLVideoElement> & {
    ref?: Ref<HTMLVideoElement>
  }
  isHero?: boolean
  disableCopyright?: boolean
}
