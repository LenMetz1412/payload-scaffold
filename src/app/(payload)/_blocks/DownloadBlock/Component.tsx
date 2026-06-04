import { ArrowDownToLine } from 'lucide-react'

import { Button } from '@/sha/button'

export type DownloadBlockProps = {
  label: string
  downloadFile: {
    url: string
    mimeType: string
  }
}

export const DownloadBlock = ({
  downloads,
  title,
}: {
  title?: string
  downloads: DownloadBlockProps[]
}) => {
  if (!downloads.length) return null

  return (
    <section className="container mb-8 flex flex-col first:mt-14">
      {title && (
        <div className="mb-8">
          <h2 className="h2 mb-3 font-sans md:mb-4 lg:mb-6">{title}</h2>
        </div>
      )}
      <div className="flex w-full flex-wrap justify-start gap-4">
        {downloads.map((btn, idx) => (
          <DownloadButton key={idx} {...btn} />
        ))}
      </div>
    </section>
  )
}

export const DownloadButton = ({ label, downloadFile }: DownloadBlockProps) => {
  const downloadFileUrl = downloadFile.url
  if (!downloadFileUrl) return <></>

  return (
    <Button asChild className={'my-0 w-fit'} size={'column'} variant={'outline'}>
      <a
        href={downloadFileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center gap-2"
      >
        <ArrowDownToLine />
        {label}
      </a>
    </Button>
  )
}
