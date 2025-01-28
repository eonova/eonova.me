import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'
import createMDX from '@next/mdx'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

/** @type {import('next').NextConfig} */
const CustomConfig: NextConfig = {
  reactStrictMode: true,
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  bundlePagesRouterDependencies: true,
  // Optionally, add any other Next.js config below
}

const nextConfig = withMDX(withBundleAnalyzer(CustomConfig))

export default nextConfig
