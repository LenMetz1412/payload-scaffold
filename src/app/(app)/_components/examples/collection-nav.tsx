import Link from 'next/link'

import type { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import type { LocalizedPathParams } from '@/utils/i18n/path'
import { getLocalizedPath } from '@/utils/i18n/path'
import { getCachedDocuments } from '@/utils/local-api/documents'

interface CollectionNavProps {
  locale: Locale
  collection: CollectionSlugs
}

export const CollectionNav = async (props: CollectionNavProps) => {
  const { locale, collection } = props

  const { path: indexPath, label: indexLabel } = getLocalizedPath({
    locale,
    collection,
  })

  const data = await getCachedDocuments({
    collection,
    locale,
  })

  return (
    <div>
      <h1 className="mb-4 pb-4 uppercase">
        <Link href={indexPath}>{indexLabel}</Link>
      </h1>
      <ul>
        {data.map((doc) => (
          <CollectionNavItem key={doc.id} {...{ collection, doc, locale }} />
        ))}
      </ul>
    </div>
  )
}

const CollectionNavItem = (params: LocalizedPathParams) => {
  const { path, label } = getLocalizedPath(params)
  return (
    <li>
      <Link href={path}>{label}</Link>
    </li>
  )
}
