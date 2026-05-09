'use client'

import { useEffect, useState, useTransition } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { SEARCH_TERM_MIN_LENGTH } from '@/utils/search/base'
import type { SearchDocsQueryOptions, SearchDocWithMatch } from '@/utils/search/search-docs'
import { searchDocs } from '@/utils/search/search-docs'

export const useSearchDocs = (
  searchTerm: string,
  queryOptions: SearchDocsQueryOptions,
  debounce = 500,
) => {
  const [searchResults, setSearchResults] = useState<SearchDocWithMatch[]>([])
  const [isPending, startTransition] = useTransition()
  const debouncedSearchTerm = useDebounce(searchTerm, debounce)

  const { locale, draft, limit } = queryOptions

  useEffect(() => {
    const controller = new AbortController()

    if (debouncedSearchTerm.length >= SEARCH_TERM_MIN_LENGTH) {
      searchDocs(debouncedSearchTerm, { locale, draft, limit }, controller.signal)
        .then((docs) => {
          if (!controller.signal.aborted) {
            startTransition(() => {
              setSearchResults(docs)
              console.debug(docs)
            })
          }
        })
        .catch((error) => {
          if (error.name !== 'AbortError' && !controller.signal.aborted) {
            startTransition(() => {
              setSearchResults([])
            })
          }
        })
    } else {
      setSearchResults([])
    }

    return () => {
      controller.abort()
    }
  }, [debouncedSearchTerm, locale, draft, limit])

  return { searchResults, isLoading: isPending, debouncedSearchTerm }
}
