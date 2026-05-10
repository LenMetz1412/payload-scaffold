'use client'

import { useNavbarContext } from '@/contexts/NavbarContext/context'
import type { NavItemEntry } from '@/contexts/NavbarContext/items'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/sha/navigation-menu'
import { cn } from '@/utils/cn'

import Logo from '../../logo/logo'
import { NavItemLink } from '../shared/link'
import { useIsCurrentNavItem } from '../shared/use-is-current'

export const NavbarMenuDesktop = () => {
  const { items } = useNavbarContext()

  return (
    <div className="flex items-center justify-between">
      <div className="flex h-full w-full items-center gap-2 xl:gap-8">
        <div className="flex h-18 items-center lg:pl-4">
          <Logo href="/" />
        </div>
        <div className="flex h-full items-center justify-end">
          {items.slice(1).map((item) =>
            item.subItems && item.subItems.length > 0 ? (
              <NavMenuItem key={item.id} item={item} />
            ) : (
              <NavItemLink key={item.id} item={item} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export const NavMenuItem = ({ item }: { item: NavItemEntry }) => {
  const isCurrent = useIsCurrentNavItem(item)
  return (
    <NavigationMenu>
      <NavigationMenuList className="bg-none">
        <NavigationMenuItem className="bg-none">
          <NavigationMenuTrigger
            hover="underline"
            className={cn('bg-none text-lg', {
              'bg-primary text-primary-foreground': isCurrent,
            })}
          >
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-50 flex-col gap-0.5 p-3">
              {item.subItems?.map((subItem) => (
                <li key={subItem.id}>
                  <NavigationMenuLink asChild>
                    <NavItemLink item={subItem} />
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
