import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import localFont from 'next/font/local'
import Script from 'next/script'
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, SITE_URL } from '~/config/constants'
import { env } from '~/lib/env'
import { cn } from '~/lib/utils'
import Providers from './providers'
import ReactScan from './react-scan'
import '~/styles/globals.css'

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
    site: '@tszhong0411',
    siteId: '1152256803746377730',
    creator: '@tszhong0411',
    creatorId: '1152256803746377730',
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
  creator: 'tszhong0411',
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
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable, 'scroll-smooth')}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://unpkg.com/react-scan/dist/install-hook.global.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased relative">
        <Providers>
          {children}
        </Providers>
        {env.REACT_SCAN_MONITOR_API_KEY
          ? (
            <ReactScan apiKey={env.REACT_SCAN_MONITOR_API_KEY} />
          )
          : null}
      </body>
    </html>
  )
}
