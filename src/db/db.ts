import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '~/lib/env'

import * as schema from './schema'

// 根据环境配置连接池
const isTestEnv = process.env.NODE_ENV === 'test'
const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // 连接池配置 - 测试环境使用更小的连接池
  max: isTestEnv ? 5 : 20, // 最大连接数
  min: isTestEnv ? 1 : 5, // 最小连接数
  idleTimeoutMillis: isTestEnv ? 5000 : 30000, // 空闲连接超时时间
  connectionTimeoutMillis: isTestEnv ? 5000 : 10000, // 连接超时时间
  maxUses: isTestEnv ? 1000 : 7500, // 每个连接的最大使用次数
  allowExitOnIdle: true, // 允许在空闲时退出
  // SSL 配置
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  // 测试环境的额外配置
  ...(isTestEnv && {
    acquireTimeoutMillis: 3000, // 获取连接的超时时间
    createTimeoutMillis: 3000, // 创建连接的超时时间
    destroyTimeoutMillis: 1000, // 销毁连接的超时时间
    reapIntervalMillis: 1000, // 清理空闲连接的间隔
  }),
})

// 监听连接池事件
pool.on('connect', () => {
  console.log('[Database]: Database connected')
})

pool.on('error', (err) => {
  console.error('[Database]: Database connection error:', err)
})

export const db = drizzle(pool, { schema })

// 优雅关闭连接池
process.on('SIGINT', async () => {
  console.log('[Database]: Closing database pool...')
  await pool.end()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('[Database]: Closing database pool...')
  await pool.end()
  process.exit(0)
})
