import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { DEFAULT_APP_ROUTE_COLLECTION } from '@/config/collections'
import { defaultLocale } from '@/config/locales'
import {
  getCollectionByLocalizedSlug,
  getCollectionLocalizedLabels,
} from '@/utils/i18n/collections'
import { validateLocale, validateStringParam } from '@/utils/qs'

export const useCollectionByRouteFragment = () => {
  const params = useParams()

  const collection = useMemo(() => {
    const collectionOrDocSlug =
      validateStringParam(params.collectionOrDocSlug) ?? DEFAULT_APP_ROUTE_COLLECTION

    const locale = validateLocale(params.locale) ?? defaultLocale
    const collection =
      getCollectionByLocalizedSlug(collectionOrDocSlug, locale) ?? DEFAULT_APP_ROUTE_COLLECTION

    return {
      collection,
      labels: getCollectionLocalizedLabels({ collection }),
    }
  }, [params])

  return collection
}
