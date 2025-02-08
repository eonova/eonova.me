import { fileURLToPath } from 'node:url'
import { withMDX } from '@ileostar/mdx/next'
import bundleAnalyzer from '@next/bundle-analyzer'
import { createJiti } from 'jiti'
import ReactComponentName from 'react-scan/react-component-name/webpack'
import CompressionPlugin from 'compression-webpack-plugin'

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti.import('./src/lib/env.ts')

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
const CustomConfig = {
  compress: true,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,

  serverExternalPackages: ['drizzle-orm', 'pg-native'],
  experimental: {
    optimizePackageImports: ['shiki'],
    reactCompiler: true,
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
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240, // 10KB
          minRatio: 0.8,
        }),
      )
    }
    if (process.env.REACT_SCAN_MONITOR_API_KEY) {
      config.plugins.push(ReactComponentName({}))
    }

    return config
  },
}

export default withMDX(withBundleAnalyzer(CustomConfig))
