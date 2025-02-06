import { fileURLToPath } from 'node:url'
import { withMDX } from '@ileostar/mdx/next'
import bundleAnalyzer from '@next/bundle-analyzer'
import { createJiti } from 'jiti'
import ReactComponentName from 'react-scan/react-component-name/webpack'

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti.import('./src/lib/env.ts')

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const NextConfigHeaders = [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      }
    ]
  }
]

/** @type {import('next').NextConfig} */
const CustomConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ['shiki'],
  },

  bundlePagesRouterDependencies: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    domains: ['images.unsplash.com'],
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
  }
}

export default withMDX(withBundleAnalyzer(CustomConfig))
