'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ACCOUNT_SIDEBAR_LINKS } from '~/config/links'
import { cn } from '~/utils/cn'

function AccountSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden min-w-50 md:block">
      <ul className="flex flex-col gap-1">
        {ACCOUNT_SIDEBAR_LINKS.map(link => (
          <li key={link.href}>
            <Link
              href={link.href as any}
              className={cn(
                'block rounded-md px-3 py-2 transition-colors hover:bg-accent',
                pathname === link.href ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AccountSidebar
