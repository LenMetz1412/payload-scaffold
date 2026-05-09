import qs from 'qs'
import type { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'

import { normalizeStringForComparison } from '../sanitize'
import { COLLECTION_PRIORITIES, getSearchWords, SEARCHABLE_QUERY_LIMIT } from './base'
import { STOP_WORDS } from './stop-words'

// plugin doesn't support server-side scoring !!!!!!!!!!!!!!!!!!
export interface SearchDoc {
  id: string
  collections: string
  excludeFromSearch?: boolean
  title: string
  description: string
  credits: string
  subCredits: string
  slug: string
  heroRichText?: string
  contentBlockField?: { cols: { text: string }[] }[]
  faqBlockField?: { question?: string; answer?: string }[]
  doc: { relationTo: string; value: string; id: string }
}

export interface SearchMatch {
  score: number
  matchedIn: {
    title: boolean
    slug: boolean
    description: boolean
    heroRichText: boolean
    contentBlock: boolean
    faq: boolean
    credits: boolean
    subCredits: boolean
  }
  displayText: string
  displayField: string | null
}

export interface SearchDocWithMatch extends SearchDoc {
  searchMatch: SearchMatch
}

export interface SearchDocsQueryOptions {
  locale: Locale
  draft?: boolean
  limit?: number
}

export const DOC_KEY_FIELDS = ['title', 'slug'] as const

type MatchType = 'exact' | 'word-boundary' | 'fuzzy' | null

function createMatcherFunctions(searchWords: string[], term: string) {
  function getMatchType(text: string | undefined): MatchType {
    const normalized = normalizeStringForComparison(text)
    if (!normalized) return null

    const normText = normalized
      .replace(/[-\u2013\u2014_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    const normTerm = term
      .replace(/[-\u2013\u2014_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (normText === normTerm) return 'exact'

    if (
      searchWords.every((word, i) => {
        const isLast = i === searchWords.length - 1
        const isPartialInput = isLast && searchWords.length > 1
        const words = normText.split(/\s+/)
        const prevWordIdx = i === 0 ? -1 : words.findIndex((w) => w === searchWords[i - 1])
        return words
          .slice(prevWordIdx + 1)
          .some((w) => (isPartialInput ? w.startsWith(word) : w === word))
      })
    )
      return 'word-boundary'

    if (normText.includes(normTerm)) return 'fuzzy'
    return null
  }

  return {
    matches: (text?: string): boolean => {
      return getMatchType(text) !== null
    },

    exactMatch: (text?: string): boolean => {
      return getMatchType(text) === 'exact'
    },

    hasWordBoundaryMatch: (text?: string): boolean => {
      const matchType = getMatchType(text)
      return matchType === 'exact' || matchType === 'word-boundary'
    },

    matchesWithLevel: (
      text: string | undefined,
      level: 'exact' | 'word-boundary' | 'fuzzy',
    ): boolean => {
      const matchType = getMatchType(text)
      if (!matchType) return false

      if (level === 'exact') return matchType === 'exact'
      if (level === 'word-boundary') return matchType === 'exact' || matchType === 'word-boundary'
      return true // fuzzy
    },
  }
}

function getSearchMatch(doc: SearchDoc, searchTerm: string, _now: Date): SearchMatch {
  const term = normalizeStringForComparison(searchTerm)
  const searchWords = getSearchWords(term ?? '')

  if (!term) {
    return {
      score: Infinity,
      matchedIn: {
        title: false,
        slug: false,
        description: false,
        heroRichText: false,
        contentBlock: false,
        faq: false,
        credits: false,
        subCredits: false,
      },
      displayText: '',
      displayField: null,
    }
  }

  const { matches, exactMatch, hasWordBoundaryMatch, matchesWithLevel } = createMatcherFunctions(
    searchWords,
    term,
  )

  const matchedIn = {
    title: matches(doc.title),
    slug: matches(doc.slug),
    description: matches(doc.description),
    heroRichText: matches(doc.heroRichText),
    contentBlock: (doc.contentBlockField || []).some((block) =>
      block.cols.some((col) => matches(col.text)),
    ),
    faq: (doc.faqBlockField || []).some((f) => matches(f.question) || matches(f.answer)),
    credits: matchesWithLevel(doc.credits, 'word-boundary'),
    subCredits: matchesWithLevel(doc.subCredits, 'word-boundary'),
  }

  const keyFieldValues = DOC_KEY_FIELDS.map((field) => doc[field])

  const hasExactMatchInKeyFields = keyFieldValues.some((field) => exactMatch(field))
  const hasWordBoundaryInKeyFields = keyFieldValues.some((field) => hasWordBoundaryMatch(field))
  const hasKeyFieldMatch = DOC_KEY_FIELDS.some((field) => matchedIn[field])

  let score = 6

  if (hasExactMatchInKeyFields) {
    score = 0
  } else if (hasWordBoundaryInKeyFields) {
    score = 1
  } else if (hasKeyFieldMatch) {
    score = 2
  } else if (matchedIn.description || matchedIn.heroRichText || matchedIn.contentBlock || matchedIn.faq) {
    score = 3
  } else if (matchedIn.credits) {
    score = 4
  } else if (matchedIn.subCredits) {
    score = 5
  }

  let displayText = ''
  let displayField: string | null = null

  if (!hasKeyFieldMatch) {
    const displayFieldPriority = [
      { field: 'description' as const, matched: matchedIn.description, format: (v: string) => v },
      { field: 'credits' as const, matched: matchedIn.credits, format: (v: string) => v },
      { field: 'subCredits' as const, matched: matchedIn.subCredits, format: (v: string) => v },
      { field: 'heroRichText' as const, matched: matchedIn.heroRichText, format: (v: string) => v || '' },
    ]

    for (const { field, matched, format } of displayFieldPriority) {
      if (matched && doc[field]) {
        displayText = format(doc[field])
        displayField = field
        break
      }
    }

    if (!displayField && matchedIn.contentBlock) {
      const matchedText = (doc.contentBlockField || [])
        .flatMap((block) => block.cols.map((col) => col.text))
        .find((text) => matches(text))
      displayText = matchedText || ''
      displayField = 'contentBlock'
    }

    if (!displayField && matchedIn.faq) {
      const matchedFaq = (doc.faqBlockField || []).find(
        (f) => matches(f.question) || matches(f.answer),
      )
      if (matchedFaq) {
        displayText = matches(matchedFaq.question) ? matchedFaq.question || '' : matchedFaq.answer || ''
      }
      displayField = 'faq'
    }
  }

  // if (doc.title === 'Ran an die Macht: KlimaKneipe mit Martin Oetting')
  //   console.log({
  //     id: doc.id,
  //     doc,
  //     normalized: normalizeStringForComparison(doc.frameTitle),
  //     searchWords,
  //     term,
  //     score,
  //     matchedIn,
  //     displayText,
  //     displayField,
  //     hasWordBoundaryInKeyFields,
  //   })

  return { score, matchedIn, displayText, displayField }
}

export async function searchDocs(
  search: string,
  options: SearchDocsQueryOptions,
  signal?: AbortSignal,
): Promise<SearchDocWithMatch[]> {
  const { locale, draft = true, limit = SEARCHABLE_QUERY_LIMIT } = options
  const normalizedSearch = normalizeStringForComparison(search) ?? ''

  const searchWords = getSearchWords(normalizedSearch)

  if (!searchWords.length || STOP_WORDS.has(normalizedSearch)) {
    return []
  }

  const results: SearchDocWithMatch[] = []
  const seenIds = new Set<string>()

  const getSortedResults = () =>
    results
      .sort((a, b) => {
        // sort by search match score
        if (a.searchMatch.score !== b.searchMatch.score) {
          return a.searchMatch.score - b.searchMatch.score
        }

        // sort by collection
        const priorityA = COLLECTION_PRIORITIES[a.collections as CollectionSlugs] ?? 999
        const priorityB = COLLECTION_PRIORITIES[b.collections as CollectionSlugs] ?? 999
        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }

        return 0
      })
      .slice(0, limit)

  const fetchAndAdd = async (fields: string[]) => {
    const remaining = limit - results.length
    if (remaining <= 0) return

    const queryObj = {
      where: {
        and: [
          {
            or: fields.map((field) => ({
              and: searchWords.map((word) => ({
                [field]: { like: word },
              })),
            })),
          },
          { excludeFromSearch: { not_equals: true } },
          ...(draft ? [] : [{ _status: { equals: 'published' } }]),
        ],
      },
      locale,
      ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      limit: 0,
    }

    const response = await fetch(`/api/search?${qs.stringify(queryObj)}`, { signal })
    const data = await response.json()

    ;(data?.docs || []).forEach((doc: SearchDoc) => {
      if (!seenIds.has(doc.id)) {
        const searchMatch = getSearchMatch(doc, search, new Date())
        if (Object.values(searchMatch.matchedIn).some((matched) => matched)) {
          results.push({
            ...doc,
            searchMatch,
          })
          seenIds.add(doc.id)
        }
      }
    })
  }

  await fetchAndAdd([...DOC_KEY_FIELDS])
  if (results.length >= limit) return getSortedResults()

  await fetchAndAdd([
    'description',
    'heroRichText',
    'faqBlockField.question',
    'faqBlockField.answer',
    'contentBlockField.cols.text',
  ])
  if (results.length >= limit) return getSortedResults()

  await fetchAndAdd(['credits', 'subCredits'])

  return getSortedResults()
}

