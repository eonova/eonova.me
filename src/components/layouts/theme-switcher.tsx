import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '~/components/base'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/base/dropdown-menu'
import '~/styles/page/theme-switcher.css'

function ThemeSwitcher() {
  const { setTheme } = useTheme()
  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleThemeChange = (theme: string, e?: React.MouseEvent) => {
    const x = e?.clientX ?? window.innerWidth // 默认从右上角开始
    const y = e?.clientY ?? 0

    // 兼容不支持 View Transitions API 的情况
    if (!document.startViewTransition || isReducedMotion()) {
      setTheme(theme)
      return
    }

    const willDark = theme === 'dark'
    const transition = document.startViewTransition(() => {
      setTheme(theme)
    })

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

      document.documentElement.animate(
        {
          clipPath: willDark ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: willDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-8 cursor-pointer rounded-full border-0 p-0 outline-0 duration-200 focus-visible:outline-none sm:size-9"
          aria-label="切换主题"
          data-testid="theme-toggle"
        >
          <SunIcon className="size-5 transition-transform duration-300 sm:size-4 dark:hidden" />
          <MoonIcon className="hidden size-5 transition-transform duration-300 sm:size-4 dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => handleThemeChange('light', e)}
          data-testid="theme-light-button"
          className="flex items-center gap-2"
        >
          <SunIcon className="size-4" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleThemeChange('dark', e)}
          data-testid="theme-dark-button"
          className="flex items-center gap-2"
        >
          <MoonIcon className="size-4" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleThemeChange('system', e)}
          data-testid="theme-system-button"
          className="flex items-center gap-2"
        >
          <MonitorIcon className="size-4" />
          系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeSwitcher
