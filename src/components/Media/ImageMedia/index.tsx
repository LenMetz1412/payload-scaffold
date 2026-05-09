'use client'

import type { StaticImageData } from 'next/image'
import Image from 'next/image'

import cssVariables from '@/cssVariables'
import { cn } from '@/utils/cn'
import { getMediaSrc } from '@/utils/get-url'

import type { MediaProps } from '../types'

const { breakpoints } = cssVariables

export const ImageMedia = (props: MediaProps) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority = false,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    customCSS,
    disableCopyright = false,
  } = props

  const objectPosition =
    typeof resource === 'object' && resource.focalX && resource.focalY
      ? `${resource.focalX}% ${resource.focalY}%`
      : ''

  const showCopyright = !disableCopyright && typeof resource === 'object' && resource.copyright
  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, filename, height: fullHeight, url, width: fullWidth } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''

    src = getMediaSrc({ url, filename }) || ''
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  // const sizes = sizeFromProps
  //   ? sizeFromProps
  //   : Object.entries(breakpoints)
  //       .map(([, value]) => `(max-width: ${value}px) ${value}px`)
  //       .join(', ')

  const sizes = sizeFromProps
    ? sizeFromProps
    : `${Object.entries(breakpoints)
        .sort(([, a], [, b]) => Number(b) - Number(a))
        .map(([, value]) => `(min-width: ${value}px) ${value}px`)
        .join(', ')}, 100vw`

  // !!!TODO replace prev method uses max size down + size prop is not properly used eveyrwhere
  // const sizes = sizeFromProps
  // ? sizeFromProps
  // : Object.entries(breakpoints)
  //     .sort(([, a], [, b]) => Number(b) - Number(a))
  //     .map(([, value]) => `(min-width: ${value}px) ${value}px`)
  //     .join(', ') + ', 100vw'

  return (
    <div className={cn('group/image', customCSS)}>
      <Image
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        onClick={onClick}
        onLoad={onLoadFromProps}
        priority={priority}
        quality={75}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
        style={{ objectPosition: `${objectPosition}` }}
        loading={priority ? 'eager' : 'lazy'}
      />

      {showCopyright && (
        <span className="pointer-events-none absolute bottom-1 right-1 z-[9] flex rotate-180 items-center justify-center gap-1 bg-black/40 py-1 font-sans text-xs text-white opacity-100 transition-opacity duration-200 [writing-mode:vertical-rl] group-hover/image:opacity-100 md:opacity-0">
          <span className="inline-block rotate-90 text-xs">&copy;</span>
          {resource.copyright}
        </span>
      )}
    </div>
  )
}
