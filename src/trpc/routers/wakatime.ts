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

    const res = await fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', {
      headers: {
        // eslint-disable-next-line node/prefer-global/buffer
        Authorization: `Basic ${Buffer.from(env.WAKATIME_API_KEY).toString('base64')}`,
      },
    })

    const {
      data: { total_seconds },
    } = await res.json()

    return {
      seconds: total_seconds as number,
    }
  }),
})
