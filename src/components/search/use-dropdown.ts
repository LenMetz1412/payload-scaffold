import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

interface UseDropdownControlResult {
  isSearchOpen: boolean
  searchCtnRef: RefObject<HTMLDivElement | null>
  searchInputRef: RefObject<HTMLInputElement | null>

  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
}

export function useCollapsableSearch({
  resetSearch,
  isMobile,
}: {
  resetSearch: () => void
  isMobile?: boolean
}): UseDropdownControlResult {
  const searchCtnRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const closeSearch = useCallback(() => {
    resetSearch()
    setIsSearchOpen(false)
  }, [resetSearch])

  const openSearch = useCallback(() => setIsSearchOpen(true), [])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => {
      const next = !prev
      if (!next) resetSearch()
      return next
    })
  }, [resetSearch])

  useEffect(() => {
    if (!isSearchOpen) return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const refs = [searchCtnRef]
      const isOutside = refs.every((ref) => ref.current && !ref.current.contains(target))

      if (isOutside) {
        closeSearch()
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeSearch()
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isSearchOpen, closeSearch])

  useEffect(() => {
    if (isSearchOpen && !isMobile) return searchInputRef.current?.focus()
    searchInputRef.current?.blur()
  }, [isSearchOpen, isMobile])

  return {
    isSearchOpen,
    searchCtnRef,
    searchInputRef,
    openSearch,
    closeSearch,
    toggleSearch,
  }
}
