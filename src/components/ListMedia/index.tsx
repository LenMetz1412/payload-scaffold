import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utils/cn'

export const ListMedia = ({
  resource,
  className,
  sizes,
}: {
  resource?: MediaType | string | number
  className?: string
  sizes?: string
}) => {
  return (
    <Media
      imgClassName={cn('object-cover object-center', className)}
      resource={resource}
      customCSS="relative"
      size={sizes}
    />
  )
}
