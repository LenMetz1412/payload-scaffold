import type { SpaceBlock as SpaceBlockProps } from '@/payload-types'

const sizeClasses: Record<NonNullable<SpaceBlockProps['size']>, string> = {
  small: 'h-8 lg:h-12',
  medium: 'h-16 lg:h-24',
  large: 'h-24 lg:h-40',
}

export const SpaceBlock: React.FC<SpaceBlockProps> = ({ size = 'medium' }) => {
  return <div className={sizeClasses[size ?? 'medium']} aria-hidden />
}
