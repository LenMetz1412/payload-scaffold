import { NextResponse } from 'next/server'
import { getLocalizedPath } from '@/utils/i18n/path'
import { getCachedDocument } from '@/utils/local-api/document'
import { getCollectionOrDefaultCollectionDoc } from '@/utils/page'
import type { BaseRoutingParams } from '@/utils/qs'
import { parseQueryParams, validateLocale, validateStringParam } from '@/utils/qs'

type Params = BaseRoutingParams & {
  targetLocale?: string | string[] | undefined
}

/**
 * Handles GET requests to fetch localized paths for documents.
 *
 * @param request - The incoming request object.
 * @returns A NextResponse containing the localized path or an error.
 */
export const GET = async (request: Request): Promise<NextResponse> => {
  try {
    // Parse query parameters from the request URL
    const params = parseQueryParams<Params>(request.url)

    // Validate the locale and target locale
    const locale = validateLocale(params.locale)
    const targetLocale = validateLocale(params.targetLocale)
    const slug = validateStringParam(params.slug)

    // Return null if locale or targetLocale is missing
    if (!locale || !targetLocale) return NextResponse.json(null)

    // Validate the collection or document slug
    const collectionOrDocSlug = validateStringParam(params.collectionOrDocSlug)
    if (!collectionOrDocSlug) return NextResponse.json(`/${targetLocale}`)

    // Fetch the collection and document based on locale and slug
    const { collection, doc } = await getCollectionOrDefaultCollectionDoc({
      locale,
      collectionOrDocSlug,
    })

    let docId = doc?.id

    if (!docId && slug) {
      // If docId is not found, try to find the localized document ID
      const localizeDoc = await getCachedDocument({
        collection,
        locale,
        slug,
        depth: 0,
      })
      docId = localizeDoc?.id
    }

    // If a document ID is found, fetch its data in the target locale
    if (docId) {
      const docData = await getCachedDocument({
        collection,
        locale: targetLocale,
        slug: docId,
        depth: 0,
      })

      if (docData) {
        // Return the localized path for the found document
        return NextResponse.json(
          getLocalizedPath({ collection, doc: docData, locale: targetLocale }).path,
        )
      }
    }

    return NextResponse.json(getLocalizedPath({ collection, locale: targetLocale }).path)
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
