'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef } from 'react'

import { HighlightMatch } from '@/components/search/highlight'
import { CollectionSlugs } from '@/config/collections'
import { defaultLocale, type Locale } from '@/config/locales'
import { useDictionary } from '@/i18n/context'
import { cn } from '@/utils/cn'
import { DOC_KEY_FIELDS, type SearchDocWithMatch } from '@/utils/search/search-docs'

export type SearchResultsListOnSelectItem = (doc: SearchDocWithMatch) => void

export const SearchResultsList = ({
  searchResults,
  searchTerm,
  isLoadingText,
  noResultsText,
  isLoading,
  adminMode,
  locale,
  isMobile,
  onSelectItem,
}: {
  searchResults: SearchDocWithMatch[]
  searchTerm: string
  isLoadingText?: string
  noResultsText?: string
  isLoading?: boolean
  adminMode?: boolean
  locale?: Locale
  isMobile?: boolean
  onSelectItem: SearchResultsListOnSelectItem
}) => {
  const hasResults = searchResults.length > 0
  const showList = isLoading || searchTerm.length > 2
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [])

  return (
    <AnimatePresence>
      {showList && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'absolute top-full mt-2 max-w-full overflow-hidden border bg-white font-sans shadow-lg',
            adminMode ? 'left-0' : 'right-0',
            isMobile ? 'w-search md:max-w-search' : 'w-searchResults md:max-w-searchResults',
          )}
        >
          <ul
            ref={listRef}
            className="m-0 max-h-[70vh] w-full list-none overflow-auto overscroll-contain p-0"
          >
            {isLoading && !hasResults ? (
              <SearchResultPlaceholder placeholderText={isLoadingText} />
            ) : hasResults ? (
              searchResults.map((doc) => (
                <SearchResultItem
                  key={doc.id}
                  doc={doc}
                  searchTerm={searchTerm}
                  onSelect={() => onSelectItem(doc)}
                  adminMode={adminMode}
                  locale={locale}
                />
              ))
            ) : (
              <SearchResultPlaceholder placeholderText={noResultsText} />
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const SearchResultItem = ({
  doc,
  searchTerm,
  adminMode,
  locale = defaultLocale,
  onSelect,
}: {
  doc: SearchDocWithMatch
  searchTerm: string
  adminMode?: boolean
  locale?: Locale
  onSelect: () => void
}) => {
  const t = useDictionary()

  const collectionTagMap: Partial<Record<string, string>> = {
    [CollectionSlugs.Pages]: t.collectionsTags.pages,
  }

  const localizedCollection = collectionTagMap[doc.collections]

  const collectionTag = adminMode ? doc.collections : localizedCollection

  const showSlug = useMemo(() => {
    if (adminMode) return true
    const otherKeys = DOC_KEY_FIELDS.filter((k) => k !== 'slug')

    return (
      !!doc.searchMatch.matchedIn.slug &&
      !otherKeys.some((field) => doc.searchMatch.matchedIn[field])
    )
  }, [doc, adminMode])

  const matchedInKeyFields = useMemo(
    () => DOC_KEY_FIELDS.some((field) => doc.searchMatch.matchedIn[field]),
    [doc],
  )

  const matchedInRest = useMemo(
    () =>
      Object.entries(doc.searchMatch.matchedIn).some(
        ([field, value]) =>
          value && !DOC_KEY_FIELDS.includes(field as (typeof DOC_KEY_FIELDS)[number]),
      ),
    [doc],
  )

  return (
    <li
      className="group m-0 flex cursor-pointer flex-col gap-2 border-b px-6 pb-4 pt-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      onClick={onSelect}
    >
      {/* <div className="italic">
        Score: {doc.searchMatch.score}
        {'-'}
        {Object.entries(doc.searchMatch.matchedIn)
          .filter(([_, matched]) => matched)
          .map(([field]) => field)
          .join(', ')}
      </div> */}

      <div className="w-full">
        <HighlightMatch
          text={doc.title}
          term={searchTerm}
          matched={matchedInKeyFields}
          className="text-[1.25em] font-semibold leading-tight text-black group-hover:text-accent-foreground"
        />

        {showSlug && <HighlightMatch text={doc.slug} term={searchTerm} className="truncate" />}
      </div>

      <HighlightMatch
        text={doc.searchMatch.displayText}
        term={searchTerm}
        className="w-full"
        matched={matchedInRest}
        maxLength={180}
      />

      {!!collectionTag?.length && (
        <span className="inline-block self-start whitespace-nowrap rounded-full bg-neutral-200 px-2 leading-tight text-black/80">
          {collectionTag}
        </span>
      )}
    </li>
  )
}

const SearchResultPlaceholder = ({ placeholderText }: { placeholderText?: string }) => {
  if (!placeholderText?.length) return null
  return <li className="cursor-default select-none px-6 py-2 text-sm">{placeholderText}</li>
}
