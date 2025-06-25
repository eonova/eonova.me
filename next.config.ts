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
  // 静态资源缓存
  // {
  //   source: '/images/(.*)',
  //   headers: [
  //     {
  //       key: 'Cache-Control',
  //       value: 'public, max-age=31536000, immutable',
  //     },
  //   ],
  // },
  // {
  //   source: '/_next/static/(.*)',
  //   headers: [
  //     {
  //       key: 'Cache-Control',
  //       value: 'public, max-age=31536000, immutable',
  //     },
  //   ],
  // },
]

const MyNextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,

  experimental: {
    reactCompiler: true,
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
    typedRoutes: true,
    optimizeCss: true,
  },

  serverExternalPackages: ['prettier'],

  images: {
    // 启用图片优化
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1年缓存
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',

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
        hostname: 'img.eonova.me',
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

  webpack: (config, { dev, isServer }) => {
    // Check if we're using Rspack - if so, skip some webpack-specific optimizations
    const isRspack = config.name === 'rspack' || process.env.NEXT_RSPACK === 'true'

    if (!isRspack) {
      // 禁用 webpack 缓存警告
      config.infrastructureLogging = {
        level: 'error',
      }

      // 禁用 webpack 缓存序列化警告
      if (config.cache && typeof config.cache === 'object') {
        config.cache.compression = false
      }

      // 添加自定义插件来过滤警告
      config.plugins.push({
        apply: (compiler: any) => {
          compiler.hooks.done.tap('FilterWarningsPlugin', (stats: any) => {
            stats.compilation.warnings = stats.compilation.warnings.filter((warning: any) => {
              // 过滤掉 PostCSS calc 和缓存序列化警告
              const message = warning.message || warning.toString()
              return (
                !message.includes('postcss-calc')
                && !message.includes('No serializer registered')
                && !message.includes('PackFileCacheStrategy')
              )
            })
          })
        },
      })
    }

    // React Scan 监控 - safe for both webpack and rspack
    if (process.env.REACT_SCAN_MONITOR_API_KEY) {
      config.plugins.push(ReactComponentName({}))
    }

    // 服务端优化 - safe for both
    if (isServer && !isRspack) {
      config.optimization.concatenateModules = false
    }

    // CSS 模块优化 - only for webpack
    if (!isRspack) {
      config.module.rules.forEach((rule: any) => {
        if (rule.test && rule.test.toString().includes('css')) {
          if (rule.use && Array.isArray(rule.use)) {
            rule.use.forEach((use: any) => {
              if (use.loader && use.loader.includes('postcss-loader')) {
                use.options = {
                  ...use.options,
                  postcssOptions: {
                    ...use.options?.postcssOptions,
                    hideNothingWarning: true,
                  },
                }
              }
            })
          }
        }
      })
    }

    // 客户端优化 - only for webpack
    if (!isServer && !dev && !isRspack) {
      // 优化代码分割
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // 框架代码
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // UI 库
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|class-variance-authority|clsx|tailwind-merge)[\\/]/,
            priority: 30,
            enforce: true,
          },
          // 动画库
          animations: {
            name: 'animations',
            test: /[\\/]node_modules[\\/](framer-motion|motion|gsap|lenis|react-spring)[\\/]/,
            priority: 25,
            enforce: true,
          },
          // 数据处理
          data: {
            name: 'data',
            test: /[\\/]node_modules[\\/](@tanstack|@trpc|zod|superjson)[\\/]/,
            priority: 20,
            enforce: true,
          },
          // 工具库
          utils: {
            name: 'utils',
            test: /[\\/]node_modules[\\/](dayjs|markdown-to-jsx|remark|unified|shiki)[\\/]/,
            priority: 15,
            enforce: true,
          },
          // 默认 vendor
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            enforce: true,
          },
        },
      }

      // 优化模块解析
      config.resolve.alias = {
        ...config.resolve.alias,
        // 减少包大小
        'react/jsx-runtime': 'react/jsx-runtime',
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime',
      }
    }

    return config
  },
}

// Apply plugins without Rspack for now due to compatibility issues
// Rspack doesn't fully support Next.js metadata routes (manifest.ts, robots.ts, sitemap.ts)
// See: https://github.com/vercel/next.js/discussions/77800
const config = [withPWA, withBundleAnalyzer, withMDX].reduce(
  (acc, plugin) => plugin(acc),
  MyNextConfig,
)

export default config
