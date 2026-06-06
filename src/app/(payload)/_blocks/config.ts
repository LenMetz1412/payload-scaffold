import type { Locale } from '@/config/locales'
import type {
  ContentBlock,
  Downloads,
  FaqBlock,
  GoogleReviewsBlock,
  HeroBlock,
  IframeEmbedBlock,
  LogoGridBlock,
  MediaBlock,
  SocialFeedBlock,
  SpaceBlock,
} from '@/payload-types'
import type { AppPageParams } from '@/utils/page'

export type LayoutBlock =
  | ContentBlock
  | Downloads
  | FaqBlock
  | GoogleReviewsBlock
  | SocialFeedBlock
  | SpaceBlock
  | HeroBlock
  | IframeEmbedBlock
  | LogoGridBlock
  | MediaBlock

export interface BlockComponentBaseProps {
  searchParams?: AppPageParams
  locale: Locale
}
