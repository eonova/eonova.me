import { TRPCError } from '@trpc/server'
import { env } from '~/lib/env'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils'
import { createTRPCRouter, publicProcedure } from '../init'

const getKey = (id: string) => `youtube:${id}`

export const youtubeRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const ip = getIp(ctx.headers)

    const { success } = await ratelimit.limit(getKey(ip))

    if (!success)
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?id=UC2hMWOaOlk9vrkvFVaGmn0Q&part=statistics&key=${env.GOOGLE_API_KEY}`,
    )
    const data = await res.json()

    const channel = data.items[0]
    const statistics = channel.statistics

    return {
      subscribers: Number(statistics.subscriberCount),
      views: Number(statistics.viewCount),
    }
  }),
})
