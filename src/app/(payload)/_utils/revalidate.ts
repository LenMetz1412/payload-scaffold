import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'
import type { CollectionSlugs } from '@/config/collections'
import { locales } from '@/config/locales'
import type { Page } from '@/payload-types'
import { getLocalizedPath } from '@/utils/i18n/path'

export const createRevalidateDocHook = (
  collection: CollectionSlugs,
): CollectionAfterChangeHook<Page> => {
  const revalidatePage: CollectionAfterChangeHook<Page> = ({
    doc,
    previousDoc,
    req: { payload, headers },
  }) => {
    if (headers.has('x-skip-revalidate')) return

    if (doc._status === 'published') {
      for (const l of locales) {
        const { path } = getLocalizedPath({
          collection,
          doc,
          locale: l,
        })

        payload.logger.info(`Revalidating page at path: ${path}`)
        revalidatePath(path)
      }
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      for (const l of locales) {
        const { path: oldPath } = getLocalizedPath({
          collection,
          doc: previousDoc,
          locale: l,
        })

        payload.logger.info(`Revalidating old page at path: ${oldPath}`)
        revalidatePath(oldPath)
      }
    }

    return doc
  }

  return revalidatePage
}
