import configPromise from '@payload-config'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { GlobalCollectionSlugs } from '@/config/collections/globals'

async function getAccessToken(): Promise<string | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({
      slug: GlobalCollectionSlugs.AppSettings,
      depth: 0,
      overrideAccess: true,
    })
    if (settings?.instagram?.accessToken) return settings.instagram.accessToken
  } catch {}
  return process.env.INSTAGRAM_ACCESS_TOKEN ?? null
}

export async function GET(request: NextRequest) {
  const count = Math.min(Number(request.nextUrl.searchParams.get('count') ?? 6), 24)

  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json({ error: 'No Instagram access token configured.' }, { status: 503 })
  }

  const url = new URL('https://graph.instagram.com/me/media')
  url.searchParams.set('fields', 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp')
  url.searchParams.set('limit', String(count))
  url.searchParams.set('access_token', token)

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) {
    const err = await res.text()
    console.error('[/api/instagram/feed] Instagram API error:', err)
    return NextResponse.json({ error: 'Instagram API error' }, { status: 502 })
  }

  const json = await res.json()
  return NextResponse.json(json.data ?? [])
}
