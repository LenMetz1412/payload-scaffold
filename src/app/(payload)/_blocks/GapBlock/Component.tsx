import type { GapBlock as GapBlockProps } from '@/payload-types'

import type { BlockComponentBaseProps } from '../config'

export const GapBlock = ({
  gapSize = 'md',
}: GapBlockProps &
  BlockComponentBaseProps & {
    gapSize: 'sm' | 'md' | 'lg' | 'xl'
  }) => {
  const gapMap: Record<string, string> = {
    sm: 'h-2 lg:h-12',
    md: 'h-4 lg:h-24',
    lg: 'h-8 lg:h-48',
    xl: 'h-16 lg:h-96',
  }
  return <div className={gapMap[gapSize]} />
}
