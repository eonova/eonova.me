import { like, sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '~/db/schema'
import { comments, guestbook, posts, users } from '~/db/schema'

// 直接从环境变量获取数据库URL，避免使用客户端环境变量验证
function getDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is required for tests')
  }
  return dbUrl
}

// 测试专用数据库连接池
let testPool: Pool | null = null
let testDb: NodePgDatabase<typeof schema> | null = null

export function createTestDb(): NodePgDatabase<typeof schema> {
  if (testDb) {
    return testDb
  }

  // 创建测试专用连接池
  testPool = new Pool({
    connectionString: getDatabaseUrl(),
    // 测试环境优化配置
    max: 3, // 最大连接数
    min: 1, // 最小连接数
    idleTimeoutMillis: 2000, // 空闲连接超时时间
    connectionTimeoutMillis: 3000, // 连接超时时间
    allowExitOnIdle: true,
    ssl: false, // 测试环境不使用SSL
  })

  // 监听连接池事件
  testPool.on('connect', () => {
    console.log('[Test Database]: Test database connected')
  })

  testPool.on('error', (err) => {
    console.error('[Test Database]: Test database connection error:', err)
  })

  testDb = drizzle(testPool, { schema })
  return testDb
}

export async function closeTestDb() {
  if (testPool) {
    console.log('[Test Database]: Closing test database pool...')
    await testPool.end()
    testPool = null
    testDb = null
  }
}

// 测试数据库事务工具
export async function withTestTransaction<T>(
  callback: (
    tx: Parameters<Parameters<ReturnType<typeof drizzle>['transaction']>[0]>[0],
  ) => Promise<T>,
): Promise<T> {
  const db = createTestDb()
  return db.transaction(callback)
}

// 清理测试数据的工具函数
export async function cleanupTestData() {
  const db = createTestDb()

  try {
    // 清理测试相关的数据
    await db.transaction(async (tx) => {
      // 删除测试用户的评论
      await tx.delete(comments).where(like(comments.contentId, 'test%'))

      // 删除测试留言
      await tx.delete(guestbook).where(like(guestbook.body, 'test%'))

      // 删除测试文章
      await tx.delete(posts).where(like(posts.slug, 'test%'))

      // 删除测试用户
      await tx.delete(users).where(like(users.id, 'test%'))
    })

    console.log('[Test Database]: Test data cleaned up successfully')
  } catch (error) {
    console.error('[Test Database]: Error cleaning up test data:', error)
    throw error
  }
}

// 检查数据库连接的工具函数
export async function checkTestDbConnection(): Promise<boolean> {
  try {
    const db = createTestDb()
    await db.execute(sql`SELECT 1`)
    return true
  } catch (error) {
    console.error('[Test Database]: Database connection check failed:', error)
    return false
  }
}
