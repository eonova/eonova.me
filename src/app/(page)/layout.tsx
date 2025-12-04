import type { Metadata, Viewport } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import localFont from 'next/font/local'
import SignInDialog from '~/components/layouts/sign-in-dialog'
import Hello from '~/components/shared/hello'
import { ErrorBoundaryMonitor, PerformanceMonitor } from '~/components/shared/performance-monitor'
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '~/config/constants'
import { cn } from '~/utils'
import Providers from '../providers'
import '~/styles/globals.css'

const dingTalk = localFont({
  src: '../../../public/fonts/DingTalk-JinBuTi.ttf',
  variable: '--font-dingtalk',
  display: 'swap',
})

const dingTalkSans = localFont({
  src: '../../../public/fonts/DingTalk-Sans.ttf',
  variable: '--font-dingtalk-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/favicon/site.webmanifest',
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: '@030Eonova',
    siteId: '1693931091722465280',
    creator: '@030Eonova',
    creatorId: '1693931091722465280',
    images: [
      {
        url: '/images/og.png',
        width: 1200,
        height: 630,
        alt: SITE_DESCRIPTION,
      },
    ],
  },
  keywords: SITE_KEYWORDS,
  creator: 'eonova',
  openGraph: {
    url: SITE_URL,
    type: 'website',
    title: SITE_TITLE,
    siteName: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en-US',
    images: [
      {
        url: '/images/og.png',
        width: 1200,
        height: 630,
        alt: SITE_DESCRIPTION,
        type: 'image/png',
      },
    ],
  },
  icons: {
    icon: '/favicon/favicon.svg',
    shortcut: '/favicon/favicon.svg',
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon/favicon-32x32.png',
      },
    ],
  },
}

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
        dingTalk.variable,
        dingTalkSans.variable,
        'scroll-smooth',
      )}
      suppressHydrationWarning
    >
      <body className="relative antialiased">
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
