import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '~/components/base'
import '~/styles/page/theme-switcher.css'

function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()
  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleToggle = (e: React.MouseEvent) => {
    const willDark = resolvedTheme !== 'dark'
    const x = e?.clientX || window.innerWidth // 默认从右上角开始
    const y = e?.clientY || 0

    // 兼容不支持 View Transitions API 的情况
    if (!document.startViewTransition || isReducedMotion()) {
      setTheme(willDark ? 'dark' : 'light')
      return
    }

    const transition = document.startViewTransition(() => {
      setTheme(willDark ? 'dark' : 'light')
    })

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]

      document.documentElement.animate(
        {
          clipPath: willDark ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: willDark
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)',
        },
      )
    })
  }

  return (
    <Button
      variant="ghost"
      className="size-8 sm:size-9 p-0 rounded-full outline-0 focus-visible:outline-none border-0 cursor-pointer duration-200 relative"
      aria-label="切换日夜间"
      data-testid="theme-toggle"
      onClick={handleToggle}
    >
      <SunIcon data-testid="theme-light-button" className="size-5 sm:size-4 dark:hidden transition-transform duration-300" />
      <MoonIcon data-testid="theme-dark-button" className="hidden size-5 sm:size-4 dark:block transition-transform duration-300" />
    </Button>
  )
}

export default ThemeSwitcher
