import { ORPCError } from '@orpc/client'
import { eq, lt, sum } from 'drizzle-orm'
import { revalidateTag, unstable_cache } from 'next/cache'
import { db, talks } from '~/db'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils/get-ip'
import { adminProcedure, publicProcedure } from '../root'
import { likesStatsOutputSchema, viewsStatsOutputSchema } from '../schemas/content.schema'
import { createTalkInputSchema, deleteTalkInputSchema, listAllTalksInputSchema, updateTalkInputSchema } from '../schemas/talk.schema'

const getKey = (id: string) => `talks:${id}`

const getCachedViewsStats = unstable_cache(
  async () => {
    const [result] = await db
      .select({
        value: sum(talks.views),
      })
      .from(talks)
    return result?.value ? Number(result.value) : 0
  },
  ['talks-stats-views'],
  {
    revalidate: 300, // 5 minutes
    tags: ['talks-stats'],
  },
)

const getCachedLikesStats = unstable_cache(
  async () => {
    const [result] = await db
      .select({
        value: sum(talks.likes),
      })
      .from(talks)
    return result?.value ? Number(result.value) : 0
  },
  ['talks-stats-likes'],
  {
    revalidate: 300, // 5 minutes
    tags: ['talks-stats'],
  },
)

// Only cache the first page or specific pages if needed.
// For infinite scrolling, caching is tricky with cursors.
// We will cache the initial load (no cursor) for optimization.
const getCachedTalks = unstable_cache(
  async (limit: number, cursor?: Date) => {
    const items = await db.query.talks.findMany({
      columns: {
        id: true,
        content: true,
        likes: true,
        createdAt: true,
      },
      orderBy: (talks, { desc }) => [desc(talks.createdAt)],
      where: cursor ? lt(talks.createdAt, cursor) : undefined,
      limit: limit + 1,
    })
    return items
  },
  ['talks-list'], // This key might need to include limit/cursor if we cache everything
  {
    revalidate: 60, // 1 minute
    tags: ['talks-list'],
  },
)

export const viewsStats = publicProcedure.output(viewsStatsOutputSchema).handler(async () => {
  const views = await getCachedViewsStats()

  return {
    views,
  }
})

export const likesStats = publicProcedure.output(likesStatsOutputSchema).handler(async () => {
  const likes = await getCachedLikesStats()

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

    // We only cache if there is no cursor (initial load) to avoid key explosion
    // or we can choose not to cache pagination for now to keep it simple
    let items
    if (!input?.cursor) {
      // Cache only the first page
      items = await getCachedTalks(input?.limit ?? 10)
    }
    else {
      // Fetch directly for pagination
      items = await context.db.query.talks.findMany({
        columns: {
          id: true,
          content: true,
          likes: true,
          createdAt: true,
        },
        orderBy: (talks, { desc }) => [desc(talks.createdAt)],
        where: lt(talks.createdAt, input.cursor),
        limit: (input?.limit ?? 10) + 1,
      })
    }

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
    ;(revalidateTag as any)('talks-list')
    ;(revalidateTag as any)('talks-stats')
    return newTalk
  })

export const deleteTalk = adminProcedure
  .input(deleteTalkInputSchema)
  .handler(async ({ context, input }) => {
    await context.db.delete(talks).where(eq(talks.id, input.id))
    ;(revalidateTag as any)('talks-list')
    ;(revalidateTag as any)('talks-stats')
  })

export const updateTalk = adminProcedure
  .input(updateTalkInputSchema)
  .handler(async ({ context, input }) => {
    const [updatedTalk] = await context.db
      .update(talks)
      .set({ content: input.content })
      .where(eq(talks.id, input.id))
      .returning()
    ;(revalidateTag as any)('talks-list')
    return updatedTalk
  })
