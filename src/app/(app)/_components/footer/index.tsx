import Image from 'next/image'
import type { DataFromGlobalSlug } from 'payload'

import { CMSLink } from '@/components/Link'
import { GlobalCollectionSlugs } from '@/config/collections/globals'
import type { GenericMediaCollection } from '@/config/collections/media'
import type { Locale } from '@/config/locales'
import { getDictionary } from '@/i18n'
import { getMediaSrc } from '@/utils/get-url'
import { getCachedGlobalCollection } from '@/utils/local-api/global'
import { isValidMedia } from '@/utils/media'

export const AppFooter = async ({
  locale,
  withBackgroundImage = true,
  showLogo = true,
  navPlacement = 'footer',
}: {
  locale: Locale
  withBackgroundImage?: boolean
  showLogo?: boolean
  navPlacement?: 'navbar' | 'footer'
}) => {
  const footer = (await getCachedGlobalCollection({
    slug: GlobalCollectionSlugs.Footer,
    locale,
    depth: 2,
  })) as DataFromGlobalSlug<GlobalCollectionSlugs.Footer>

  const t = await getDictionary(locale)
  const { sections, backgroundFooterImage, claimText } = footer
  // const backgroundImage = getMediaAsBackgroundUrl(backgroundFooterImage, withBackgroundImage)
  const backgroundMedia =
    withBackgroundImage && isValidMedia(backgroundFooterImage)
      ? (backgroundFooterImage as GenericMediaCollection)
      : null
  const backgroundImageSrc = backgroundMedia ? getMediaSrc(backgroundMedia) : undefined

  return (
    <section
      // className="min-h-[45vh] bg-cover bg-center pb-6 pt-16 lg:px-8 lg:pt-20"
      // style={{
      //   backgroundImage,
      // }}
      className="relative min-h-[45vh] overflow-hidden pb-6 pt-16 lg:px-8 lg:pt-20"
    >
      {backgroundImageSrc && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundImageSrc}
            alt="Footer image"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      )}
      <footer className="container mb-10 mt-16 p-0 pl-4 lg:px-4">
        <div className="grid grid-cols-2 gap-8 gap-y-16 text-base lg:grid-cols-5 lg:gap-12">

          {sections?.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <ul className="space-y-4">
                {section.links?.map(({ link }, linkIdx: number) => (
                  <li key={linkIdx} className="font-medium">
                    <CMSLink
                      {...link}
                      appearance={'inline'}
                      type={link.url ? 'custom' : 'reference'}
                      locale={locale}
                    />
                  </li>
                ))}

              </ul>
            </div>
          ))}
        </div>
      </footer>
    </section>
  )
}
