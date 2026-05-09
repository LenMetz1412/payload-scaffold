'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { Locale } from '@/config/locales'
import { useMediaQuery } from '@/hooks/use-media-query'

import { getNavItems, type NavItemEntry } from './items'

interface NavbarContextContextType {
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  isMobile: boolean
  locale: Locale
  items: NavItemEntry[]
}

const NavbarContext = createContext<NavbarContextContextType | undefined>(undefined)

export function NavbarProvider({ locale, children }: PropsWithChildren & { locale: Locale }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const _pathname = usePathname()
  const isMobile = useMediaQuery('mobile')

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setShowMobileMenu(false)
  }, [])

  useEffect(() => {
    closeMobileMenu()
  }, [closeMobileMenu])

  useEffect(() => {
    if (!isMobile) closeMobileMenu()
  }, [isMobile, closeMobileMenu])

  useEffect(() => {
    if (!showMobileMenu) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu()
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showMobileMenu, closeMobileMenu])

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showMobileMenu])

  const value = useMemo(
    () => ({
      showMobileMenu,
      setShowMobileMenu,
      toggleMobileMenu,
      closeMobileMenu,
      isMobile,
      locale,
      items: getNavItems(locale),
    }),
    [showMobileMenu, isMobile, toggleMobileMenu, closeMobileMenu, locale],
  )

  return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
}

export function useNavbarContext() {
  const ctx = useContext(NavbarContext)
  if (!ctx) throw new Error('useMobileMenu must be used within a MobileMenuProvider')
  return ctx
}
