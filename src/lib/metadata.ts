import type { Metadata } from 'next'

import { deepmerge } from '@fastify/deepmerge'

import { MY_NAME, OG_IMAGE_HEIGHT, OG_IMAGE_TYPE, OG_IMAGE_WIDTH, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from '~/config/constants'

import { getBaseUrl } from '~/utils/get-base-url'

type Options = {
  root?: boolean
  pathname?: string
  title: string
  description: string
  locale: string
} & Partial<Metadata>

export function createMetadata(options: Options): Metadata {
  const { root = false, pathname, title, description, locale, ...rest } = options
  const baseUrl = getBaseUrl()

  const resolvedTitle = root ? title : `${title} | ${SITE_NAME}`
  const resolvedOGImageUrl = '/og'

  const currentUrl = `${baseUrl}${resolvedOGImageUrl}`

  return deepmerge()(
    {
      title: resolvedTitle,
      description,
      creator: MY_NAME,
      manifest: `${baseUrl}/site.webmanifest`,
      keywords: SITE_KEYWORDS,
      alternates: {
        canonical: currentUrl,
      },
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
      authors: {
        name: MY_NAME,
        url: baseUrl,
      },
      openGraph: {
        title: resolvedTitle,
        description,
        url: currentUrl,
        siteName: MY_NAME,
        type: 'website',
        locale,
        images: [
          {
            url: resolvedOGImageUrl,
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            type: OG_IMAGE_TYPE,
          },
        ],
      },
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
    },
    rest,
  )
}
