import type { SidebarLink } from '~/config/admin-sidebar-links'

import { SidebarMenuItem, SidebarMenuButton } from '~/components/base'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type AdminNavLinkProps = SidebarLink

function AdminNavLink(props: AdminNavLinkProps) {
  const { titleKey, url, icon: Icon } = props
  const pathname = usePathname()
  const isActive = url === pathname

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={url}>
          <Icon />
          <span>{titleKey}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default AdminNavLink
