import { TRPCError } from '@trpc/server'
import { eq, lt } from 'drizzle-orm'
import { z } from 'zod'
import { friend } from '~/db'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils'
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc'

const getKey = (id: string) => `friend:${id}`

export const friendRouter = createTRPCRouter({
  getAllFriends: publicProcedure
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

      const items = await ctx.db.query.friend.findMany({
        columns: {
          id: true,
          name: true,
          url: true,
          avatar: true,
          createdAt: true,
        },
        orderBy: (friend, { desc }) => [desc(friend.createdAt)],
        where: input.cursor ? lt(friend.createdAt, input.cursor) : undefined,
        limit: input.limit + 1,
      })

      let nextCursor: Date | undefined
      if (items.length > input.limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.createdAt
      }

      return {
        items,
        nextCursor,
      }
    }),

  createFriend: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, '名称不能为空').max(100, '名称不能超过100字符'),
        url: z.string().url('请输入有效的URL'),
        avatar: z.string().url('请输入有效的头像URL').optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newFriend] = await ctx.db.insert(friend).values({
        name: input.name,
        url: input.url,
        avatar: input.avatar,
      }).returning()
      return newFriend
    }),

  deleteFriend: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(friend).where(eq(friend.id, input.id))
    }),

  updateFriend: adminProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        name: z.string().min(1, '名称不能为空').max(100, '名称不能超过100字符'),
        url: z.string().url('请输入有效的URL'),
        avatar: z.string().url('请输入有效的头像URL').optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedFriend] = await ctx.db.update(friend)
        .set({
          name: input.name,
          url: input.url,
          avatar: input.avatar,
        })
        .where(eq(friend.id, input.id))
        .returning()
      return updatedFriend
    }),
})
