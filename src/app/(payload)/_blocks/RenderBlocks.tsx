import { FooterSpacer } from '@/app/(app)/_components/doc-templates/shared/footer-spacer'
import { ContentBlock as ContentBlockComponent } from '@/blocks/Content/Component'
import { DownloadBlock as DownloadBlockComponent } from '@/blocks/DownloadBlock/Component'
import { FaqBlock as FaqBlockComponent } from '@/blocks/FaqBlock/Component'
import { GoogleReviewsBlockServer as GoogleReviewsBlockComponent } from '@/blocks/GoogleReviewsBlock/ServerWrapper'
import { IFrameEmbedBlock as IFrameEmbedBlockComponent } from '@/blocks/IFrameEmbedBlock/Component'
import { LogoGridBlock as LogoGridBlockComponent } from '@/blocks/LogoGridBlock/Component'
import { MediaBlock as MediaBlockComponent } from '@/blocks/MediaBlock/Component'
import { SocialFeedBlock as SocialFeedBlockComponent } from '@/blocks/SocialFeedBlock/Component'
import { SpaceBlock as SpaceBlockComponent } from '@/blocks/SpaceBlock/Component'
import { RenderHero } from '@/components/heros/RenderHero'
import { defaultLocale, type Locale } from '@/config/locales'
import type { AppPageParams } from '@/utils/page'
import React from 'react'

import type { LayoutBlock } from './config'

const standardBlockComponents = {
  content: ContentBlockComponent,
  downloadBlock: DownloadBlockComponent,
  faqBlock: FaqBlockComponent,
  googleReviewsBlock: GoogleReviewsBlockComponent,
  socialFeedBlock: SocialFeedBlockComponent,
  spaceBlock: SpaceBlockComponent,
  iframeEmbedBlock: IFrameEmbedBlockComponent,
  logoGridBlock: LogoGridBlockComponent,
  mediaBlock: MediaBlockComponent,
} as const

const renderBlock = ({
  block,
  locale,
  searchParams,
}: {
  block: LayoutBlock
  locale: Locale
  searchParams: AppPageParams | undefined
}) => {
  if (block.blockType === 'heroBlock') {
    return <RenderHero {...block.hero} locale={locale} />
  }

  if (block.blockType in standardBlockComponents) {
    const blockType = block.blockType as keyof typeof standardBlockComponents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BlockComponent = standardBlockComponents[blockType] as React.ComponentType<any>
    return <BlockComponent {...block} locale={locale} searchParams={searchParams} />
  }

  return null
}

export const RenderBlocks = ({
  blocks,
  locale = defaultLocale,
  searchParams,
  withFooterSpacer = true,
}: {
  blocks?: LayoutBlock[]
  locale?: Locale
  searchParams?: AppPageParams
  withFooterSpacer?: boolean
}) => {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => (
        <React.Fragment key={index}>{renderBlock({ block, locale, searchParams })}</React.Fragment>
      ))}

      <FooterSpacer enabled={withFooterSpacer} />
    </>
  )
}
