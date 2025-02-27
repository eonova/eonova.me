import { TRPCError } from '@trpc/server'
import { eq, lt, sql } from 'drizzle-orm'
import { z } from 'zod'
import { talks } from '~/db'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils'
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc'

const getKey = (id: string) => `talks:${id}`

export const talksRouter = createTRPCRouter({
  getAllTalks: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.date().optional(),
      }).optional().default({}),
    )
    .query(async ({ ctx, input }) => {
      const ip = getIp(ctx.headers)
      const { success } = await ratelimit.limit(getKey(`get:${ip}`))
      if (!success)
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      // 获取 limit + 1 条用于判断是否有下一页
      const items = await ctx.db.query.talks.findMany({
        columns: {
          id: true,
          content: true,
          likes: true,
          createdAt: true,
        },
        orderBy: (talks, { desc }) => [desc(talks.createdAt)],
        where: input.cursor ? lt(talks.createdAt, input.cursor) : undefined,
        limit: input.limit + 1,
      })

      let nextCursor: Date | undefined
      if (items.length > input.limit) {
        const nextItem = items.pop() // 移除多余的最后一项
        nextCursor = nextItem?.createdAt
      }

      return {
        items,
        nextCursor,
      }
    }),

  createTalk: adminProcedure
    .input(
      z.object({
        content: z.string()
          .min(1, '内容不能为空')
          .max(500, '内容长度不能超过500字符'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newTalk] = await ctx.db.insert(talks).values({
        content: input.content,
      }).returning()
      return newTalk
    }),

  deleteTalk: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(talks).where(eq(talks.id, input.id))
    }),

  updateTalk: adminProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        content: z.string()
          .min(1, '内容不能为空')
          .max(500, '内容长度不能超过500字符'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedTalk] = await ctx.db.update(talks)
        .set({ content: input.content })
        .where(eq(talks.id, input.id))
        .returning()
      return updatedTalk
    }),

  incrementLikes: publicProcedure
    .input(z.object({ talkId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [updatedTalk] = await ctx.db.update(talks)
        .set({ likes: sql`${talks.likes} + 1` })
        .where(eq(talks.id, input.talkId))
        .returning()
      return updatedTalk
    }),
})
