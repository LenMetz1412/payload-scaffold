'use client'

import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { cn } from '@/utils/cn'

const getDurationFromHeight = (
  height: number,
  collapsedHeight: number,
  direction: 'expand' | 'collapse',
) => {
  const h = Math.max(height, collapsedHeight)
  if (direction === 'expand') {
    const base = 0.18
    const factor = 0.0008
    const max = 1.2
    return Math.min(base + (h * factor) / 2, max)
  } else {
    const base = 0.12
    const factor = 0.0006
    const max = 0.6
    return Math.min(base + h * factor, max)
  }
}

export const CollapsableWrapper = ({
  isCollapsible,
  collapsedHeight = 100,
  collapsableKey,
  children,
}: {
  isCollapsible?: boolean
  collapsedHeight?: number
  collapsableKey?: string | number
} & PropsWithChildren) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => !!isCollapsible)
  const [contentHeight, setContentHeight] = useState<number | null>(null)

  const { isReallyCollapsable, measuredHeight, expandDuration, collapseDuration } = useMemo(() => {
    const height = contentHeight ?? collapsedHeight
    const canCollapse =
      isCollapsible && contentHeight !== null && contentHeight > collapsedHeight + 5 // 5 is ca text leading bottom

    return {
      isReallyCollapsable: canCollapse,
      measuredHeight: height,
      expandDuration: getDurationFromHeight(height, collapsedHeight, 'expand'),
      collapseDuration: getDurationFromHeight(height, collapsedHeight, 'collapse'),
    }
  }, [isCollapsible, contentHeight, collapsedHeight])

  useLayoutEffect(() => {
    if (!contentRef.current) return

    const updateHeight = () => {
      setContentHeight(contentRef.current!.scrollHeight)
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(contentRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  const toggle = useCallback(() => {
    const container = contentRef.current
    if (!container) return

    setIsCollapsed((prev) => {
      if (!prev) {
        const rect = container.getBoundingClientRect()
        const fitsCompletelyInViewport =
          rect.height <= window.innerHeight && rect.top >= 0 && rect.bottom <= window.innerHeight

        if (!fitsCompletelyInViewport) {
          container.scrollIntoView({
            behavior: 'instant',
            block: 'start',
          })
        }
      }
      return !prev
    })
  }, [])

  useEffect(() => {
    if (collapsableKey) setIsCollapsed(true)
  }, [collapsableKey])

  if (!isCollapsible) {
    return <>{children}</>
  }

  return (
    <div className="relative pb-12">
      <motion.div
        ref={contentRef}
        initial={false}
        animate={{ maxHeight: isCollapsed ? collapsedHeight : measuredHeight }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: isCollapsed ? collapseDuration : expandDuration,
        }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>

      {isReallyCollapsable && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center">
          <div
            className={cn(
              'absolute bottom-12 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent',
              !isCollapsed && 'opacity-0',
            )}
          />

          <button
            type="button"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'expand content' : 'collapse content'}
            onClick={toggle}
            className="pointer-events-auto flex h-12 w-20 items-center justify-center px-4"
          >
            <ChevronDown
              className={cn(
                'size-full origin-center scale-x-[1.5] transition-transform duration-300',
                !isCollapsed && 'rotate-180',
              )}
              strokeWidth={1.5}
            />
          </button>
        </div>
      )}
    </div>
  )
}
