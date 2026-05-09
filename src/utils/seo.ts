import type { Metadata } from 'next'
import { env } from 'process'

import type { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import type { HeroField, Media, MetaFieldset } from '@/payload-types'
import type { BaseDocument } from '@/utils/base-document'
import { getLocalizedPath } from '@/utils/i18n/path'

import {
  isRelationPopulated,
  sanitizeHeroMetaImage,
  sanitizeMetaImage,
  sanitizeString,
} from './sanitize'

export type MetaTitleField = string | null | undefined
export type SlugField = BaseDocument['slug']

const {
  NEXT_PUBLIC_SERVER_URL,
  NEXT_PUBLIC_META_NAME,
  NEXT_PUBLIC_META_TITLE,
  NEXT_PUBLIC_META_DESCRIPTION,
  NEXT_PUBLIC_META_TYPE,
} = env

const defaultOpenGraph: Metadata['openGraph'] & { type?: string } = {
  type: NEXT_PUBLIC_META_TYPE,
  description: NEXT_PUBLIC_META_DESCRIPTION,
  siteName: NEXT_PUBLIC_META_NAME,
  title: NEXT_PUBLIC_META_TITLE,
}

export const composeTitle = (title?: MetaTitleField) =>
  [NEXT_PUBLIC_META_NAME, title].filter(Boolean).join(' | ')

export const generateMeta = <T extends BaseDocument>(args: {
  doc: T | null | undefined
  globalMeta?: MetaFieldset
  locale?: Locale
  collection?: CollectionSlugs
}): Promise<Metadata> => {
  return new Promise((resolve) => {
    const { doc, globalMeta, locale, collection } = args
    const meta = { ...globalMeta, ...doc?.meta }
    const hero = doc?.hero

    const title = composeTitle(meta.title)
    const description = meta.description ?? ''

    const ogImage = getDocCoverOrMetaImage({ hero, meta, globalMeta })
    const ogImageUrl = getOgImageUrl(ogImage, NEXT_PUBLIC_SERVER_URL)

    resolve({
      title,
      description,
      openGraph: mergeOpenGraph({
        description,
        images: ogImageUrl
          ? [
              {
                url: ogImageUrl,
              },
            ]
          : undefined,
        title,
        url: getLocalizedPath({
          doc,
          collection: (doc?.collectionSlug ?? collection) as CollectionSlugs | undefined,
          locale,
        }).path,
      }),
    })
  })
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

export const getDocCoverOrMetaImage = ({
  hero,
  meta,
  globalMeta,
}: {
  hero: HeroField | null | undefined
  meta: MetaFieldset | null | undefined
  globalMeta?: MetaFieldset | null | undefined
}) => {
  const heroImg = sanitizeHeroMetaImage(hero)
  const metaImg = sanitizeMetaImage(meta?.customMetaImage)
  const globalMetaImg = sanitizeMetaImage(globalMeta?.customMetaImage)

  const metaImage = metaImg || globalMetaImg
  return (heroImg || metaImage) ?? undefined
}

export const getOgImageUrl = (
  media: string | Media | null | undefined,
  baseUrl?: string,
): string | undefined => {
  if (!isRelationPopulated(media)) return undefined
  const imageUrl = sanitizeString(media.sizes?.og?.url ?? media.url)
  if (!imageUrl) return undefined
  const normalizedUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  return `${baseUrl}${normalizedUrl}`
}
