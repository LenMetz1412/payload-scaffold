export const IFrameMedia = ({
  iframeMedia,
  isSpotify = false,
  customHeight,
}: {
  iframeMedia: string
  isSpotify?: boolean
  customHeight?: number | null
}) => {
  const containerClassName = isSpotify
    ? 'absolute inset-0 flex items-center justify-center'
    : 'relative'
  const iframeClassName = isSpotify ? 'h-auto w-full max-h-full' : 'absolute inset-0 h-full w-full'

  return (
    <div className={containerClassName}>
      <iframe
        className={iframeClassName}
        src={iframeMedia}
        style={isSpotify && customHeight ? { height: `${customHeight}px` } : undefined}
        title="Embedded Content"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}

export const IFrameYoutubeMedia = ({ iframeMedia }: { iframeMedia: string }) => {
  return (
    <div className="relative">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${iframeMedia}`}
        title="Youtube Embedded Content"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
