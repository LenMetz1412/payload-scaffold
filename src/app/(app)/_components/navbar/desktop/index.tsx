'use client'

import { SearchBar } from '@/components/search'
import { useNavbarContext } from '@/contexts/NavbarContext/context'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/sha/navigation-menu'
import Logo from '../../logo/logo'
import { SecondaryNav } from '../../secondary-nav'
import { NavItemLink } from '../shared/link'
import { MegaMenuItem } from './menu'

export const NavbarDesktop = () => {
  const { locale, items } = useNavbarContext()
  return (
    <NavigationMenu className="hidden w-full max-w-none justify-start desktop:flex text-white">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        {/* Left: logo + nav items */}
        <div className="flex items-center gap-6 lg:pl-2">
          <Logo href={`/${locale}`} />
          <NavigationMenuList className="gap-2">
            {items.map((item) =>
              item.subItems && item.subItems.length > 0 ? (
                <MegaMenuItem key={item.id} item={item} />
              ) : (
                <NavigationMenuItem key={item.id}>
                  <NavItemLink item={item} />
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </div>

        {/* Right: search + actions */}
        <div className="flex items-center gap-2">
          <div className="w-75">
            <SearchBar locale={locale} />
          </div>
          <SecondaryNav locale={locale} placement="navbar" />
        </div>
      </div>
    </NavigationMenu>
  )
}
