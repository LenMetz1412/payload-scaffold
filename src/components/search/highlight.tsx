import { Fragment, memo, useMemo } from 'react'

import { normalizeStringForComparison } from '@/utils/sanitize'
import { getSearchWords } from '@/utils/search/base'

const normalizeDashes = (str: string) =>
  str
    .replace(/[-\u2013\u2014_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const HighlightMatch = memo(
  ({
    text,
    term,
    className = '',
    maxLength = 80,
    matched,
  }: {
    text: string
    term: string
    className?: string
    maxLength?: number
    matched?: boolean
  }) => {
    const searchWords = useMemo(() => {
      const normalized = normalizeStringForComparison(term) ?? ''
      return getSearchWords(normalizeDashes(normalized))
    }, [term])

    const { snippet, hasStart, hasEnd } = useMemo(() => {
      if (searchWords.length === 0 || text.length <= maxLength) {
        return { snippet: text, hasStart: false, hasEnd: false }
      }

      const isSlugLike = !text.includes(' ') && text.includes('-')
      const separator = isSlugLike ? '-' : ' '
      const separatorRegex = isSlugLike ? /-/ : /\s+/
      const words = text.split(separatorRegex)

      const matchIndices = words
        .map((word, idx) => ({
          idx,
          matches: searchWords.some((searchWord) =>
            normalizeDashes(word.toLowerCase()).startsWith(searchWord.toLowerCase()),
          ),
        }))
        .filter((w) => w.matches)
        .map((w) => w.idx)

      if (matchIndices.length === 0) {
        let length = 0
        let endIndex = 0
        for (let i = 0; i < words.length; i++) {
          length += words[i].length + (i > 0 ? separator.length : 0)
          if (length > maxLength) break
          endIndex = i + 1
        }
        return {
          snippet: words.slice(0, endIndex).join(separator),
          hasStart: false,
          hasEnd: endIndex < words.length,
        }
      }

      const matchIndex = matchIndices[0]
      let start = matchIndex
      let end = matchIndex + 1
      let currentLength = words[matchIndex].length

      while (start > 0 || end < words.length) {
        const canExpandLeft = start > 0
        const canExpandRight = end < words.length
        if (!canExpandLeft && !canExpandRight) break

        const leftCost = canExpandLeft ? separator.length + words[start - 1].length : Infinity
        const rightCost = canExpandRight ? separator.length + words[end].length : Infinity

        if (leftCost <= rightCost && currentLength + leftCost <= maxLength) {
          start--
          currentLength += leftCost
        } else if (rightCost < leftCost && currentLength + rightCost <= maxLength) {
          end++
          currentLength += rightCost
        } else if (currentLength + leftCost <= maxLength) {
          start--
          currentLength += leftCost
        } else if (currentLength + rightCost <= maxLength) {
          end++
          currentLength += rightCost
        } else {
          break
        }
      }

      return {
        snippet: words.slice(start, end).join(separator),
        hasStart: start > 0,
        hasEnd: end < words.length,
      }
    }, [text, searchWords, maxLength])

    const parts = useMemo(() => {
      if (!searchWords.length) return [{ text: snippet, highlight: false, matchLength: 0 }]

      const tokens = snippet.split(/(\s+|[-\u2013\u2014_])/)

      return tokens
        .filter((t) => t.length > 0)
        .map((token) => {
          const normalizedToken = normalizeDashes(token.toLowerCase()).trim()
          const matchedWord = searchWords.find((word) =>
            normalizedToken.startsWith(word.toLowerCase()),
          )
          return {
            text: token,
            highlight: !!matchedWord,
            matchLength: matchedWord ? matchedWord.length : 0,
          }
        })
    }, [searchWords, snippet])

    if (!parts.length) return null
    if (!matched) return <div className={className}>{snippet}</div>

    return (
      <div className={className}>
        {hasStart && '...'}
        {parts.map((part, i) =>
          part.highlight ? (
            <Fragment key={i}>
              <mark className="bg-yellow-200 font-semibold">
                {part.text.slice(0, part.matchLength)}
              </mark>
              <span>{part.text.slice(part.matchLength)}</span>
            </Fragment>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
        {hasEnd && '...'}
      </div>
    )
  },
)

HighlightMatch.displayName = 'HighlightMatch'
