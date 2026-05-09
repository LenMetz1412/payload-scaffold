import type { StaticImageData } from 'next/image'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { cn } from '@/utils/cn'

export const MediaBlock = (
  props: MediaBlockProps & {
    breakout?: boolean
    captionClassName?: string
    className?: string
    enableGutter?: boolean
    imgClassName?: string
    staticImage?: StaticImageData
  },
) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    position = 'default',
    staticImage,
  } = props
  const mediaSizes =
    position === 'fullscreen'
      ? '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
      : '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px'

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(
        '',
        {
          container: position === 'default' && enableGutter,
        },
        className,
      )}
    >
      {position === 'fullscreen' && (
        <div className="relative">
          <Media resource={media} src={staticImage} size={mediaSizes} />
        </div>
      )}
      {position === 'default' && (
        <Media
          imgClassName={cn(imgClassName)}
          resource={media}
          src={staticImage}
          customCSS="relative"
          size={mediaSizes}
        />
      )}
      {caption && (
        <div className={cn('dark:prose-invert prose mt-2', captionClassName)}>
          <RichText data={caption} enableGutter={enableGutter} />
        </div>
      )}
    </div>
  )
}
