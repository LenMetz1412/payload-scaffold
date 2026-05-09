import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import type { BaseDocument } from '@/utils/base-document'
import { getLocalizedPath } from '@/utils/i18n/path'

// Nach dem Upgrade liefert das Link-Node-Objekt nur relationTo + value (ohne collectionSlug)
// wodurch unser alter Check immer scheiterte.
export const internalDocToHref = ({
  linkNode,
  locale,
}: {
  linkNode: SerializedLinkNode
  locale: Locale
}) => {
  const docField = linkNode.fields.doc
  if (!docField) return '/'

  const relationTo = docField.relationTo as CollectionSlugs | undefined
  const value = docField.value
  const doc = value && typeof value === 'object' ? (value as BaseDocument | null) : null

  if (!relationTo || !doc) return '/'

  const { path } = getLocalizedPath({
    collection: relationTo,
    doc,
    locale,
  })

  return path || '/'
}
