import { ImageMedia } from './ImageMedia'
import type { MediaProps } from './types'
import { VideoMedia } from './VideoMedia'

export const Media = (props: MediaProps) => {
  const { className, htmlElement = 'div', resource } = props

  if (!resource) return null

  const isVideo = typeof resource === 'object' && resource.mimeType?.includes('video')
  const MediaComponent = isVideo ? VideoMedia : ImageMedia

  if (htmlElement === null) {
    return <MediaComponent {...props} />
  }

  const Tag = htmlElement
  return (
    <Tag className={className}>
      <MediaComponent {...props} />
    </Tag>
  )
}
