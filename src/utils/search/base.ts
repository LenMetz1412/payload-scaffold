// client and sever! do not mix exports/methods

import { CollectionSlugs } from '@/config/collections'

import { STOP_WORDS } from './stop-words'

export const SEARCHABLE_QUERY_LIMIT = 50

export const SEARCH_TERM_MIN_LENGTH = 3

export const COLLECTION_PRIORITIES: Partial<Record<CollectionSlugs, number>> = {
  [CollectionSlugs.Pages]: 1,
} as const

export const getSearchWords = (searchTerm: string) => {
  const words = searchTerm
    .split(/[\s\-–—,;:!?.()[\]{}]+/)
    .filter((word) => word.length >= SEARCH_TERM_MIN_LENGTH)
    .filter((word) => !STOP_WORDS.has(word.toLowerCase()))

  if (!words.length && searchTerm.length >= SEARCH_TERM_MIN_LENGTH) {
    return [searchTerm]
  }

  return words
}
