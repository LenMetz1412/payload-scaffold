import type { HeroBlock, MetaFieldset } from '@/payload-types'

/**
 * Represents the generic structure of all collections that are routed and displayed inside the Next.js app,
 * making it flexible enough to handle various Payload collections generically.
 * This ensures consistency across your collections while maintaining type safety for routing and display logic within the app
 */
export interface BaseDocument {
  id: string
  title?: string | null
  slug?: string | null
  collectionSlug?: string | null
  meta?: MetaFieldset | null
  hero?: HeroBlock['hero'] | null
}
