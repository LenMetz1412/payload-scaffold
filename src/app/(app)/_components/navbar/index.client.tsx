'use client'

import type { ReactNode } from 'react'

import type { Locale } from '@/config/locales'
import { NavbarProvider, useNavbarContext } from '@/contexts/NavbarContext/context'
import type { NavItemEntry } from '@/contexts/NavbarContext/items'
import { Sheet } from '@/sha/sheet'

import { NavbarDesktop } from './desktop'
import { NavbarMobile } from './mobile'
import { NavbarMenuMobile } from './mobile/menu'

export const NavbarClient = ({
  locale,
  footer,
  navItems,
}: {
  locale: Locale
  footer: ReactNode
  navItems: NavItemEntry[]
}) => {
  return (
    <NavbarProvider locale={locale} items={navItems}>
      <NavbarUi footer={footer} />
    </NavbarProvider>
  )
}

const NavbarUi = ({ footer }: { footer: ReactNode }) => {
  const { showMobileMenu, locale } = useNavbarContext()

  return (
    <header
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex w-full flex-col px-4 pt-3 lg:px-6"
      id="appNavbar"
    >
      <section className="pointer-events-auto relative z-50 w-full rounded-2xl bg-black/50 py-3 text-nav-foreground backdrop-blur-md">
        <div className="flex h-full items-center">
          <NavbarDesktop />
          <NavbarMobile logoHref={`/${locale}`} />
        </div>
      </section>

      <section className="relative z-40 size-full">
        <div id="sheet-root" className="pointer-events-auto relative z-40"></div>
        <Sheet open={showMobileMenu}>
          <NavbarMenuMobile footer={footer} />
        </Sheet>
      </section>
    </header>
  )
}
