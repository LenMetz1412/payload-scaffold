import { cva } from 'class-variance-authority'

export const menuTriggerVariants = cva(
  'group inline-flex items-center  rounded-md  font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      format: {
        link: 'text-lg h-9 px-4 py-2',
        iconLink: 'p-2',
        effect: 'px-2 py-2 md:px-4',
      },
      fontFamily: {
        sans: 'font-sans',
        serif: 'font-serif',
      },
      hover: {
        default:
          'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
        underline:
          'underline-offset-4 hover:underline focus:underline data-[active]:underline data-[state=open]:underline',
      },
      current: {
        true: 'bg-primary text-primary-foreground',
        false: '',
      },
      fullWidth: {
        true: 'w-full justify-between',
        false: 'w-max justify-start',
      },
      withChevron: {
        true: 'pr-1',
        false: '',
      },
    },
    defaultVariants: {
      format: 'link',
      fontFamily: 'sans',
      hover: 'default',
      fullWidth: false,
      current: false,
      withChevron: false,
    },
  },
)
