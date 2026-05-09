'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type HeroLogoPortalProps = {
  children: ReactNode
}

export default function HeroLogoPortal({ children }: HeroLogoPortalProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setTarget(document.getElementById('hero-logo-root'))
  }, [])

  if (!target) return null

  return <>{createPortal(children, target)}</>
}
