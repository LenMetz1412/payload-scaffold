import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/utils/cn'

interface StickyWhenInViewProps {
  children: ReactNode
  offsetElementId?: string
  className?: string
  inView: boolean
  additionalOffset?: number
}

export const StickyWhenInView = ({
  children,
  offsetElementId = 'appNavbar',
  className = 'bg-primary-foreground py-4',
  inView,
  additionalOffset = 0,
}: StickyWhenInViewProps) => {
  const ref = useRef(null)
  const [topPos, setTopPos] = useState(0)

  useEffect(() => {
    const updateTopPos = () => {
      const element = document.getElementById(offsetElementId)
      if (element) {
        setTopPos(element.offsetHeight + additionalOffset)
      }
    }

    updateTopPos()
    window.addEventListener('resize', updateTopPos)

    return () => window.removeEventListener('resize', updateTopPos)
  }, [offsetElementId, additionalOffset])

  return (
    <div
      ref={ref}
      className={cn('z-20', inView && 'sticky', className)}
      style={{
        top: inView ? `${topPos}px` : undefined,
      }}
    >
      {children}
    </div>
  )
}
