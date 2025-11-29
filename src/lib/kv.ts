import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { consola } from 'consola'
import { env } from './env'

type KVKey = string | string[]

const KV_TTL = 60 * 60 * 24 // 1 day

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '10 s'),
  analytics: true,
})

function createKey(parts: KVKey): string {
  return Array.isArray(parts) ? parts.join(':') : parts
}

export function createCache<T, A extends string[]>(keyPrefix: KVKey, ttl: number = KV_TTL) {
  const prefixKey = createKey(keyPrefix)

  const getKey = (suffixArgs: A) => {
    if (suffixArgs.length === 0)
      return prefixKey

    const suffixKey = createKey(suffixArgs)
    return suffixKey ? `${prefixKey}:${suffixKey}` : prefixKey
  }

  return {
    get: async (...args: A): Promise<T | null> => {
      const key = getKey(args)
      consola.info('[Cache] Hit', key)
      return redis.get<T>(key)
    },

    set: async (value: T, ...args: A): Promise<void> => {
      const key = getKey(args)
      consola.info('[Cache] Set', key)
      await redis.set(key, value, { ex: ttl })
    },
  }
}
