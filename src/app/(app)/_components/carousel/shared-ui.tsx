'use client'

import { ArrowRight } from 'lucide-react'
import { observer } from 'mobx-react'
import { type PropsWithChildren, useMemo, useState } from 'react'

import { DateBadge, type DateBadgeProps } from '@/components/date-badge'
import { IFrameMedia, IFrameYoutubeMedia } from '@/components/iFrame/iframe'
import { CMSLink, type CMSLinkProps } from '@/components/Link'
import { Media } from '@/components/Media'
import type { MediaProps } from '@/components/Media/types'
import type { Locale } from '@/config/locales'
import { Button } from '@/sha/button'
import { Carousel, type CarouselApi, CarouselContent } from '@/sha/carousel'
import { cn } from '@/utils/cn'

import { getGridColumnsClass } from './helpers'
import { CarouselNavigation } from './navigation'

interface CarouselHeaderProps {
  title?: string | null
  locale?: Locale
  link?: Partial<CMSLinkProps>
}

export const CarouselHeader = ({ title, locale, link }: CarouselHeaderProps) => {
  if (!title && !link) return null
  return (
    <div className="pb-4 md:pb-8">
      {!!title && <h2 className="h2 md:text-4xl">{title}</h2>}
      {!!link && <CMSLink {...link} locale={locale} />}
    </div>
  )
}


export const CarouselBlockWrapper = ({
  manyItems = 0,
  header,
  children,
}: PropsWithChildren & {
  manyItems?: number
  header: CarouselHeaderProps
}) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const { title, link, locale } = header

  if (!manyItems) return null

  return (
    <div className="w-full pt-12 first:pt-0">
      <CarouselHeader title={title} link={link} locale={locale} />
      <CarouselNavigation carouselApi={carouselApi} manyItems={manyItems} />
      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: 'start',
        }}
        orientation="horizontal"
        className="relative w-full"
      >
        <CarouselContent className="flex snap-x snap-mandatory scroll-smooth md:flex-row">
          {children}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export const CarouselBlockGridWrapper = ({
  manyItems = 0,
  header,
  children,
}: PropsWithChildren & {
  manyItems?: number
  header: CarouselHeaderProps
}) => {
  const { title, link, locale } = header
  const gridColumnsClass = useMemo(() => getGridColumnsClass(manyItems), [manyItems])

  if (!manyItems) return null

  return (
    <div className="w-full pt-12 first:pt-0">
      <CarouselHeader title={title} link={link} locale={locale} />
      <div className={cn('grid grid-cols-1 gap-x-4 gap-y-10', gridColumnsClass)}>{children}</div>
    </div>
  )
}

/* TODO ADD FALLBACK LINK_LABEL ? */
export const CarouselItemCta = ({ label }: { label?: string | null }) => {
  return (
    <div className="place-end flex flex-row content-end justify-items-end">
      <Button className="mt-4" variant="outline" size="default">
        <ArrowRight className="transition-all group-hover:mr-6 group-hover:translate-x-6" />
        {label}
      </Button>
    </div>
  )
}

export const CarouselItemCtaLink = ({
  label,
  cmsLink,
}: {
  label?: string | null
  cmsLink?: CMSLinkProps
}) => {
  if (!cmsLink) return null
  return (
    <div className="place-end flex flex-row content-end justify-items-end">
      <CMSLink {...cmsLink} appearance="outline" label={label} />
    </div>
  )
}

