'use client'

import { SearchBar } from '@/components/search'
import { useNavbarContext } from '@/contexts/NavbarContext/context'

import { SecondaryNav } from '../../secondary-nav'
import { NavbarMenuDesktop } from './menu'

export const NavbarDesktop = () => {
  const { locale } = useNavbarContext()

  return (
    <nav className="hidden w-full justify-between desktop:flex">
      <NavbarMenuDesktop />

      <div className="flex items-center gap-2">
        <div className="w-75">
          <SearchBar locale={locale} />
        </div>
        <SecondaryNav locale={locale} placement="navbar" />
      </div>
    </nav>
  )
}
