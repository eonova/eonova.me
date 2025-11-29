import fs from 'node:fs/promises'
import path from 'node:path'

import { test as teardown } from '@playwright/test'
import { comments, contentLikes, db, eq, like, messages, posts, sessions, users } from '~/db'
import { redis } from '~/lib/kv'

import { TEST_UNIQUE_ID } from './fixtures/auth'
import { TEST_POSTS } from './fixtures/posts'

teardown('teardown global', async () => {
  // Delete test user related data
  await db.delete(comments).where(like(comments.contentId, 'test%'))
  await db.delete(messages).where(eq(messages.userId, TEST_UNIQUE_ID))
  await db.delete(contentLikes).where(like(contentLikes.contentId, 'test%'))
  await db.delete(posts).where(like(posts.slug, 'test%'))
  await db.delete(sessions).where(like(sessions.userId, TEST_UNIQUE_ID))
  await db.delete(users).where(eq(users.id, TEST_UNIQUE_ID))

  // Delete test blog posts
  for (const post of TEST_POSTS) {
    await fs.rm(path.join(process.cwd(), 'data/posts/', `${post.slug}.mdx`))
    await fs.rm(path.join(process.cwd(), 'public/images/blog', post.slug), { recursive: true })
  }

  // Clean cache
  await redis.flushall()
})
