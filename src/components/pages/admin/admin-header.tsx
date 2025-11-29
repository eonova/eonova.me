'use client'

import { HomeIcon } from 'lucide-react'
import router from 'next/router'
import { Button } from '~/components/base/button'
import { SidebarTrigger } from '~/components/base/sidebar'
import ThemeSwitcher from '~/components/layouts/theme-switcher'

function AdminHeader() {
  const goToHome = () => {
    router.push('/')
  }
  return (
    <header className="flex items-center justify-between py-4">
      <SidebarTrigger variant="outline" />
      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <Button
          variant="ghost"
          className="relative size-8 cursor-pointer rounded-full border-0 p-0 outline-0 duration-200 focus-visible:outline-none sm:size-9"
          aria-label="返回首页"
          data-testid="go-home-button"
          onClick={goToHome}
        >
          <HomeIcon className="size-5 duration-300 sm:size-4" />
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader
