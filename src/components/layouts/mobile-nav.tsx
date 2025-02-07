'use client'

import { Button } from '@headlessui/react'
import { MenuIcon } from 'lucide-react'
import { useNav } from '~/stores/nav'

function MobileNav() {
  const navStore = useNav()
  return (
    <>
      <Button
        className="flex size-8 md:size-9 items-center justify-center p-0 md:hidden"
        type="button"
        aria-label="Toggle menu"
        onClick={navStore.setIsVisible}
      >
        <span className="sr-only">Toggle menu</span>
        <MenuIcon className="size-6" />
      </Button>
    </>

  )
}

export default MobileNav
