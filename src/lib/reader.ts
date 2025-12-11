import { createGitHubReader } from '@keystatic/core/reader/github'
import keystaticConfig from '@/keystatic.config'

/**
 * Instruct Next.js to include content directory in serverless function 😵
 * Without this Next.js wont be able to do static analysis and "content" directory will not be available in serverless function
 */

export const reader = createGitHubReader(keystaticConfig, {
  repo: 'eonova/blog-posts',
  token: process.env.GITHUB_PAT,
})
