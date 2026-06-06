import Image from 'next/image'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import type { DataFromGlobalSlug } from 'payload'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { GlobalCollectionSlugs } from '@/config/collections/globals'
import type { GenericMediaCollection } from '@/config/collections/media'
import type { Locale } from '@/config/locales'
import { getDictionary } from '@/i18n'
import { getMediaSrc } from '@/utils/get-url'
import { getCachedGlobalCollection } from '@/utils/local-api/global'
import { isValidMedia } from '@/utils/media'

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
)

const SOCIAL_PLATFORMS = [
  { key: 'instagram' as const, label: 'Instagram', Icon: Instagram },
  { key: 'linkedin' as const, label: 'LinkedIn', Icon: Linkedin },
  { key: 'facebook' as const, label: 'Facebook', Icon: Facebook },
  { key: 'tiktok' as const, label: 'TikTok', Icon: TikTokIcon },
]

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
  const { topics, socials, backgroundFooterImage, footerText } = footer

  const activeSocials = SOCIAL_PLATFORMS.filter(({ key }) => socials?.[key]?.enabled && socials[key]?.url)
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
      <footer className="container mb-10 p-0 pl-4 pr-4">
        {footerText && (
          <div className="mb-12 text-2xl lg:text-4xl">
            <RichText data={footerText} enableGutter={false} locale={locale} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-8 gap-y-16 text-base text-gray-300 lg:grid-cols-5 lg:gap-12">

          {topics?.map((topic, topicIdx) => (
            <div key={topicIdx}>
              {topic.title && (
                <p className="mb-6 font-sans text-sm uppercase tracking-wider text-white">
                  {topic.title}
                </p>
              )}
              <ul className="space-y-4">
                {topic.links?.map(({ link }, linkIdx: number) => (
                  <li key={linkIdx} className="font-sans text-sm md:text-xl border-b border-gray-300 pb-3 tracking-tighter">
                    <CMSLink
                      {...link}
                      appearance={'footerLink'}
                      type={link.url ? 'custom' : 'reference'}
                      locale={locale}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {activeSocials.length > 0 && (
            <div>
              <p className="mb-6 font-sans text-sm uppercase tracking-wider text-white">
                Social
              </p>
              <ul className="space-y-4">
                {activeSocials.map(({ key, label, Icon }) => (
                  <li key={key} className="border-b border-gray-300 pb-3">
                    <a
                      href={socials![key]!.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-sans text-sm text-gray-300 transition-colors hover:text-white md:text-xl tracking-tighter"
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </footer>
    </section>
  )
}
