import configPromise from '@payload-config'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { GlobalCollectionSlugs } from '@/config/collections/globals'

/**
 * Cron route — refreshes the Instagram long-lived access token.
 *
 * Vercel invokes this via vercel.json every 30 days.
 * The request must include the Authorization header:
 *   Authorization: Bearer <CRON_SECRET>
 *
 * The refreshed token is saved back to AppSettings so the
 * SocialFeedBlock always reads a valid token from the database.
 */
export async function GET(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Read current token ────────────────────────────────────────────
  const payload = await getPayload({ config: configPromise })

  const settings = await payload.findGlobal({ slug: GlobalCollectionSlugs.AppSettings, depth: 0 })
  const currentToken: string | null = settings?.instagram?.accessToken ?? null

  if (!currentToken) {
    return NextResponse.json(
      { error: 'No Instagram access token stored in AppSettings.' },
      { status: 400 },
    )
  }

  // ── Call Instagram refresh endpoint ───────────────────────────────
  const refreshUrl = new URL('https://graph.instagram.com/refresh_access_token')
  refreshUrl.searchParams.set('grant_type', 'ig_refresh_token')
  refreshUrl.searchParams.set('access_token', currentToken)

  const res = await fetch(refreshUrl.toString())
  if (!res.ok) {
    const body = await res.text()
    payload.logger.error({ body }, '[cron] Instagram token refresh failed')
    return NextResponse.json({ error: 'Instagram API error', detail: body }, { status: 502 })
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  const newToken = data.access_token
  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()

  // ── Persist refreshed token ───────────────────────────────────────
  await payload.updateGlobal({
    slug: GlobalCollectionSlugs.AppSettings,
    data: {
      instagram: {
        accessToken: newToken,
        tokenExpiresAt: expiresAt,
        lastRefreshedAt: new Date().toISOString(),
      },
    },
  })

  payload.logger.info(`[cron] Instagram token refreshed. Expires at ${expiresAt}`)
  return NextResponse.json({ ok: true, expiresAt })
}
