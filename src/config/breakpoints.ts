export const layoutScreens = {
  sm: '40rem',
  md: '48rem',
  lg: '69rem',
  xl: '80rem',
  '2xl': '86rem',
  desktop: '82rem',
} as const

export const mediaBreakpoints = {
  phoneMax: '57.875rem', // 926px
  mobileMax: layoutScreens.desktop, // 1312px
  wideDesktopMin: '113.75rem', // 1820px
} as const

export const mediaQueries = {
  phone: `(max-width: ${mediaBreakpoints.phoneMax})`,
  mobile: `(max-width: ${mediaBreakpoints.mobileMax})`,
  wideDesktop: `(min-width: ${mediaBreakpoints.wideDesktopMin})`,
} as const
