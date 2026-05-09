import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocTemplate } from '@/app/components/doc-templates'
import { DEFAULT_APP_ROUTE_COLLECTION } from '@/config/collections'
import type { Locale } from '@/config/locales'
import { locales } from '@/config/locales'
import { getDocSlugOrId } from '@/utils/docHelpers'
import { getPageMeta } from '@/utils/get-page-meta'
import { queryDocuments } from '@/utils/local-api/documents'
import { getCollectionOrDefaultCollectionDoc } from '@/utils/page'
import { normalizeLocalizedPageParams } from '@/utils/qs'

type Params = Promise<{
  locale: Locale
  collectionOrDocSlug: string
}>

export default async function CollectionIndex({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await params
  const filterParams = await searchParams

  // console.log('[collectionOrDocSlug]::', rawParams)

  const pageParams = normalizeLocalizedPageParams(rawParams)
  const { collection, doc } = await getCollectionOrDefaultCollectionDoc(pageParams)

  if (!doc) return notFound()

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
  const defaultRootCollectionParams = await Promise.all(
    locales.map(async (locale) => {
      const docs = await queryDocuments({
        collection: DEFAULT_APP_ROUTE_COLLECTION,
        locale,
        isStatic: true,
      })

      return docs.map((doc) => ({
        locale,
        collectionOrDocSlug: getDocSlugOrId(doc),
      }))
    }),
  )

  return defaultRootCollectionParams.flat()
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const rawParams = await params
  const pageParams = normalizeLocalizedPageParams(rawParams)
  const { locale } = pageParams
  const { collection, doc } = await getCollectionOrDefaultCollectionDoc(pageParams, true)
  return await getPageMeta({ locale, collection, doc, isStatic: true })
}
