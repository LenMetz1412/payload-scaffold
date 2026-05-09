import type { IframeEmbedBlock as IFrameEmbedBlockBaseProps } from '@/payload-types'

export const IFrameEmbedBlock: React.FC<IFrameEmbedBlockBaseProps> = (props) => {
  const { src, title, width, height } = props
  return (
    <div className="container my-8 flex items-center justify-center first:mt-14 lg:my-16">
      <div
        className="relative h-full w-full"
        style={{
          aspectRatio: `${width} / ${height}`,
          maxWidth: `${width}px`,
          minHeight: `${height}px`,
        }}
      >
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src={src ?? undefined}
          title={title || 'Embedded Content'}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}
