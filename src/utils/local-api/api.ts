import configPromise from '@payload-config'
import { draftMode, headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import { defaultLocale, type Locale } from '@/config/locales'

export const getPayloadApi = async (customOptions?: {
  locale?: Locale
  depth?: number
  isStatic?: boolean // Skip auth/draft checks for static generation
}) => {
  const payloadApi = await getPayload({ config: configPromise })

  // Static generation mode: skip dynamic APIs
  if (customOptions?.isStatic) {
    return {
      payloadApi,
      user: null,
      isDraft: false,
      queryDefaults: {
        overrideAccess: false,
        draft: false,
        locale: customOptions.locale ?? defaultLocale,
        depth: customOptions.depth ?? 2,
      },
    }
  }

  // Runtime mode: full auth and draft support
  const headers = await getHeaders()
  const { user } = await payloadApi.auth({ headers })
  const { isEnabled: isDraft } = await draftMode()
  // Draft mode is only meaningful when the user is authenticated
  const isDraftActive = isDraft && Boolean(user)
  // TODO test: publish then unpublish and serach
  return {
    payloadApi,
    user,
    isDraft: isDraftActive,
    queryDefaults: {
      overrideAccess: false,
      req: { user },
      showHiddenFields: Boolean(user),
      draft: isDraftActive,
      locale: customOptions?.locale ?? defaultLocale,
      depth: customOptions?.depth ?? 2,
    },
  }
}
