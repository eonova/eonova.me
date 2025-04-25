import type { NextConfig } from 'next'
import { createContentCollectionPlugin as createMDX } from '@content-collections/next'
import createPWA from '@ducanh2912/next-pwa'
import bundleAnalyzer from '@next/bundle-analyzer'
import ReactComponentName from 'react-scan/react-component-name/webpack'
import './src/lib/env'

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
  },
})

/** Secure Header */
const NextConfigHeaders = [
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

const MyNextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,

  transpilePackages: ['@t3-oss/env-nextjs'],
  experimental: {
    optimizePackageImports: ['shiki', 'lenis'],
    reactCompiler: true,
  },
  serverExternalPackages: ['prettier'],
  images: {
    remotePatterns: [
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
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'minio.mythsman.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'lain.bgm.tv',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'img.leostar.top',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

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
    return NextConfigHeaders
  },

  webpack: (c) => {
    if (process.env.REACT_SCAN_MONITOR_API_KEY) {
      c.plugins.push(ReactComponentName({}))
    }
    return c
  },
}

export default withMDX(withBundleAnalyzer(withPWA(MyNextConfig)))
