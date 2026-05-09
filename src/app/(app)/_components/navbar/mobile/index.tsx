'use client'

import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { useNavbarContext } from '@/contexts/NavbarContext/context'
import { useDictionary } from '@/i18n/context'
import { Button } from '@/sha/button'

import Logo from '../../logo/logo'

const variants = {
  enter: (dir: number) => ({
    opacity: 0,
    rotate: dir * 90,
    scale: 0.8,
  }),
  center: {
    opacity: 1,
    rotate: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    rotate: -dir * 90,
    scale: 0.8,
  }),
}

export const NavbarMobile = ({ logoHref }: { logoHref: string }) => {
  const { showMobileMenu, toggleMobileMenu } = useNavbarContext()
  const t = useDictionary()

  return (
    <div className="relative z-[60] flex h-[72px] w-full items-center justify-between desktop:hidden">
      <div className="relative left-2 md:left-4">
        <Logo href={logoHref} />
      </div>
      <Button
        variant={null}
        size={'icon'}
        className="relative right-4 gap-0 p-6 [&_svg]:pointer-events-none [&_svg]:size-10 [&_svg]:shrink-0"
        onClick={toggleMobileMenu}
        aria-label={showMobileMenu ? t.NavbarMobile.closeMobileMenu : t.NavbarMobile.openMobileMenu}
        aria-expanded={showMobileMenu}
      >
        <BurgerMenu isOpen={showMobileMenu} />
      </Button>
    </div>
  )
}

const BurgerMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <AnimatePresence initial={false} custom={isOpen ? 1 : -1}>
      {isOpen ? (
        <motion.div
          key="close"
          custom={1}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <X size={20} />
        </motion.div>
      ) : (
        <motion.div
          key="open"
          custom={-1}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Menu size={20} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
