'use client'

import type React from 'react'
import { useCallback, useRef } from 'react'

import { cn } from '@/utils/cn'
import { getMediaSrc } from '@/utils/get-url'

import type { MediaProps } from '../types'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName, videoProps, customCSS } = props

  const internalRef = useRef<HTMLVideoElement>(null)
  const handleRef = useCallback(
    (node: HTMLVideoElement | null) => {
      internalRef.current = node

      const externalRef = videoProps?.ref
      if (!externalRef) return

      if (typeof externalRef === 'function') {
        externalRef(node)
      } else {
        externalRef.current = node
      }
    },
    [videoProps],
  )


  if (!!resource && typeof resource === 'object') {
    const { url, filename } = resource
    const src = getMediaSrc({ url, filename })

    if (!src) return null

    const showCopyright = !!resource.copyright
    const {
      className: videoPropsClassName,
      ref: _,
      autoPlay = true,
      controls = false,
      loop = false,
      muted = true,
      ...restVideoProps
    } = videoProps || {}

    return (
      <div className={cn('group/video relative h-full w-full', customCSS)}>
        <video
          autoPlay={autoPlay}
          className={cn(videoClassName, videoPropsClassName)}
          controls={controls}
          loop={loop}
          muted={muted}
          preload="auto"
          onClick={onClick}
          playsInline
          ref={handleRef}
          {...restVideoProps}
        >
          <source src={src} type={resource.mimeType ?? undefined} />
        </video>

        {showCopyright && (
          <span className="pointer-events-none absolute bottom-1 right-1 z-[9] flex rotate-180 items-center justify-center gap-1 bg-black/40 py-1 font-sans text-xs text-white opacity-100 transition-opacity duration-200 [writing-mode:vertical-rl] group-hover/video:opacity-100 md:opacity-0">
            <span className="inline-block rotate-90 text-xs">&copy;</span>
            {resource.copyright}
          </span>
        )}
      </div>
    )
  }

  return null
}
