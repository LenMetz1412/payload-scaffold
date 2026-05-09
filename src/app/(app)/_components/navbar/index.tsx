import type { Locale } from '@/config/locales'

import { AppFooter } from '../footer'
import { NavbarClient } from './index.client'

// footer must be server
export const Navbar = ({ locale }: { locale: Locale }) => (
  <NavbarClient
    locale={locale}
    footer={
      <AppFooter
        locale={locale}
        withBackgroundImage={false}
        showLogo={false}
        navPlacement="navbar"
      />
    }
  />
)
