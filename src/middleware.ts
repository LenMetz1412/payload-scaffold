import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { defaultLocale, locales } from '@/config/locales'

const LOCALE_COOKIE = 'i18nlang'

function getLocale(request: NextRequest): string {
  if (request.cookies.has(LOCALE_COOKIE)) {
    const value = request.cookies.get(LOCALE_COOKIE)!.value
    if ((locales as readonly string[]).includes(value)) return value
  }
  const acceptLang = request.headers.get('Accept-Language')
  if (!acceptLang) return defaultLocale

  const headers = { 'accept-language': acceptLang }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/next') ||
    pathname.startsWith('/endpoints') ||
    pathname.startsWith('/styles') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/data')
  ) {
    return NextResponse.next()
  }

  if (pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|geojson)$/)) {
    return NextResponse.next()
  }

  if (pathname.includes('.')) {
    return new NextResponse(null, { status: 404 })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`MIDDLEWARE :: ${pathname}`)
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale || defaultLocale}${pathname}`
  const response = NextResponse.redirect(request.nextUrl)
  response.cookies.set(LOCALE_COOKIE, locale, { path: '/', sameSite: 'lax' })
  return response
}

export const config = {
  matcher: ['/((?!_next|api|admin|next|styles|fonts|data|endpoints).*)', '/', '/(de|en)/:path*'],
}
