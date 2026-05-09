import type { FieldHook } from 'payload'
import slugify from 'slugify'

export const formatSlug = (val: string): string =>
  slugify(val, { lower: true, strict: true, trim: true, locale: 'de' })

export const formatSlugHook =
  (fallback: string): FieldHook =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return formatSlug(value)
    }

    if (operation === 'create' || !data?.slug) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value
  }
