'use client'

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <Menu>
      <MenuButton
        className="size-8 sm:size-9 p-0 inline-flex justify-center items-center"
        aria-label="Toggle theme"
        data-testid="theme-toggle"
        title="Toggle theme"
      >
        <span className="sr-only">Toggle theme</span>
        <SunIcon className="size-6 sm:size-4 dark:hidden" />
        <MoonIcon className="hidden size-6 sm:size-4 dark:block" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="relative z-50 w-30 origin-top-right rounded-xl border bg-white/90 dark:bg-black/90  dark:border-white/5 p-1 text-sm/6 text-black dark:text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <Button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10 dark:data-[focus]:bg-white/10"
            onClick={() => {
              setTheme('light')
            }}
          >
            <SunIcon className="size-4 fill-white/30" />
            日间模式
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10 dark:data-[focus]:bg-white/10"
            onClick={() => {
              setTheme('dark')
            }}
          >
            <MoonIcon className="size-4 fill-white/30" />
            夜间模式
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10 dark:data-[focus]:bg-white/10"
            onClick={() => {
              setTheme('system')
            }}
          >
            <MonitorIcon className="size-4 fill-white/30" />
            跟随系统
          </Button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default ThemeToggle
