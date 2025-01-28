'use client'

import { Button } from '@headlessui/react'
import { Link, MenuIcon } from 'lucide-react'
import { HEADER_LINKS } from '~/config/links'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../base/dropdown-menu'

function MobileNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex size-9 items-center justify-center p-0 sm:hidden"
          type="button"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle menu</span>
          <MenuIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {HEADER_LINKS.map(link => (
          <DropdownMenuItem key={link.text} asChild>
            <Link href={link.href} className="flex items-center gap-4">
              {link.icon}
              <p>{link.text}</p>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileNav
