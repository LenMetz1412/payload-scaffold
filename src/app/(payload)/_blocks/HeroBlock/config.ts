import type { Block } from 'payload'

import { hero } from '@/components/heros/config'

export const HeroBlock: Block = {
  slug: 'heroBlock',
  interfaceName: 'HeroBlock',
  fields: [hero],
}
