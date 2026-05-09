'use client'

import type { ReactNode } from 'react'

import type { Locale } from '@/config/locales'
import { NavbarProvider, useNavbarContext } from '@/contexts/NavbarContext/context'
import { Sheet } from '@/sha/sheet'

import { NavbarDesktop } from './desktop'
import { NavbarMobile } from './mobile'
import { NavbarMenuMobile } from './mobile/menu'

export const NavbarClient = ({ locale, footer }: { locale: Locale; footer: ReactNode }) => {
  return (
    <NavbarProvider locale={locale}>
      <NavbarUi footer={footer} />
    </NavbarProvider>
  )
}

const NavbarUi = ({ footer }: { footer: ReactNode }) => {
  const { showMobileMenu } = useNavbarContext()

  return (
    <header
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex w-full flex-col"
      id="appNavbar"
    >
      <section className="pointer-events-auto relative z-50 h-[72px] w-full content-center bg-nav px-0 pt-0 text-nav-foreground lg:pr-8">
        <div className="flex h-full content-center">
          <NavbarDesktop />
          <NavbarMobile logoHref="/" />
        </div>
      </section>

      {/* Mount-Ziel fürs Hero-Logo */}
      <div id="hero-logo-root" className="pointer-events-none fixed inset-0 z-40" aria-hidden />

      <section className="relative z-40 size-full">
        <div id="sheet-root" className="pointer-events-auto relative z-40"></div>
        <Sheet open={showMobileMenu}>
          <NavbarMenuMobile footer={footer} />
        </Sheet>
      </section>
    </header>
  )
}
