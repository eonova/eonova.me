import fs from 'node:fs/promises'
import path from 'node:path'

import { test as teardown } from '@playwright/test'
import { comments, db, eq, guestbook, like, likesSessions, posts, users } from '~/db'
import { redis } from '~/lib/kv'

import { TEST_POSTS, TEST_USER } from './constants'

teardown('teardown global', async () => {
  console.log('[E2E Teardown]: Starting global cleanup...')

  // 数据库清理（带网络故障处理）
  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[E2E Teardown]: Database cleanup attempt ${attempt}/${maxRetries}`)

      // Delete test user related data
      await db.delete(comments).where(like(comments.contentId, 'test%'))
      await db.delete(guestbook).where(eq(guestbook.userId, TEST_USER.id))
      await db.delete(likesSessions).where(like(likesSessions.id, 'test___%'))
      await db.delete(posts).where(like(posts.slug, 'test%'))
      await db.delete(users).where(eq(users.id, TEST_USER.id))

      console.log('[E2E Teardown]: Database cleanup completed')
      break // 成功则退出循环
    }
    catch (error) {
      console.error(`[E2E Teardown]: Database cleanup attempt ${attempt} failed:`, error)

      const isNetworkError
        = error instanceof Error
          && (error.message.includes('ENOTFOUND')
            || error.message.includes('Connection terminated')
            || error.message.includes('timeout'))

      if (isNetworkError && attempt < maxRetries) {
        console.log(`[E2E Teardown]: Network error detected, retrying in ${attempt * 2}s...`)
        await new Promise(resolve => setTimeout(resolve, attempt * 2000))
        continue
      }

      if (attempt === maxRetries) {
        console.warn(
          '[E2E Teardown]: Database cleanup failed after all retries, continuing with file cleanup...',
        )
      }
    }
  }

  // 文件清理（总是尝试执行）
  try {
    console.log('[E2E Teardown]: Cleaning up test files...')
    for (const post of TEST_POSTS) {
      try {
        await fs.rm(path.join(process.cwd(), 'data/posts/tech', `${post.slug}.md`))
      }
      catch (error) {
        console.warn(`[E2E Teardown]: Failed to delete test post file: ${post.slug}.md`, error)
      }
    }
    console.log('[E2E Teardown]: File cleanup completed')
  }
  catch (error) {
    console.warn('[E2E Teardown]: File cleanup failed:', error)
  }

  // 缓存清理（带故障处理）
  try {
    console.log('[E2E Teardown]: Cleaning cache...')
    await redis.flushall()
    console.log('[E2E Teardown]: Cache cleanup completed')
  }
  catch (error) {
    console.warn('[E2E Teardown]: Cache cleanup failed:', error)
  }

  console.log('[E2E Teardown]: Global cleanup finished')
})
