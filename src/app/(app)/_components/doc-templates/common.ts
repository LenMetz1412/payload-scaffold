import type { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import type { BaseDocument } from '@/utils/base-document'
import type { AppPageParams } from '@/utils/page'

export interface DocTemplateProps {
  collection: CollectionSlugs
  doc: BaseDocument
  searchParams?: AppPageParams
  locale?: Locale
}
