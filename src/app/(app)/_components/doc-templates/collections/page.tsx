import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/components/heros/RenderHero'
import { defaultLocale } from '@/config/locales'
import type { Page } from '@/payload-types'

import type { DocTemplateProps } from '../common'

type heroProps = Page['hero'] & {
  theme: 'dark' | 'light' | undefined
}

export const PageTemplate = (props: DocTemplateProps) => {
  const { doc, searchParams, locale = defaultLocale } = props
  const page = doc as Page

  const { hero, layout } = page
  return (
    <article>
      <div className="sticky top-0 z-0">
        <RenderHero {...(hero as heroProps)} locale={locale} />
      </div>
      <div className="relative z-[1] bg-background">
        <RenderBlocks blocks={layout} searchParams={searchParams} locale={locale} />
      </div>
    </article>
  )
}
