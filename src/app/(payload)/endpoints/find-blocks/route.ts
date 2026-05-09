/* eslint-disable @typescript-eslint/no-explicit-any */

////////////////// DEV ONLY ///////////////////////////

import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { parseQueryParams, validateStringParam } from '@/utils/qs'

type Params = {
  blockType?: string | string[] | undefined
  collections?: string | string[] | undefined
}

export const GET = async (request: Request): Promise<NextResponse> => {
  try {
    const params = parseQueryParams<Params>(request.url)
    const blockType = validateStringParam(params.blockType)

    if (!blockType) {
      return NextResponse.json({ error: 'blockType query parameter is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const allCollections = ['pages']

    const collectionsParam = validateStringParam(params.collections)
    const collectionsToCheck = collectionsParam
      ? collectionsParam.split(',').filter((c) => allCollections.includes(c))
      : allCollections

    const results = []

    for (const collectionSlug of collectionsToCheck) {
      try {
        const { docs, totalDocs } = await payload.find({
          collection: collectionSlug as any,
          depth: 0,
          draft: true,
          limit: 10000,
        })

        const matchingDocs = docs.filter((doc: any) => {
          return doc.layout?.some((block: any) => block.blockType === blockType)
        })

        if (matchingDocs.length > 0) {
          results.push({
            collection: collectionSlug,
            count: matchingDocs.length,
            totalDocs,
            docs: matchingDocs.map((d: any) => ({
              id: d.id,
              title: d.title || d.id,
              slug: d.slug,
              updatedAt: d.updatedAt,
              matchingBlocks: d.layout
                ?.filter((block: any) => block.blockType === blockType)
                .map((block: any) => ({
                  blockType: block.blockType,
                  id: block.id,
                })),
            })),
          })
        }
      } catch (error) {
        console.warn(`Could not query ${collectionSlug}:`, error)
      }
    }

    return NextResponse.json({
      blockType,
      totalFound: results.reduce((sum, r) => sum + r.count, 0),
      results,
    })
  } catch (error) {
    console.error('Error finding blocks:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
