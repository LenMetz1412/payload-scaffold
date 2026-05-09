import { ArrowDownToLine, FileSpreadsheet, FileText } from 'lucide-react'

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
  const downloadLink = downloadFile.url
  const mimeType = downloadFile.mimeType || 'application/octet-stream'
  if (!downloadLink) return <></>

  return (
    <Button asChild className={'group my-0 w-fit'} size={'column'} variant={'outline'}>
      <a
        href={downloadLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-start gap-2"
      >
        <ArrowDownToLine className="transition-all group-hover:mr-6 group-hover:translate-x-6 group-hover:-rotate-90" />
        {label}
        {mimeType === 'application/pdf' && <FileText />}
        {mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && (
          <FileSpreadsheet />
        )}
        {mimeType === 'application/octet-stream' && <FileText />}
      </a>
    </Button>
  )
}
