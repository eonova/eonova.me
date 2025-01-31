'use client'

import { Button } from '@headlessui/react'
import { MenuIcon } from 'lucide-react'

function MobileNav() {
  return (
    <Button
      className="flex size-8 sm:size-9 items-center justify-center p-0 sm:hidden"
      type="button"
      aria-label="Toggle menu"
    >
      <span className="sr-only">Toggle menu</span>
      <MenuIcon className="size-6" />
    </Button>

  )
}

export default MobileNav
