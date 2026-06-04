import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'max-w-full inline-flex items-center justify-center gap-2 font-sans whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        filled:
          'border border-border bg-primary text-primary-foreground hover:bg-gray-300 hover:text-primary hover:border-secondary',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-border bg-transparent shadow-sm hover:bg-gray-300 hover:text-accent-foreground hover:shadow-none',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-gray-300 hover:text-primary',
        ghost:
          'bg-transparent [@media(hover:hover)]:hover:bg-gray-300 [@media(hover:hover)]:hover:text-accent-foreground [@media(hover:hover)]:hover:shadow-none [@media(hover:none)]:active:bg-accent [@media(hover:none)]:active:text-accent-foreground [@media(hover:none)]:active:shadow-none',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md text-lg lg:text-2xl px-8 py-6 mt-4',
        xl: 'h-10 rounded-md text-3xl lg:text-3xl xl:text-4xl px-3 lg:px-6 py-6 lg:py-7 mt-5',
        icon: 'h-9 w-9',
        clear: '',
        column: 'min-h-9 py-2 px-6 mt-4 whitespace-normal',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
