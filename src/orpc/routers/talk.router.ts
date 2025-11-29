import { ORPCError } from '@orpc/client'
import { eq, lt, sum } from 'drizzle-orm'
import { talks } from '~/db'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils/get-ip'
import { adminProcedure, publicProcedure } from '../root'
import { likesStatsOutputSchema, viewsStatsOutputSchema } from '../schemas/content.schema'
import { createTalkInputSchema, deleteTalkInputSchema, listAllTalksInputSchema, updateTalkInputSchema } from '../schemas/talk.schema'

const getKey = (id: string) => `talks:${id}`

export const viewsStats = publicProcedure.output(viewsStatsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(talks.views),
    })
    .from(talks)

  const views = result?.value ? Number(result.value) : 0

  return {
    views,
  }
})

export const likesStats = publicProcedure.output(likesStatsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(talks.likes),
    })
    .from(talks)

  const likes = result?.value ? Number(result.value) : 0

  return {
    likes,
  }
})

export const listAllTalks = publicProcedure
  .input(listAllTalksInputSchema)
  .handler(async ({ context, input }) => {
    const ip = getIp(context.headers)
    const { success } = await ratelimit.limit(getKey(`get:${ip}`))
    if (!success)
      throw new ORPCError('TOO_MANY_REQUESTS')

    const items = await context.db.query.talks.findMany({
      columns: {
        id: true,
        content: true,
        likes: true,
        createdAt: true,
      },
      orderBy: (talks, { desc }) => [desc(talks.createdAt)],
      where: input?.cursor ? lt(talks.createdAt, input.cursor) : undefined,
      limit: (input?.limit ?? 10) + 1,
    })

    let nextCursor: Date | undefined
    if (items.length > (input?.limit ?? 10)) {
      const nextItem = items.pop()
      nextCursor = nextItem?.createdAt
    }

    return {
      items,
      nextCursor,
    }
  })

export const createTalk = adminProcedure
  .input(createTalkInputSchema)
  .handler(async ({ context, input }) => {
    const [newTalk] = await context.db
      .insert(talks)
      .values({
        content: input.content,
      })
      .returning()
    return newTalk
  })

export const deleteTalk = adminProcedure
  .input(deleteTalkInputSchema)
  .handler(async ({ context, input }) => {
    await context.db.delete(talks).where(eq(talks.id, input.id))
  })

export const updateTalk = adminProcedure
  .input(updateTalkInputSchema)
  .handler(async ({ context, input }) => {
    const [updatedTalk] = await context.db
      .update(talks)
      .set({ content: input.content })
      .where(eq(talks.id, input.id))
      .returning()
    return updatedTalk
  })
