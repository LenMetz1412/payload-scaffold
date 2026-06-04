'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { HighlightMatch } from '@/components/search/highlight'
import { cn } from '@/utils/cn'
import type { SearchDocWithMatch } from '@/utils/search/search-docs'

export type SearchResultsListOnSelectItem = (doc: SearchDocWithMatch) => void

export const SearchResultsList = ({
  searchResults,
  searchTerm,
  isLoadingText,
  noResultsText,
  isLoading,
  adminMode,
  onSelectItem,
}: {
  searchResults: SearchDocWithMatch[]
  searchTerm: string
  isLoadingText?: string
  noResultsText?: string
  isLoading?: boolean
  adminMode?: boolean
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
            'absolute top-full mt-2 w-full overflow-hidden bg-white font-sans shadow-lg rounded-lg',
            adminMode ? 'left-0' : 'right-0',
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
  onSelect,
}: {
  doc: SearchDocWithMatch
  searchTerm: string
  onSelect: () => void
}) => {
  return (
    <li
      className="group m-0 flex cursor-pointer border-b border-gray-200 gap-3 px-6 pb-4 pt-2 text-xs text-muted-foreground hover:bg-gray-300 hover:text-accent-foreground"
      onClick={onSelect}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-gray-100">
        {doc.heroImageUrl && (
          <Image
            src={doc.heroImageUrl}
            alt={doc.heroImageAlt ?? ''}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <HighlightMatch
          text={doc.title}
          term={searchTerm}
          matched
          className="text-[1.25em] font-semibold leading-tight text-black group-hover:text-accent-foreground"
        />
        <HighlightMatch
          text={doc.description}
          term={searchTerm}
          matched
          className="line-clamp-2"
          maxLength={180}
        />
      </div>
    </li>
  )
}

const SearchResultPlaceholder = ({ placeholderText }: { placeholderText?: string }) => {
  if (!placeholderText?.length) return null
  return <li className="cursor-default select-none px-6 py-2 text-sm">{placeholderText}</li>
}
