import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { LogoGridBlock as LogoGridBlockProps } from '@/payload-types'
import { cn } from '@/utils/cn'

import type { BlockComponentBaseProps } from '../config'

const getGridColumnsClass = (count: number) => {
  if (count >= 4) {
    return 'grid-cols-2 sm:grid-cols-2 sm:gap-x-14 md:grid-cols-3 lg:grid-cols-4'
  }

  if (count === 3) {
    return 'grid-cols-2 sm:grid-cols-2 sm:gap-x-14 md:grid-cols-3'
  }

  if (count === 2) {
    return 'grid-cols-1 sm:grid-cols-2 sm:gap-x-14'
  }

  return 'grid-cols-2'
}

const getCenteredWidthClass = (count: number) => {
  if (count === 1) return 'max-w-sm'
  if (count === 2) return 'max-w-3xl'
  if (count === 3) return 'max-w-5xl'
  return ''
}

const setLogoSizeClass = (size?: string | null) => {
  switch (size) {
    case 'small':
      return 'w-full h-13 md:h-14 lg:h-16'
    case 'medium':
      return 'w-full h-full'
    default:
      return 'w-full h-full'
  }
}

export const LogoGridBlock = ({
  logos,
  locale,
  sizes,
}: LogoGridBlockProps & BlockComponentBaseProps) => {
  if (!logos || logos.length === 0) return null

  const logoCount = logos.length
  const shouldCenter = logoCount < 4
  const logoSizes = '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'

  return (
    <div className="container my-6 lg:my-16">
      <div
        className={cn(
          'grid w-full gap-x-8 gap-y-12',
          getGridColumnsClass(logoCount),
          shouldCenter && 'mx-auto justify-center',
          shouldCenter && getCenteredWidthClass(logoCount),
        )}
      >
        {logos.map((item, index) => {
          if (!item.logo) return null

          const key = item.id ?? index

          const cardContent = (
            <div className="flex h-full w-full flex-col text-left">
              <div className="relative mx-auto aspect-[3/2] w-full max-w-[16rem] overflow-hidden sm:max-w-[20rem] md:max-w-full">
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
                  <Media
                    resource={item.logo}
                    fill
                    className={cn('relative', setLogoSizeClass(sizes))}
                    customCSS={cn('relative', setLogoSizeClass(sizes))}
                    imgClassName="object-contain"
                    size={logoSizes}
                  />
                </div>
              </div>

              {item.text && (
                <RichText
                  data={item.text}
                  enableGutter={false}
                  className="mx-auto mt-2 w-full max-w-[16rem] pl-2 text-left text-sm sm:max-w-full sm:pl-6"
                  locale={locale}
                />
              )}
            </div>
          )

          if (item.url) {
            return (
              <CMSLink
                key={key}
                type="custom"
                url={item.url}
                locale={locale}
                appearance="inline"
                className="group block h-full"
              >
                {cardContent}
              </CMSLink>
            )
          }

          return (
            <div key={key} className="group h-full">
              {cardContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}
