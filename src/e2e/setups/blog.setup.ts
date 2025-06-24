import fs from 'node:fs/promises'
import path from 'node:path'

import { test as setup } from '@playwright/test'
import { db, posts } from '~/db'

import { TEST_POSTS } from '../constants'

function createTestPost(title: string) {
  return `\
---
title: ${title}
date: '2000-01-01T00:00:00Z'
modifiedTime: '2000-01-01T00:00:00Z'
summary: This is a test post.
---

# ${title}

This is a test post.
`
}

setup('setup blog', async () => {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[E2E Setup]: Blog setup attempt ${attempt}/${maxRetries}`)

      // 使用事务来确保数据一致性
      await db.transaction(async (tx) => {
        for (const post of TEST_POSTS) {
          await tx
            .insert(posts)
            .values({
              slug: post.slug,
              views: 0,
              likes: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .onConflictDoNothing({ target: posts.slug })
        }
      })

      // 创建测试文章文件
      for (const post of TEST_POSTS) {
        // Only works in dev mode since content-collections will build the test post
        // In CI, we have a GitHub Action to write the test post before building the apps
        const testPostPath = path.join(process.cwd(), `./data/posts/tech/${post.slug}.md`)

        try {
          await fs.writeFile(testPostPath, createTestPost(post.title))
        } catch (error) {
          console.warn(`Failed to create test post file: ${testPostPath}`, error)
          // 不要因为文件创建失败而中断测试
        }
      }

      console.log('[E2E Setup]: Blog setup completed successfully')
      return // 成功则退出
    } catch (error) {
      lastError = error as Error
      console.error(`[E2E Setup]: Blog setup attempt ${attempt} failed:`, error)

      // 检查是否是网络相关错误
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes('ENOTFOUND') ||
          error.message.includes('Connection terminated') ||
          error.message.includes('timeout'))

      if (isNetworkError && attempt < maxRetries) {
        console.log(`[E2E Setup]: Network error detected, retrying in ${attempt * 2}s...`)
        await new Promise((resolve) => setTimeout(resolve, attempt * 2000))
        continue
      }

      // 如果不是网络错误或已达到最大重试次数，则抛出错误
      if (attempt === maxRetries) {
        console.error('[E2E Setup]: All blog setup attempts failed')

        // 如果是网络错误，尝试优雅降级
        if (isNetworkError) {
          console.warn('[E2E Setup]: Network issues detected, continuing with file-only setup...')

          // 只创建测试文章文件，跳过数据库操作
          for (const post of TEST_POSTS) {
            const testPostPath = path.join(process.cwd(), `./data/posts/tech/${post.slug}.md`)
            try {
              await fs.writeFile(testPostPath, createTestPost(post.title))
            } catch (fileError) {
              console.warn(`Failed to create test post file: ${testPostPath}`, fileError)
            }
          }

          console.log('[E2E Setup]: Blog setup completed with degraded functionality')
          return // 优雅降级成功
        }

        throw lastError
      }
    }
  }
})
