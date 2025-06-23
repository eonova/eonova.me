import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '~/lib/env'

import * as schema from './schema'

// 创建连接池
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // 连接池配置
  max: 20, // 最大连接数
  min: 5, // 最小连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
  connectionTimeoutMillis: 10000, // 连接超时时间
  maxUses: 7500, // 每个连接的最大使用次数
  allowExitOnIdle: true, // 允许在空闲时退出
  // SSL 配置（生产环境）
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
