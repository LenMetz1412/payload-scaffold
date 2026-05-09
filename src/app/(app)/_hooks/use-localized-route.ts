import { useParams } from 'next/navigation'
import useSWRImmutable from 'swr/immutable'

import type { Locale } from '@/config/locales'
import { ApiEndpoints, getEndpoint } from '@/utils/rest/endpoints'
import { swrCmsDataFetcher } from '@/utils/rest/fetcher'

/**
 * Custom hook to retrieve a localized route based on parameters and target locale.
 *
 * @param enabled - A flag to determine if the fetching is enabled.
 * @param targetLocale - The locale to which the route should be localized.
 * @returns The localized route as a string or the root path if not available.
 */

export const useLocalizedRoute = ({
  enabled,
  targetLocale,
}: {
  enabled?: boolean
  targetLocale: Locale
}): string => {
  const params = useParams()

  const { data } = useSWRImmutable<string | null>(
    enabled
      ? getEndpoint(ApiEndpoints.LOCALIZED_PATH, {
          ...params,
          targetLocale,
        })
      : null,
    swrCmsDataFetcher,
  )

  return data ?? '/'
}
