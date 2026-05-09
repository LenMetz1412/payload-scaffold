'use client'

import { env } from '@env'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

export const LivePreviewListener = () => {
  const { refresh } = useRouter()
  return <PayloadLivePreview refresh={refresh} serverURL={env.NEXT_PUBLIC_SERVER_URL} />
}
