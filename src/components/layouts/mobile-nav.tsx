'use client'

import { MenuIcon } from 'lucide-react'
import { Button } from '~/components/base'
import { useNav } from '~/stores/nav'

function MobileNav() {
  const navStore = useNav()
  return (
    <>
      <Button
        variant="ghost"
        className="flex size-8 cursor-pointer items-center justify-center rounded-full p-0 duration-200 md:hidden md:size-9"
        type="button"
        aria-label="Toggle menu"
        onClick={navStore.setIsVisible}
      >
        <span className="sr-only">Toggle menu</span>
        <MenuIcon className="size-5" />
      </Button>
    </>
  )
}

export default MobileNav
