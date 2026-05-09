'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import * as React from 'react'

import { cn } from '@/utils/cn'

import { ChevronIndicator } from './chevron'
import { menuTriggerVariants } from './variants'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b', className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    isCurrent?: boolean
    keepTriggerInView?: boolean
    scrollOffsetTop?: number
  }
>(
  (
    {
      className,
      children,
      isCurrent = false,
      keepTriggerInView = false,
      scrollOffsetTop,
      onClick,
      ...props
    },
    ref,
  ) => {
    const getScrollOffsetTop = React.useCallback(() => {
      if (typeof window === 'undefined') return 0
      if (typeof scrollOffsetTop === 'number') return scrollOffsetTop

      const navbar = document.getElementById('appNavbar')
      if (!navbar) return 0

      const navSection = navbar.querySelector('section')
      const rect = (navSection ?? navbar).getBoundingClientRect()
      return rect.height
    }, [scrollOffsetTop])

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented || !keepTriggerInView) return

        const trigger = event.currentTarget
        window.setTimeout(() => {
          if (!trigger.isConnected) return

          const rect = trigger.getBoundingClientRect()
          const offsetTop = getScrollOffsetTop() + 8
          const isFullyVisible = rect.top >= offsetTop && rect.bottom <= window.innerHeight

          if (!isFullyVisible) {
            const targetTop = Math.max(0, window.scrollY + rect.top - offsetTop)
            window.scrollTo({ top: targetTop })
          }
        }, 230)
      },
      [getScrollOffsetTop, keepTriggerInView, onClick],
    )

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            menuTriggerVariants({
              fullWidth: true,
              withChevron: true,
              current: isCurrent,
            }),
            className,
          )}
          onClick={handleClick}
          {...props}
        >
          {children}
          <ChevronIndicator />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  },
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
