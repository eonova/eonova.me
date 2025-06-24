import { TRPCError } from '@trpc/server'
import { env } from '~/lib/env'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils'
import { createTRPCRouter, publicProcedure } from '../init'

const getKey = (id: string) => `wakatime:${id}`

export const wakatimeRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const ip = getIp(ctx.headers)

    const { success } = await ratelimit.limit(getKey(ip))

    if (!success)
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时

    try {
      const res = await fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', {
        headers: {
          // eslint-disable-next-line node/prefer-global/buffer
          Authorization: `Basic ${Buffer.from(env.WAKATIME_API_KEY).toString('base64')}`,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Wakatime API error: ${res.status}`,
        })
      }

      const data = await res.json()
      return {
        seconds: (data?.data?.total_seconds as number) || 0,
      }
    }
    catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error && error.name === 'AbortError') {
        throw new TRPCError({
          code: 'TIMEOUT',
          message: 'Wakatime API request timed out',
        })
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch Wakatime data',
      })
    }
  }),
})
