import type { Viewport } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import SignInDialog from '~/components/layouts/internal/sign-in-dialog'
import Hello from '~/components/shared/hello'
import { ErrorBoundaryMonitor, PerformanceMonitor } from '~/components/shared/performance-monitor'
import { cn } from '~/utils'
import Providers from '../providers'
import '~/styles/globals.css'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
      )}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Hello />
          <PerformanceMonitor />
          <ErrorBoundaryMonitor children={children} />
          <SignInDialog />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
