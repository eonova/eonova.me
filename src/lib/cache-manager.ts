import { cacheTTL, redis } from './kv'

/**
 * 高级缓存管理器
 * 提供多层缓存、缓存预热、失效策略等功能
 */

// 内存缓存（用于极热数据）
const memoryCache = new Map<string, { data: any, expires: number }>()

// 缓存层级
enum CacheLevel {
  MEMORY = 'memory',
  REDIS = 'redis',
  BOTH = 'both',
}

// 缓存配置
interface CacheConfig {
  ttl: number
  level: CacheLevel
  tags?: string[]
  version?: string
}

// 默认缓存配置
const defaultConfigs: Record<string, CacheConfig> = {
  'posts:list': { ttl: cacheTTL.lists, level: CacheLevel.BOTH, tags: ['posts'] },
  'posts:detail': { ttl: cacheTTL.content, level: CacheLevel.REDIS, tags: ['posts'] },
  'comments:list': { ttl: cacheTTL.listsShort, level: CacheLevel.REDIS, tags: ['comments'] },
  'user:profile': { ttl: cacheTTL.user, level: CacheLevel.MEMORY, tags: ['users'] },
  'stats:global': { ttl: cacheTTL.stats, level: CacheLevel.BOTH, tags: ['stats'] },
  'search:results': { ttl: cacheTTL.search, level: CacheLevel.REDIS, tags: ['search'] },
}

/**
 * 多层缓存管理器
 */
export class CacheManager {
  private static instance: CacheManager
  private hitStats = { memory: 0, redis: 0, miss: 0 }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  /**
   * 获取缓存数据
   */
  async get<T>(key: string, config?: Partial<CacheConfig>): Promise<T | null> {
    const pattern = `${key.split(':')[0]}:${key.split(':')[1]}`
    const defaultConfig = defaultConfigs[pattern] || {
      ttl: cacheTTL.lists,
      level: CacheLevel.REDIS,
    }
    const finalConfig = { ...defaultConfig, ...config }

    // 尝试内存缓存
    if (finalConfig.level === CacheLevel.MEMORY || finalConfig.level === CacheLevel.BOTH) {
      const memoryData = this.getFromMemory<T>(key)
      if (memoryData !== null) {
        this.hitStats.memory++
        return memoryData
      }
    }

    // 尝试 Redis 缓存
    if (finalConfig.level === CacheLevel.REDIS || finalConfig.level === CacheLevel.BOTH) {
      try {
        const redisData = await redis.get<T>(key)
        if (redisData !== null) {
          this.hitStats.redis++

          // 如果配置了内存缓存，同时写入内存
          if (finalConfig.level === CacheLevel.BOTH) {
            this.setToMemory(key, redisData, finalConfig.ttl)
          }

          return redisData
        }
      }
      catch (error) {
        console.error('Redis get error:', error)
      }
    }

    this.hitStats.miss++
    return null
  }

  /**
   * 设置缓存数据
   */
  async set<T>(key: string, data: T, config?: Partial<CacheConfig>): Promise<void> {
    const pattern = `${key.split(':')[0]}:${key.split(':')[1]}`
    const defaultConfig = defaultConfigs[pattern] || {
      ttl: cacheTTL.lists,
      level: CacheLevel.REDIS,
    }
    const finalConfig = { ...defaultConfig, ...config }

    // 写入内存缓存
    if (finalConfig.level === CacheLevel.MEMORY || finalConfig.level === CacheLevel.BOTH) {
      this.setToMemory(key, data, finalConfig.ttl)
    }

    // 写入 Redis 缓存
    if (finalConfig.level === CacheLevel.REDIS || finalConfig.level === CacheLevel.BOTH) {
      try {
        await redis.set(key, data, { ex: finalConfig.ttl })
      }
      catch (error) {
        console.error('Redis set error:', error)
      }
    }
  }

  /**
   * 删除缓存
   */
  async delete(key: string): Promise<void> {
    // 删除内存缓存
    memoryCache.delete(key)

    // 删除 Redis 缓存
    try {
      await redis.del(key)
    }
    catch (error) {
      console.error('Redis delete error:', error)
    }
  }

  /**
   * 按标签批量删除缓存
   */
  async deleteByTags(tags: string[]): Promise<void> {
    // 删除内存缓存中匹配标签的项
    for (const [key] of memoryCache) {
      const config = this.getConfigForKey(key)
      if (config.tags && tags.some(tag => config.tags!.includes(tag))) {
        memoryCache.delete(key)
      }
    }

    // 删除 Redis 缓存中匹配标签的项
    try {
      const keys = await redis.keys('*')
      const keysToDelete = keys.filter((key) => {
        const config = this.getConfigForKey(key)
        return config.tags && tags.some(tag => config.tags!.includes(tag))
      })

      if (keysToDelete.length > 0) {
        await redis.del(...keysToDelete)
      }
    }
    catch (error) {
      console.error('Redis delete by tags error:', error)
    }
  }

  /**
   * 缓存预热
   */
  async warmup(warmupFunctions: Array<() => Promise<void>>): Promise<void> {
    console.log('Starting cache warmup...')

    try {
      await Promise.allSettled(warmupFunctions.map(fn => fn()))
      console.log('Cache warmup completed')
    }
    catch (error) {
      console.error('Cache warmup failed:', error)
    }
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    const total = this.hitStats.memory + this.hitStats.redis + this.hitStats.miss
    return {
      ...this.hitStats,
      total,
      hitRate:
        total > 0
          ? `${(((this.hitStats.memory + this.hitStats.redis) / total) * 100).toFixed(2)}%`
          : '0%',
      memorySize: memoryCache.size,
    }
  }

  /**
   * 清理过期的内存缓存
   */
  cleanupMemoryCache(): void {
    const now = Date.now()
    for (const [key, value] of memoryCache) {
      if (value.expires < now) {
        memoryCache.delete(key)
      }
    }
  }

  /**
   * 从内存获取数据
   */
  private getFromMemory<T>(key: string): T | null {
    const cached = memoryCache.get(key)
    if (!cached)
      return null

    if (cached.expires < Date.now()) {
      memoryCache.delete(key)
      return null
    }

    return cached.data
  }

  /**
   * 写入内存缓存
   */
  private setToMemory<T>(key: string, data: T, ttl: number): void {
    const expires = Date.now() + ttl * 1000
    memoryCache.set(key, { data, expires })

    // 限制内存缓存大小
    if (memoryCache.size > 1000) {
      const oldestKey = memoryCache.keys().next().value
      if (oldestKey) {
        memoryCache.delete(oldestKey)
      }
    }
  }

  /**
   * 获取键的配置
   */
  private getConfigForKey(key: string): CacheConfig {
    const pattern = `${key.split(':')[0]}:${key.split(':')[1]}`
    return defaultConfigs[pattern] || { ttl: cacheTTL.lists, level: CacheLevel.REDIS }
  }
}

// 导出单例实例
export const cacheManager = CacheManager.getInstance()

// 定期清理内存缓存
if (typeof window === 'undefined') {
  setInterval(() => {
    cacheManager.cleanupMemoryCache()
  }, 60000) // 每分钟清理一次
}

// Removed unused exports: cached function and cacheInvalidation object
// These can be added back when needed for future cache invalidation strategies
