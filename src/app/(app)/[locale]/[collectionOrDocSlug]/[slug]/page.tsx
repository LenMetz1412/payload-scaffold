import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocTemplate } from '@/app/components/doc-templates'
import type { CollectionSlugs } from '@/config/collections'
import { localizedCollectionsWithStaticPaths } from '@/config/collections'
import type { Locale } from '@/config/locales'
import { locales } from '@/config/locales'
import { shouldBustDocumentCache } from '@/utils/cache/invalidation'
import { getDocSlugOrId } from '@/utils/docHelpers'
import { getPageMeta } from '@/utils/get-page-meta'
import { getCollectionByLocalizedSlug } from '@/utils/i18n/collections'
import { getCachedDocument } from '@/utils/local-api/document'
import { queryDocuments } from '@/utils/local-api/documents'
import { normalizeLocalizedPageParams } from '@/utils/qs'

interface Params {
  locale: Locale
  collectionOrDocSlug: string
  slug: string
}

type PageParams = Promise<Params>

export default async function Page({
  params,
  searchParams,
}: {
  params: PageParams
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await params
  const filterParams = await searchParams

  // console.log('[slug]::', rawParams)

  const pageParams = normalizeLocalizedPageParams(rawParams)

  const data = await queryCachedDoc(pageParams)
  const { collection, doc } = data ?? {}
  if (!data || !collection || !doc) notFound()

  return (
    <DocTemplate
      collection={collection}
      doc={doc}
      locale={pageParams.locale}
      searchParams={filterParams}
    />
  )
}

export async function generateStaticParams() {
  const allDocsPromises = (Object.entries(localizedCollectionsWithStaticPaths) as [string, Record<Locale, string>][]).flatMap(
    async ([collection, localizedSlugs]) => {
      const collectionParams = await Promise.all(
        locales.map(async (locale) => {
          const collectionSlug = localizedSlugs[locale]
          const docs = await queryDocuments({
            collection: collection as CollectionSlugs,
            locale,
            isStatic: true,
          })

          return docs.map((doc) => ({
            locale,
            collectionOrDocSlug: collectionSlug,
            slug: getDocSlugOrId(doc),
          }))
        }),
      )
      return collectionParams.flat()
    },
  )

  const paramsList = await Promise.all(allDocsPromises)
  return paramsList.flat()
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const rawParams = await params
  const pageParams = normalizeLocalizedPageParams(rawParams)
  const { locale, collectionOrDocSlug } = pageParams
  const collection = getCollectionByLocalizedSlug(collectionOrDocSlug, locale)
  const data = await queryCachedDoc(pageParams, true)
  return await getPageMeta({ doc: data?.doc, locale, collection, isStatic: true })
}

const queryCachedDoc = async (
  { collectionOrDocSlug, slug, locale }: Params,
  isStatic?: boolean,
) => {
  const collection = getCollectionByLocalizedSlug(collectionOrDocSlug, locale)
  // console.log('isEnabled ///////////////////// ', isEnabled)
  if (!collection) return null

  // First, check if we need to bust cache by slug
  const bustCacheBySlug = shouldBustDocumentCache(collection, slug)

  // Fetch document (with cache busting if needed)
  const doc = await getCachedDocument(
    {
      collection,
      locale,
      slug,
      depth: 3,
      bustCache: bustCacheBySlug,
    },
    isStatic,
  )

  if (!doc) return null

  // If we didn't bust cache by slug, check if we need to bust by ID
  if (!bustCacheBySlug) {
    const bustCacheById = shouldBustDocumentCache(collection, doc.id)
    if (bustCacheById) {
      console.log(`Cache invalidation detected for ${collection}:${doc.id}, fetching fresh data`)

      // Fetch again with cache busting to get fresh data
      const freshDoc = await getCachedDocument(
        {
          collection,
          locale,
          slug,
          depth: 3,
          bustCache: true,
        },
        isStatic,
      )
      return { doc: freshDoc, collection }
    }
  }

  return { doc, collection }
}
