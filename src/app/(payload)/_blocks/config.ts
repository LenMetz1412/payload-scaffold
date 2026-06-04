import type { Locale } from '@/config/locales'
import type {
  ContentBlock,
  Downloads,
  FaqBlock,
  GapBlock,
  HeroBlock,
  IframeEmbedBlock,
  LogoGridBlock,
  MediaBlock,
} from '@/payload-types'
import type { AppPageParams } from '@/utils/page'

export type LayoutBlock =
  | ContentBlock
  | Downloads
  | FaqBlock
  | GapBlock
  | HeroBlock
  | IframeEmbedBlock
  | LogoGridBlock
  | MediaBlock

export interface BlockComponentBaseProps {
  searchParams?: AppPageParams
  locale: Locale
}
