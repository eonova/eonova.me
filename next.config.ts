import type { NextConfig } from 'next'
import { createContentCollectionPlugin } from '@content-collections/next'
import bundleAnalyzer from '@next/bundle-analyzer'
import ReactComponentName from 'react-scan/react-component-name/webpack'
import './src/lib/env.ts'

const withContentCollections = createContentCollectionPlugin({
  configPath: './content.config.ts',
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

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

/** @type {import('next').NextConfig} */
const CustomConfig: NextConfig = {
  compress: true,

  productionBrowserSourceMaps: true,

  reactStrictMode: true,

  serverExternalPackages: ['drizzle-orm', 'pg-native'],
  experimental: {
    optimizePackageImports: ['shiki'],
    reactCompiler: true,
  },

  bundlePagesRouterDependencies: true,

  transpilePackages: ['@ileostar/*'],

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
        hostname: 'img.leostar.top',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
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

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false
      config.resolve.fallback = {
        fs: false,
        net: false,
        dns: false,
        tls: false,
      }
    }
    if (process.env.REACT_SCAN_MONITOR_API_KEY) {
      config.plugins.push(ReactComponentName({}))
    }
    return config
  },
}

export default withContentCollections(withBundleAnalyzer(CustomConfig))
