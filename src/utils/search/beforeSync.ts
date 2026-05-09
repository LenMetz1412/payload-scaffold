import type { BeforeSync } from '@payloadcms/plugin-search/types'

import type { CollectionSlugs } from '@/config/collections'
import type { HeroField } from '@/payload-types'

import { SEARCHABLE_COLLECTIONS } from './base'
import { extractContentBlocks, extractFAQsFromBlock } from './sync-helpers/blocks'
import { extractRichTextField } from './sync-helpers/lexical'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
  const collection = searchDoc.doc.relationTo as CollectionSlugs

  if ([...SEARCHABLE_COLLECTIONS].includes(collection)) {
    const heroField = 'hero' in originalDoc ? (originalDoc.hero as HeroField) : null
    const heroRichText = heroField
      ? heroField.slide
          ?.map((slide) => extractRichTextField(slide.richText))
          .filter(Boolean)
          .join(' ')
      : ''

    return {
      ...searchDoc,
      title: originalDoc.title,
      description: originalDoc.description,
      credits: originalDoc.credits,
      subCredits: originalDoc.subCredits,
      collections: collection,
      slug: originalDoc.slug,
      _status: originalDoc._status,
      excludeFromSearch: originalDoc.excludeFromSearch ?? false,
      heroRichText,
      faqBlockField: extractFAQsFromBlock(originalDoc.layout),
      contentBlockField: extractContentBlocks(originalDoc.layout),
    }
  }

  return searchDoc
}
