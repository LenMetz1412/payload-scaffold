'use client'

import { SearchBar } from '@/components/search'
import { useNavbarContext } from '@/contexts/NavbarContext/context'
import { useMediaQuery } from '@/hooks/use-media-query'

import { SecondaryNav } from '../../secondary-nav'
import { NavbarMenuDesktop } from './menu'

export const NavbarDesktop = () => {
  const { locale } = useNavbarContext()

  const isWide = useMediaQuery('wideDesktop')

  const position = isWide ? 'left' : 'below'

  return (
    <nav className="hidden w-full justify-between desktop:flex">
      <NavbarMenuDesktop />

      <div className="flex items-center gap-2">
        <SearchBar locale={locale} variant="collapsible" position={position} />
        <SecondaryNav locale={locale} placement="navbar" />
      </div>
    </nav>
  )
}
