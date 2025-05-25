'use client'

import { ADMIN_SIDEBAR_LINKS } from '~/config/admin-sidebar-links'

import { Sidebar, SidebarContent } from '../base/sidebar'
import AdminNavGroup from './admin-nav-group'

function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        {ADMIN_SIDEBAR_LINKS.map(group => (
          <AdminNavGroup key={group.titleKey} {...group} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default AdminSidebar
