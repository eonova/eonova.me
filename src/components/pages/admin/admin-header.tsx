'use client'

import ThemeSwitcher from '~/components//layouts/theme-switcher'
import { SidebarTrigger } from '~/components/base/sidebar'

import AdminProfileDropdown from './admin-profile-dropdown'

function AdminHeader() {
  return (
    <header className="flex items-center justify-between py-4">
      <SidebarTrigger variant="outline" />
      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <AdminProfileDropdown />
      </div>
    </header>
  )
}

export default AdminHeader
