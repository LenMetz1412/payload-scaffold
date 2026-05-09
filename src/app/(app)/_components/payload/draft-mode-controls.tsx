import { draftMode } from 'next/headers'

import { AdminBar } from '@/app/components/payload/admin-bar'
import { LivePreviewListener } from '@/app/components/payload/live-preview'

/* 
  Only render LivePreviewListener when draft mode
  The @payloadcms/live-preview-react component is adding the duplicate title tag during client-side hydration.
  This is a known issue with Payload's live preview components manipulating the document head. 
*/

export async function DraftModeControls() {
  const { isEnabled } = await draftMode()

  return (
    <>
      <AdminBar adminBarProps={{ preview: isEnabled }} />
      {isEnabled && <LivePreviewListener />}
    </>
  )
}
