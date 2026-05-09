import type { Locale } from '@/config/locales'
import type { SearchDocWithMatch } from '@/utils/search/search-docs'

export function buildSearchItemHref({
  res,
  locale,
  adminMode = false,
}: {
  res: SearchDocWithMatch
  locale: Locale
  adminMode?: boolean
}): string {
  // Admin href
  if (adminMode) {
    const { relationTo, value } = res.doc
    return `/admin/collections/${relationTo}/${value}`
  }

  // App href
  const slug = res.slug.replace(/^\//, '')
  const base = `/${locale}`

  return res.collections === 'pages' ? `${base}/${slug}` : `${base}/${res.collections}/${slug}`
}
