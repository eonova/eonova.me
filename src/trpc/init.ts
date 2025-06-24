import { initTRPC, TRPCError } from '@trpc/server'
import { headers } from 'next/headers'
import { cache } from 'react'
import { SuperJSON } from 'superjson'
import { ZodError } from 'zod'
import { db } from '~/db'
import { getSession } from '~/lib/auth'
import { cacheManager } from '~/lib/cache-manager'

export const createTRPCContext = cache(async () => {
  const session = await getSession()

  return {
    db,
    session,
    headers: await headers(),
  }
})

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

// 性能监控中间件
const performanceMiddleware = t.middleware(async ({ next, path, type }) => {
  const start = Date.now()
  const isTestEnv = process.env.NODE_ENV === 'test'
  const isDev = process.env.NODE_ENV === 'development'

  // 只在开发环境添加人工延迟，测试环境不添加
  if (isDev && !isTestEnv) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  const duration = end - start

  // 在测试环境中减少日志输出
  if (!isTestEnv) {
    console.log(`[TRPC] ${type} ${path} took ${duration}ms`)
  }

  // 调整慢查询阈值 - 测试环境更严格
  const slowQueryThreshold = isTestEnv ? 2000 : 5000
  if (duration > slowQueryThreshold) {
    console.warn(`[TRPC] Slow query detected: ${path} took ${duration}ms`)
  }

  return result
})

// 缓存中间件
const cacheMiddleware = t.middleware(async ({ next, path, type, input }) => {
  // 只对查询启用缓存
  if (type !== 'query') {
    return next()
  }

  // 生成缓存键
  const cacheKey = `trpc:${path}:${JSON.stringify(input)}`

  // 执行查询并缓存结果
  const result = await next()

  if (result.ok) {
    await cacheManager.set(cacheKey, result.data)
  }

  return result
})

// 限流中间件
const rateLimitMiddleware = t.middleware(async ({ next, ctx: _ctx, path: _path }) => {
  // 这里可以添加更细粒度的限流逻辑
  // 暂时使用现有的 ratelimit
  return next()
})

export const publicProcedure = t.procedure
  .use(performanceMiddleware)
  .use(rateLimitMiddleware)
  .use(cacheMiddleware)

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({ ctx })
})
