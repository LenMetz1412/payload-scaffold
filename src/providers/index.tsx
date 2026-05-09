import type React from 'react'

import { HeroThemeProvider } from '@/contexts/HeroThemeContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <HeroThemeProvider>{children}</HeroThemeProvider>
}
