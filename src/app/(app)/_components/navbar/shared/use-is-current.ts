import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import type { NavItemEntry } from '@/contexts/NavbarContext/items'

export const useIsCurrentNavItem = (item: NavItemEntry) => {
  const currentSlug = usePathname()

  return useMemo(
    () =>
      currentSlug === item.link || item.subItems?.some((subItem) => subItem.link === currentSlug),

    [currentSlug, item],
  )
}
