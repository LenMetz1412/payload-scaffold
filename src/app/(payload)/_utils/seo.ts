import { env } from '@env'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types'
import { CollectionSlugs } from '@/config/collections'
import type { Locale } from '@/config/locales'
import type { HeroField } from '@/payload-types'
import type { BaseDocument } from '@/utils/base-document'
import { getLocalizedPath } from '@/utils/i18n/path'
import { sanitizeHeroMetaImage } from '@/utils/sanitize'
import type { MetaTitleField } from '@/utils/seo'
import { getOgImageUrl } from '@/utils/seo'

// type HeroWithMedia = {
//   type: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact'
//   slide?: {
//     media?:
//       | string
//       | {
//           url?: string
//           sizes?: {
//             og?: {
//               url?: string
//             }
//           }
//         }
//   }[]
// }

export const generateTitle: GenerateTitle<{
  title?: MetaTitleField
}> = ({ doc }) => doc.title ?? ''

export const generateDescription: GenerateDescription<{
  description?: string
}> = ({ doc }) => doc.description ?? ''

export const generateURL: GenerateURL<Omit<BaseDocument, 'id'>> = ({ doc, locale, id }) => {
  const { path } = getLocalizedPath({
    doc: { ...doc, id: id as string },
    collection: doc.collectionSlug as CollectionSlugs | undefined,
    locale: locale as Locale,
  })

  return `${env.NEXT_PUBLIC_SERVER_URL}${path}`
}

// atm not in used, kept only as show case of ev implementation
export const generateImage: GenerateImage<{
  hero: HeroField
}> = ({ doc }) => {
  const media = sanitizeHeroMetaImage(doc.hero)
  const mediaUrl = getOgImageUrl(media, env.NEXT_PUBLIC_SERVER_URL)
  return mediaUrl ?? ''
}

export const initSeoPlugin = (collections?: CollectionSlugs[]) =>
  seoPlugin({
    collections,
    generateTitle,
    generateDescription,
    generateURL,
    generateImage,
    uploadsCollection: CollectionSlugs.Media, // needed to cast uploader image type
  })
