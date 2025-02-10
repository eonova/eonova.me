import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/base'

function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-9 p-0 rounded-full outline-0 focus-visible:outline-none border-0 cursor-pointer duration-200"
          aria-label="切换日夜间"
          data-testid="theme-toggle"
        >
          <SunIcon className="size-4 dark:hidden" />
          <MoonIcon className="hidden size-4 dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl border bg-white/90 dark:bg-black/90  dark:border-white/5 text-sm/6 text-black dark:text-white transition duration-100 ease-out" align="end">
        <DropdownMenuItem
          className="group flex w-full items-center gap-2 rounded-lg py-2 px-3 data-[focus]:bg-black/10 dark:data-[focus]:bg-white/10 during-200 cursor-pointer"
          onClick={() => {
            setTheme('light')
          }}
          data-testid="theme-light-button"
        >
          <SunIcon className="size-4" />
          {' '}
          日间模式
        </DropdownMenuItem>
        <DropdownMenuItem
          className="group flex w-full items-center gap-2 rounded-lg py-2 px-3 data-[focus]:bg-black/10 dark:data-[focus]:bg-white/10 during-200 cursor-pointer"
          onClick={() => {
            setTheme('dark')
          }}
          data-testid="theme-dark-button"
        >
          <MoonIcon className="size-4" />
          夜间模式
        </DropdownMenuItem>
        <DropdownMenuItem
          className="group flex w-full items-center gap-2 rounded-lg py-2 px-3 data-[focus]:bg-black/10 dark:data-[focus]:bg-white/10 during-200 cursor-pointer"
          onClick={() => {
            setTheme('system')
          }}
          data-testid="theme-system-button"
        >
          <MonitorIcon className="size-4" />
          {' '}
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeSwitcher
