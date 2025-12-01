import { ORPCError } from '@orpc/client'
import { and, eq, lt } from 'drizzle-orm'
import { friends } from '~/db'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils/get-ip'
import { adminProcedure, publicProcedure } from '../root'
import { createFriendInputSchema, deleteFriendInputSchema, listAllFriendsInputSchema, updateFriendInputSchema } from '../schemas/friend.schema'

const getKey = (id: string) => `friend:${id}`

export const listAllFriends = publicProcedure
  .input(listAllFriendsInputSchema)
  .handler(async ({ context, input = {} }) => {
    const ip = getIp(context.headers)
    const { success } = await ratelimit.limit(getKey(`get:${ip}`))
    if (!success)
      throw new ORPCError('TOO_MANY_REQUESTS')

    const limit = input.limit ?? 10
    const items = await context.db.query.friends.findMany({
      columns: {
        id: true,
        name: true,
        url: true,
        avatar: true,
        description: true,
        createdAt: true,
      },
      orderBy: (friends, { desc }) => [desc(friends.createdAt)],
      where: and(
        eq(friends.active, true),
        input.cursor ? lt(friends.createdAt, input.cursor) : undefined,
      ),
      limit: limit + 1,
    })

    let nextCursor: Date | undefined
    if (items.length > limit) {
      const nextItem = items.pop()
      nextCursor = nextItem?.createdAt
    }

    return {
      items,
      nextCursor,
    }
  })

export const createFriend = publicProcedure
  .input(createFriendInputSchema)
  .handler(async ({ context, input }) => {
    const isAdmin = context.session?.user?.role === 'admin'
    const [newFriend] = await context.db
      .insert(friends)
      .values({
        name: input.name,
        url: input.url,
        avatar: input.avatar,
        description: input.description,
        active: isAdmin,
      })
      .returning()
    return newFriend
  })

export const deleteFriend = adminProcedure
  .input(deleteFriendInputSchema)
  .handler(async ({ context, input }) => {
    await context.db.delete(friends).where(eq(friends.id, input.id))
  })

export const updateFriend = adminProcedure
  .input(updateFriendInputSchema)
  .handler(async ({ context, input }) => {
    const [updatedFriend] = await context.db
      .update(friends)
      .set({
        name: input.name,
        url: input.url,
        avatar: input.avatar,
        description: input.description,
        active: input.active,
      })
      .where(eq(friends.id, input.id))
      .returning()
    return updatedFriend
  })
