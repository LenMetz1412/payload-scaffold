import { SearchIcon, XIcon } from 'lucide-react'
import { forwardRef, useCallback } from 'react'

import { useDictionary } from '@/i18n/context'
import { Input } from '@/sha/input'
import { cn } from '@/utils/cn'
import { sanitizeFormInput } from '@/utils/sanitize'

export const SearchInput = forwardRef<
  HTMLInputElement,
  {
    searchTerm: string
    setSearchTerm: (term: string) => void
    onFocus?: () => void
    onBlur?: () => void
    className?: string
  }
>(({ searchTerm, setSearchTerm, onFocus, onBlur, className }, ref) => {
  const t = useDictionary()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeFormInput(e.target.value)
      setSearchTerm(sanitized)
    },
    [setSearchTerm],
  )

  const handleClear = useCallback(() => {
    setSearchTerm('')
  }, [setSearchTerm])

  return (
    <div className="h-9 w-full overflow-hidden">
      <div
        className={cn(
          'flex h-full items-center gap-2 border border-gray-300 rounded-lg bg-transparent px-3 text-accent',
          className,
        )}
      >
        <SearchIcon size={16} className="shrink-0 text-white" aria-hidden="true" />
        <Input
          ref={ref}
          value={searchTerm}
          placeholder={t.search.placeholder}
          className="flex-1 border-0 text-inherit shadow-none outline-none placeholder:text-white focus-visible:ring-0 focus-visible:[box-shadow:none]"
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="flex size-5! shrink-0 items-center justify-center p-0! text-white shadow-none"
          onClick={handleClear}
          aria-label={t.search.clear}
        >
          <XIcon size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
})

SearchInput.displayName = 'SearchInput'