export const CarouselBlockItemContent = ({
  CMSLinkLabel,
  cmsLink,
  media,
  staticImage,
  dateConfig,
  children,
  disableLinkWrapper = false,
  mediaSizes,
}: PropsWithChildren & {
  cmsLink?: CMSLinkProps
  media: MediaProps['resource'] | null
  staticImage?: MediaProps['src']
  dateConfig?: DateBadgeProps | null
  CMSLinkLabel?: string
  disableLinkWrapper?: boolean
  mediaSizes?: string
}) => {
  const content = (
    <>
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-secondary transition duration-300">
        {!!media && (
          <Media
            fill
            imgClassName="absolute inset-0 size-full object-cover object-center"
            resource={media}
            src={staticImage}
            size={mediaSizes}
          />
        )}

        {!!dateConfig && (
          <div className="absolute bottom-0 z-10">
            <DateBadge {...dateConfig} />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-grow flex-col gap-y-3 font-sans text-lgf">
        <div className="flex-none">{children}</div>
      </div>

      {disableLinkWrapper ? (
        <div className="mt-4 w-full border-t border-border pb-[1px]" aria-hidden="true" />
      ) : (
        !!cmsLink && <CarouselItemCta label={CMSLinkLabel} />
      )}
    </>
  )

  if (disableLinkWrapper || !cmsLink) {
    return <div className="group flex h-full flex-col justify-start">{content}</div>
  }

  return (
    <CMSLink className="group flex h-full flex-col justify-start" appearance="inline" {...cmsLink}>
      {content}
    </CMSLink>
  )
}

export const ContentCarouselBlockItemContent = observer(
  ({
    CMSLinkLabel,
    cmsLink,
    media,
    iframeMedia,
    staticImage,
    dateConfig,
    children,
    disableLinkWrapper = false,
    mediaSizes,
    format,
  }: PropsWithChildren & {
    cmsLink?: CMSLinkProps
    media: MediaProps['resource'] | null
    iframeMedia: string | null
    staticImage?: MediaProps['src']
    dateConfig?: DateBadgeProps | null
    CMSLinkLabel?: string
    disableLinkWrapper?: boolean
    mediaSizes?: string
    format?: string | null
  }) => {
    const isEmbedFormat = format === 'embed' || format === 'youtube'
    const wrapCard = !disableLinkWrapper && !!cmsLink && !isEmbedFormat
    const showLink = !disableLinkWrapper && !!cmsLink

    const isSpotify =
      format === 'embed' && !!iframeMedia && iframeMedia.includes('open.spotify.com/embed')
    const spotifyHeight = isSpotify ? 232 : null
    const content = (
      <>
        <div className={cn('relative aspect-[3/2] w-full overflow-hidden transition duration-300')}>
          {!!media && format === 'media' && (
            <Media
              className="absolute inset-0 size-full"
              imgClassName="absolute inset-0 size-full object-cover object-center"
              videoClassName="absolute inset-0 size-full object-cover object-center"
              resource={media}
              src={staticImage}
              size={mediaSizes}
            />
          )}
          {!!iframeMedia && format === 'embed' && (
            <IFrameMedia
              iframeMedia={iframeMedia}
              isSpotify={isSpotify}
              customHeight={spotifyHeight}
            />
          )}
          {!!iframeMedia && format === 'youtube' && (
            <IFrameYoutubeMedia iframeMedia={iframeMedia} />
          )}

          {!!dateConfig && (
            <div className="absolute bottom-0 z-10">
              <DateBadge {...dateConfig} />
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-grow flex-col gap-y-3 font-sans text-lgf">
          <div className="flex-none">{children}</div>
        </div>

        {disableLinkWrapper ? (
          <div className="mt-4 w-full border-t border-border pb-[1px]" aria-hidden="true" />
        ) : (
          showLink &&
          (wrapCard ? (
            <CarouselItemCta label={CMSLinkLabel} />
          ) : (
            <CarouselItemCtaLink cmsLink={cmsLink} label={CMSLinkLabel} />
          ))
        )}
      </>
    )

    if (!wrapCard) {
      return <div className="group flex h-full flex-col justify-start">{content}</div>
    }

    return (
      <CMSLink
        className="group flex h-full flex-col justify-start"
        appearance="inline"
        {...cmsLink}
      >
        {content}
      </CMSLink>
    )
  },
)
