import configPromise from '@payload-config'
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config: configPromise })
  const draft = await draftMode()
  const token = request.cookies.get('payload-token')?.value
  const path = request.nextUrl.searchParams.get('path')

  if (!path) return new Response('No path provided', { status: 404 })
  if (!token) {
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  let user: string | JwtPayload | undefined
  try {
    user = jwt.verify(token, payload.secret)
  } catch (err) {
    const previewError = err instanceof Error ? err : new Error(String(err))
    payload.logger.error({ err: previewError }, 'Error verifying token for live preview')
    draft.disable()
    return new Response('Invalid preview token', { status: 403 })
  }

  if (!user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  draft.enable()
  redirect(path)
}
