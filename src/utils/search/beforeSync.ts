import type { BeforeSync } from '@payloadcms/plugin-search/types'

import { CollectionSlugs } from '@/config/collections'
import type { HeroField } from '@/payload-types'

import { extractContentBlocks, extractFAQsFromBlock } from './sync-helpers/blocks'
import { extractRichTextField } from './sync-helpers/lexical'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
  const collection = searchDoc.doc.relationTo as CollectionSlugs

  if ([CollectionSlugs.Pages].includes(collection)) {
    const heroField = 'hero' in originalDoc ? (originalDoc.hero as HeroField) : null
    const heroRichText = heroField
      ? heroField.slide
          ?.map((slide) => extractRichTextField(slide.richText))
          .filter(Boolean)
          .join(' ')
      : ''

    const firstSlideMedia = heroField?.slide?.[0]?.media
    const heroMedia = typeof firstSlideMedia === 'object' ? firstSlideMedia : null
    const heroImageUrl = heroMedia?.thumbnailURL ?? heroMedia?.url ?? undefined
    const heroImageAlt = heroMedia?.alt ?? undefined

    return {
      ...searchDoc,
      title: originalDoc.title,
      description: originalDoc.description,
      collections: collection,
      slug: originalDoc.slug,
      _status: originalDoc._status,
      heroImageUrl,
      heroImageAlt,
      heroRichText,
      faqBlock: extractFAQsFromBlock(originalDoc.layout),
      contentBlock: extractContentBlocks(originalDoc.layout),
    }
  }

  return searchDoc
}
