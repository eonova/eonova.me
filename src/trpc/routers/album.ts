import type { RouterOutputs } from '../react'
import { TRPCError } from '@trpc/server'

import { z } from 'zod'
import { album, eq } from '~/db'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils'
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc'

const getKey = (id: string) => `album:${id}`

export const albumRouter = createTRPCRouter({
  getAllImages: publicProcedure
    .query(async ({ ctx }) => {
      const ip = getIp(ctx.headers)

      const { success } = await ratelimit.limit(getKey(`get:${ip}`))

      if (!success)
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const result = await ctx.db.query.album.findMany({
        columns: {
          id: true,
          imageUrl: true,
          height: true,
          width: true,
          description: true,
          createdAt: true,
        },
      })

      return {
        images: result,
      }
    }),

  addImage: adminProcedure.input(
    z.object({
      imageUrl: z.string(),
      description: z.string(),
      height: z.number(),
      width: z.number(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { imageUrl, description, height, width } = input
    await ctx.db.insert(album).values({
      imageUrl,
      description,
      width,
      height,
    })
  }),

  deleteImage: adminProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id } = input
    await ctx.db.delete(album).where(eq(album.id, id))
  }),

  updateImage: adminProcedure.input(
    z.object({
      id: z.string().nonempty(),
      imageUrl: z.string(),
      description: z.string(),
      height: z.number(),
      width: z.number(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { id, imageUrl, description, height, width } = input
    await ctx.db.update(album).set({
      ...(imageUrl ? { imageUrl } : {}),
      ...(description ? { description } : {}),
      ...(height ? { height } : {}),
      ...(width ? { width } : {}),
    }).where(
      eq(album.id, id),
    )
  }),
})

export type GetUsersOutput = RouterOutputs['album']['getAllImages']
