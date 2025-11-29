import type { NextConfig } from 'next'
import { createContentCollectionPlugin as createMDX } from '@content-collections/next'
import createPWA from '@ducanh2912/next-pwa'
import bundleAnalyzer from '@next/bundle-analyzer'
import { IS_PRODUCTION } from './src/config/constants'
import { env } from './src/lib/env'

process.title = 'Eonova (NextJS)'

const withMDX = createMDX({
  configPath: './content.config.ts',
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = createPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  extendDefaultRuntimeCaching: true,
  cacheOnFrontEndNav: true,
  workboxOptions: {
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15MB limit
    exclude: [
      /\.map$/,
      /manifest$/,
      /\.htaccess$/,
      /service-worker\.js$/,
      /sw\.js$/,
      /workbox-.*\.js$/,
    ],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
          },
        },
      },
    ],
  },
})

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
  },
  {
    protocol: 'https',
    hostname: '**.googleusercontent.com',
  },
  {
    protocol: 'https',
    hostname: 'neodb.social',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
  {
    protocol: 'https',
    hostname: 'minio.mythsman.com',
  },
  {
    protocol: 'https',
    hostname: 'lain.bgm.tv',
  },
  {
    protocol: 'https',
    hostname: 'img.eonova.me',
  },
]

if (!IS_PRODUCTION) {
  remotePatterns.push({
    protocol: 'http',
    hostname: 'localhost',
  })
}

if (env.CLOUDFLARE_R2_PUBLIC_URL) {
  const { hostname } = new URL(env.CLOUDFLARE_R2_PUBLIC_URL)

  remotePatterns.push({
    protocol: 'https',
    hostname,
  })
}

const config: NextConfig = {
  productionBrowserSourceMaps: true,

  typescript: {
    ignoreBuildErrors: !!process.env.CI,
  },

  images: {
    qualities: [75, 100],
    remotePatterns,
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  compress: true,
  reactStrictMode: true,

  // PostHog rewrites
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },

  experimental: {
    optimizePackageImports: [
      'shiki',
      'lenis',
      'three',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'react-hook-form',
      'zod',
      '@tanstack/react-query',
      'framer-motion',
      'react-spring',
      'gsap',
      'motion',
      'canvas-confetti',
      'react-medium-image-zoom',
      'yet-another-react-lightbox',
      'sharp',
      'canvas',
      'pg',
      'drizzle-orm',
      'better-auth',
    ],
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
    optimizeCss: true,
  },

  serverExternalPackages: ['prettier'],

  async redirects() {
    return [
      {
        source: '/atom',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/rss.xml',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default withMDX(withBundleAnalyzer(withPWA(config)))
