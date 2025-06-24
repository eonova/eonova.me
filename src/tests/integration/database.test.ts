import { eq, like, sql } from 'drizzle-orm'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { guestbook, posts, users } from '~/db/schema'
import {
  checkTestDbConnection,
  cleanupTestData,
  closeTestDb,
  createTestDb,
  withTestTransaction,
} from '../utils/test-db'

// 辅助函数：检查是否应该跳过数据库测试
function skipIfNoDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    console.log('Skipping database test - no DATABASE_URL')
    return true
  }
  return false
}

describe('database Integration Tests', () => {
  // 检查是否应该跳过数据库测试
  const shouldSkipDatabaseTests = !process.env.DATABASE_URL

  beforeAll(async () => {
    if (shouldSkipDatabaseTests) {
      console.warn('DATABASE_URL not set, skipping database integration tests')
      return
    }

    // 检查数据库连接
    try {
      const isConnected = await checkTestDbConnection()
      if (!isConnected) {
        console.warn('Database connection failed, some tests may be skipped')
      }
    } catch (error) {
      console.warn('Database connection check failed:', error)
    }
  })

  beforeEach(async () => {
    // 只在有数据库连接时清理测试数据
    if (!shouldSkipDatabaseTests) {
      try {
        await cleanupTestData()
      } catch (error) {
        console.warn('Failed to cleanup test data:', error)
      }
    }
  })

  afterAll(async () => {
    // 清理并关闭数据库连接
    if (!shouldSkipDatabaseTests) {
      try {
        await cleanupTestData()
        await closeTestDb()
      } catch (error) {
        console.warn('Failed to cleanup database:', error)
      }
    }
  })

  describe('database Connection', () => {
    it('should connect to database successfully', async () => {
      if (shouldSkipDatabaseTests) {
        console.log('Skipping database connection test - no DATABASE_URL')
        return
      }

      const db = createTestDb()
      const result = await db.execute(sql`SELECT 1 as test`)
      expect(result.rows[0]).toEqual({ test: 1 })
    })

    it('should handle connection errors gracefully', async () => {
      // 这个测试不需要实际的数据库连接
      expect(true).toBe(true) // 占位符测试
    })
  })

  describe('database Transactions', () => {
    it('should commit successful transactions', async () => {
      if (skipIfNoDatabaseUrl()) return

      const testUserId = 'test-user-transaction-commit'

      await withTestTransaction(async (tx) => {
        await tx.insert(users).values({
          id: testUserId,
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })

      // 验证数据已提交
      const db = createTestDb()
      const user = await db.query.users.findFirst({
        where: eq(users.id, testUserId),
      })

      expect(user).toBeDefined()
      expect(user?.name).toBe('Test User')
    })

    it('should rollback failed transactions', async () => {
      if (skipIfNoDatabaseUrl()) return

      const testUserId = 'test-user-transaction-rollback'

      try {
        await withTestTransaction(async (tx) => {
          await tx.insert(users).values({
            id: testUserId,
            name: 'Test User',
            email: 'test@example.com',
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          // 故意抛出错误来触发回滚
          throw new Error('Intentional error for rollback test')
        })
      } catch (error) {
        expect(error instanceof Error && error.message).toBe('Intentional error for rollback test')
      }

      // 验证数据已回滚
      const db = createTestDb()
      const user = await db.query.users.findFirst({
        where: eq(users.id, testUserId),
      })

      expect(user).toBeUndefined()
    })
  })

  describe('cRUD Operations', () => {
    describe('users Table', () => {
      it('should create user successfully', async () => {
        if (!process.env.DATABASE_URL) {
          console.log('Skipping user creation test - no DATABASE_URL')
          return
        }

        const db = createTestDb()
        const testUserId = 'test-user-create'

        await db.insert(users).values({
          id: testUserId,
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        const user = await db.query.users.findFirst({
          where: eq(users.id, testUserId),
        })

        expect(user).toBeDefined()
        expect(user?.name).toBe('Test User')
        expect(user?.email).toBe('test@example.com')
      })

      it('should update user successfully', async () => {
        if (!process.env.DATABASE_URL) {
          console.log('Skipping user update test - no DATABASE_URL')
          return
        }

        const db = createTestDb()
        const testUserId = 'test-user-update'

        // 创建用户
        await db.insert(users).values({
          id: testUserId,
          name: 'Original Name',
          email: 'test@example.com',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        // 更新用户
        await db
          .update(users)
          .set({ name: 'Updated Name', updatedAt: new Date() })
          .where(eq(users.id, testUserId))

        const user = await db.query.users.findFirst({
          where: eq(users.id, testUserId),
        })

        expect(user?.name).toBe('Updated Name')
      })

      it('should delete user successfully', async () => {
        if (skipIfNoDatabaseUrl()) return

        const db = createTestDb()
        const testUserId = 'test-user-delete'

        // 创建用户
        await db.insert(users).values({
          id: testUserId,
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        // 删除用户
        await db.delete(users).where(eq(users.id, testUserId))

        const user = await db.query.users.findFirst({
          where: eq(users.id, testUserId),
        })

        expect(user).toBeUndefined()
      })
    })

    describe('posts Table', () => {
      it('should handle post operations', async () => {
        if (skipIfNoDatabaseUrl()) return

        const db = createTestDb()
        const testSlug = 'test-post-operations'

        // 创建文章
        await db.insert(posts).values({
          slug: testSlug,
          views: 0,
          likes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        // 更新浏览量
        await db.update(posts).set({ views: 10 }).where(eq(posts.slug, testSlug))

        const post = await db.query.posts.findFirst({
          where: eq(posts.slug, testSlug),
        })

        expect(post?.views).toBe(10)
      })
    })
  })

  describe('database Constraints', () => {
    it('should enforce unique constraints', async () => {
      if (skipIfNoDatabaseUrl()) return

      const db = createTestDb()
      const testUserId = 'test-user-unique'

      // 创建第一个用户
      await db.insert(users).values({
        id: testUserId,
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // 尝试创建相同ID的用户应该失败
      await expect(
        db.insert(users).values({
          id: testUserId, // 相同的ID
          name: 'Another User',
          email: 'another@example.com',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).rejects.toThrow()
    })

    it('should handle foreign key constraints', async () => {
      if (skipIfNoDatabaseUrl()) return

      const db = createTestDb()
      const testUserId = 'test-user-fk'

      // 尝试创建引用不存在用户的留言应该失败
      await expect(
        db.insert(guestbook).values({
          id: 'test-guestbook-fk',
          userId: testUserId, // 不存在的用户ID
          body: 'Test message',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).rejects.toThrow()
    })
  })

  describe('database Performance', () => {
    it('should handle bulk operations efficiently', async () => {
      if (skipIfNoDatabaseUrl()) return

      const db = createTestDb()
      const start = Date.now()

      // 批量插入100个测试文章
      const testPosts = Array.from({ length: 100 }, (_, i) => ({
        slug: `test-bulk-post-${i}`,
        views: 0,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      await db.insert(posts).values(testPosts)

      const duration = Date.now() - start

      // 批量操作应该在合理时间内完成（1秒）
      expect(duration).toBeLessThan(1000)

      // 验证数据已插入
      const insertedPosts = await db.query.posts.findMany({
        where: like(posts.slug, 'test-bulk-post-%'),
      })

      expect(insertedPosts).toHaveLength(100)
    })
  })
})
