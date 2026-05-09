import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Locale } from '@/config/locales'
import type { ContentBlock as ContentBlockProps, Download, LinkGroupField } from '@/payload-types'
import { cn } from '@/utils/cn'
import { isRelationPopulated } from '@/utils/sanitize'

import type { BlockComponentBaseProps } from '../config'
import { DownloadButton } from '../DownloadBlock/Component'
import { ContentGrid } from './Component.client'

export const ContentBlock = ({
  columns,
  locale,
  collapsible,
}: ContentBlockProps & BlockComponentBaseProps) => {
  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  const getContentMediaSizes = (columnSize?: string | null) => {
    switch (columnSize) {
      case 'half':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw'
      case 'oneThird':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      case 'twoThirds':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 66vw'
      default:
        return '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
    }
  }

  return (
    <div className="container py-8 first:pt-14">
      <ContentGrid collapsible={collapsible}>
        {columns?.reduce<React.ReactNode[]>((acc, col, index) => {
          const {
            enableLink,
            links,
            enableDownload,
            downloads,
            richText,
            size: columnSize,
            media,
            layoutOptions,
          } = col
          const isImageAbove = layoutOptions === 'imageAbove'
          const mediaSizes = getContentMediaSizes(columnSize)

          const column = (
            <div
              className={cn(
                `lg:col-span-${colsSpanClasses[columnSize!]}`,
                'group h-full justify-start',
              )}
              key={index}
            >
              {isImageAbove && media && (
                <Media
                  resource={media}
                  imgClassName="mb-4 lg:mb-8 max-h-[80vh] lg:max-h-[60vh] w-full object-cover"
                  customCSS="relative"
                  size={mediaSizes}
                />
              )}
              {richText && (
                <RichText data={richText} enableGutter={false} className={'mb-2'} locale={locale} />
              )}
              {!isImageAbove && media && (
                <Media
                  resource={media}
                  imgClassName="mb-0 lg:mt-8 max-h-[80vh] lg:max-h-[60vh] w-full object-cover"
                  customCSS="relative"
                  size={mediaSizes}
                />
              )}
              {enableLink && <ColumnLinks links={links} locale={locale} />}
              {enableDownload && <ColumnDownloads downloads={downloads} />}
            </div>
          )

          if (col.startNewRow && index > 0) {
            acc.push(<div key={`break-${index}`} className="col-span-full" />)
          }

          acc.push(column)
          return acc
        }, [])}
      </ContentGrid>
    </div>
  )
}

type ColumnDownload = {
  label: string
  downloadFile: string | Download
  id?: string | null
}

const ColumnDownloads = ({ downloads }: { downloads?: ColumnDownload[] | null }) => {
  if (!downloads?.length) return null

  return (
    <div className="mb-12 flex flex-wrap gap-2 lg:gap-4">
      {downloads.map(({ label, downloadFile }, idx) => {
        if (!isRelationPopulated(downloadFile) || !downloadFile.url) return null
        return (
          <DownloadButton
            key={idx}
            label={label}
            downloadFile={{
              url: downloadFile.url,
              mimeType: downloadFile.mimeType || '',
            }}
          />
        )
      })}
    </div>
  )
}

const ColumnLinks = ({ links, locale }: { links?: LinkGroupField; locale: Locale }) => {
  const columnLinks = links?.map((link, index) => ({ ...link, id: link.id || String(index) }))

  if (!columnLinks?.length) return null

  return (
    <div className="mb-12 flex flex-wrap gap-2 lg:gap-4">
      {columnLinks.map(({ id: linkId, link: linkData }) => (
        <CMSLink key={linkId} {...linkData} size="column" locale={locale} />
      ))}
    </div>
  )
}
