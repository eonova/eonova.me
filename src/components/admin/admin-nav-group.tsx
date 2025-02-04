'use client'
import type { SidebarGroup as SidebarGroupConfig } from '~/config/admin-sidebar-links'

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '../base/sidebar'
import AdminNavLink from './admin-nav-link'

type AdminNavGroupProps = SidebarGroupConfig

function AdminNavGroup(props: AdminNavGroupProps) {
  const { titleKey, links } = props

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{titleKey}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map(link => (
            <AdminNavLink key={link.titleKey} {...link} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AdminNavGroup
