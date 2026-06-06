import { getPayload } from 'payload'
import config from '@payload-config'

import type { Locale } from '@/config/locales'
import type { Media, Page } from '@/payload-types'
import { type FlyoutArticle, type NavItemEntry, getNavItems } from '@/contexts/NavbarContext/items'

import { AppFooter } from '../footer'
import { NavbarClient } from './index.client'

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveLink(
  page: Page | string | null | undefined,
  customUrl: string | null | undefined,
  locale: Locale,
): string {
  if (page && typeof page === 'object') {
    return page.slug ? `/${locale}/${page.slug}` : `/${locale}`
  }
  return customUrl ?? '#'
}

type RawFeaturedArticle = {
  page: string | Page
  overrideTitle?: string | null
  overrideImage?: string | Media | null
  id?: string | null
}

function resolveFeaturedArticles(
  entries: RawFeaturedArticle[] | null | undefined,
  locale: Locale,
): FlyoutArticle[] {
  return (entries ?? []).map((entry) => {
    const page = entry.page as Page
    const overrideImage = entry.overrideImage as Media | null | undefined
    const heroMedia = page.hero?.slide?.[0]?.media as Media | null | undefined
    const imageUrl = overrideImage?.url ?? heroMedia?.sizes?.md?.url ?? heroMedia?.url ?? null
    return {
      id: entry.id ?? page.id,
      title: entry.overrideTitle ?? page.title,
      imageUrl,
      href: resolveLink(page, null, locale),
    }
  })
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchSettings(locale: Locale) {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'appSettings', depth: 2, locale, overrideAccess: true })
}

async function fetchNavItems(locale: Locale): Promise<NavItemEntry[]> {
  try {
    const settings = await fetchSettings(locale)
    const cmsItems = settings.navbar?.items

    if (!cmsItems?.length) return getNavItems(locale)

    return cmsItems.map((item) => ({
      id: item.id ?? item.title,
      title: item.title,
      link: '#', // categories are dropdowns — no direct link
      subItems: item.subItems?.map((sub) => ({
        id: sub.id ?? sub.title,
        title: sub.title,
        description: sub.description ?? undefined,
        link: resolveLink(sub.page as Page | null, sub.customUrl, locale),
      })),
      featuredArticles: resolveFeaturedArticles(item.featuredArticles, locale),
    }))
  } catch {
    return getNavItems(locale)
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export const Navbar = async ({ locale }: { locale: Locale }) => {
  const navItems = await fetchNavItems(locale)

  return (
    <NavbarClient
      locale={locale}
      navItems={navItems}
      footer={
        <AppFooter
          locale={locale}
          withBackgroundImage={false}
          showLogo={false}
          navPlacement="navbar"
        />
      }
    />
  )
}
