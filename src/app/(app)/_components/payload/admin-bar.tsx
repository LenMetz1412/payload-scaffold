'use client'

import { env } from '@env'
import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useCallback, useState } from 'react'
import { useCollectionByRouteFragment } from '@/app/hooks/use-collection-by-route'

const { NEXT_PUBLIC_SERVER_URL } = env

const Logo: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = ({ adminBarProps }) => {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const { collection, labels } = useCollectionByRouteFragment()

  const onAuthChange = useCallback((user?: PayloadMeUser) => {
    setShow(!!user?.id)
  }, [])

  const onPreviewExit = useCallback(() => {
    void fetch('/next/exit-preview').then(() => {
      router.push('/')
      router.refresh()
    })
  }, [router])

  return (
    <PayloadAdminBar
      {...adminBarProps}
      className="py-2 text-white"
      classNames={{
        controls: 'font-medium text-white',
        logo: 'text-white',
        user: 'text-white',
      }}
      cmsURL={NEXT_PUBLIC_SERVER_URL}
      collectionSlug={collection}
      collectionLabels={labels}
      logo={<Logo />}
      onAuthChange={onAuthChange}
      onPreviewExit={onPreviewExit}
      style={{
        position: 'fixed',
        zIndex: '9999',
        bottom: '1.5rem',
        left: '50%',
        top: 'unset',
        transform: 'translateX(-50%)',
        width: 'auto',
        borderRadius: '9999px',
        backgroundColor: '#ADA579',
        padding: '0.25rem 1.25rem',
        display: show ? 'flex' : 'none',
      }}
    />
  )
}
