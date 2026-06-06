import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Locale } from '@/config/locales'
import type { FaqBlock as FaqBlockProps } from '@/payload-types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/sha/accordion'

type FaqItem = NonNullable<FaqBlockProps['faqs']>[number]
type RawLogoItem = NonNullable<FaqItem['logos']>[number]
type LogoItem = RawLogoItem & { logo: NonNullable<RawLogoItem['logo']> }

const buildLogos = (logos?: FaqItem['logos']): LogoItem[] =>
  (logos ?? []).filter((logo): logo is LogoItem => Boolean(logo.logo))

const LogoGrid = ({ logos, locale }: { logos: LogoItem[]; locale: Locale }) => {
  if (logos.length === 0) return null

  const logoSizes = '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'

  return (
    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">
      {logos.map((logoItem, logoIndex) => {
        const key = logoItem.id ?? logoIndex

        return (
          <div key={key} className="group h-full">
            <div className="relative mx-auto aspect-[3/2] w-full max-w-[16rem] overflow-hidden sm:max-w-[20rem] md:max-w-full">
              <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
                {logoItem.url ? (
                  <CMSLink
                    type="custom"
                    url={logoItem.url}
                    locale={locale}
                    appearance="inline"
                    className="relative block h-full w-full"
                  >
                    <Media
                      resource={logoItem.logo}
                      fill
                      className="relative h-full w-full"
                      customCSS="relative h-full w-full"
                      imgClassName="object-contain object-center"
                      size={logoSizes}
                    />
                  </CMSLink>
                ) : (
                  <Media
                    resource={logoItem.logo}
                    fill
                    className="relative h-full w-full"
                    customCSS="relative h-full w-full"
                    imgClassName="object-contain object-center"
                    size={logoSizes}
                  />
                )}
              </div>
            </div>

            {logoItem.text && (
              <RichText
                data={logoItem.text}
                enableGutter={false}
                className="mt-2 w-full pl-2 text-left text-sm sm:pl-4"
                locale={locale}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export const FaqBlock: React.FC<FaqBlockProps & { locale: Locale }> = (props) => {
  const { title, faqs, locale } = props
  const faqItems = faqs ?? []

  return (
    <div className="container my-6 first:mt-14 lg:my-16">
      <div className="grid grid-cols-4 gap-x-16 gap-y-2 md:gap-y-4 lg:grid-cols-12">
        {title && (
          <div className="col-span-4 lg:col-span-12">
            <RichText data={title} enableGutter={false} className={'mb-2'} locale={locale} />
          </div>
        )}
        <div className="col-span-4 lg:col-span-9">
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => {
              const logos = buildLogos(item.logos)
              if (!item.question) return null

              const itemId = item.id ?? `faq-item-${index}`

              return (
                <AccordionItem key={itemId} value={itemId} className="mt-3 first:mt-0">
                  <AccordionTrigger
                    keepTriggerInView
                    className="h-auto whitespace-normal pb-8 pl-0 text-left font-sans text-lg lg:text-[1.25rem] 2xl:text-[1.4375rem]"
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="mb-6 mt-4 space-y-6 lg:space-y-8">
                    {item.answer && <RichText data={item.answer} locale={locale} />}

                    {item.enableLink && item.link && (
                      <CMSLink {...item.link} size="column" className="mt-4" locale={locale} />
                    )}

                    <LogoGrid logos={logos} locale={locale} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
