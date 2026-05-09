import { env } from '@env'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'

import { Providers } from '@/providers'
import { cn } from '@/utils/cn'

import { Navbar } from '../_components/navbar'
import { DraftModeControls } from '../_components/payload/draft-mode-controls'
import { Sans, Serif } from '../_styles/fonts'

import '../globals.css'

import { getDictionary } from '@/i18n'
import { DictionaryProvider } from '@/i18n/context'
import { isValidLocale } from '@/utils/qs'

import { AppFooter } from '../_components/footer'

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_META_TITLE,
  applicationName: env.NEXT_PUBLIC_META_NAME,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}
interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  if (!isValidLocale(locale)) return notFound()
  const dictionary = await getDictionary(locale)

  return (
    <html className={cn(Sans.variable, Serif.variable)} lang={locale} suppressHydrationWarning>
      <body>
        <DictionaryProvider dictionary={dictionary}>
          <Providers>
            <Navbar locale={locale} />
            <main className="pt-[72px]">{children}</main>
            <AppFooter locale={locale} />
            <DraftModeControls />
          </Providers>
        </DictionaryProvider>
      </body>
    </html>
  )
}
