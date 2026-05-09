import * as SliderPrimitive from '@radix-ui/react-slider'
import React from 'react'

import { cn } from '@/utils/cn'

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  classNames?: {
    track?: string
    range?: string
    thumb?: string
  }
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, classNames, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20',
          classNames?.track,
        )}
      >
        <SliderPrimitive.Range className={cn('absolute h-full bg-primary', classNames?.range)} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          'block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors',
          'cursor-grab focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'cursor-default disabled:pointer-events-none disabled:opacity-50',
          classNames?.thumb,
        )}
      />
    </SliderPrimitive.Root>
  ),
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
