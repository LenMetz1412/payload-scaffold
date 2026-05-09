import HeroLogoPortal from '@/app/(app)/_components/logo/HeroLogoPortal'
import Logo from '@/app/(app)/_components/logo/logo'
import { HighImpactHero } from '@/components/heros/HighImpact'
import { LowImpactHero } from '@/components/heros/LowImpact'
import { MediumImpactHero } from '@/components/heros/MediumImpact'
import { NoneHero } from '@/components/heros/None'
import type { Locale } from '@/config/locales'
import { type HeroTheme, HeroThemeProvider } from '@/contexts/HeroThemeContext'
import type { LinkGroupField, Page } from '@/payload-types'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  none: NoneHero,
}

type HeroProps = Page['hero']
export type HeroSlide = NonNullable<Page['hero']['slide']>[number]
export type LinkObject = NonNullable<LinkGroupField>[number]['link']
export type LinkGroupItem = NonNullable<LinkGroupField>[number]

export interface PageHeroProps extends HeroProps {
  locale?: Locale
}

export const RenderHero = (
  props: PageHeroProps & {
    controlsHeroLogo?: boolean
  },
) => {
  const { type, theme, controlsHeroLogo = true } = props

  const HeroToRender = heroes[type]
  const safeTheme: HeroTheme = theme === 'dark' ? 'dark' : 'light'

  return (
    <HeroThemeProvider initTheme={safeTheme}>
      {controlsHeroLogo && (
        <HeroLogoPortal>
          <Logo />
        </HeroLogoPortal>
      )}

      <HeroToRender {...props} />
    </HeroThemeProvider>
  )
}
