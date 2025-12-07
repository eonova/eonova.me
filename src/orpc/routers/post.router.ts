import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { posts, sum } from '~/db'

import { publicProcedure } from '../root'
import { likesStatsOutputSchema, viewsStatsOutputSchema } from '../schemas/content.schema'

export const viewsStats = publicProcedure.output(viewsStatsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(posts.views),
    })
    .from(posts)

  const views = result?.value ? Number(result.value) : 0

  return {
    views,
  }
})

export const likesStats = publicProcedure.output(likesStatsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(posts.likes),
    })
    .from(posts)

  const likes = result?.value ? Number(result.value) : 0

  return {
    likes,
  }
})

export const bySlug = publicProcedure
  .input(z.object({ slug: z.string() }))
  .handler(async ({ context, input }) => {
    const post = await context.db.query.posts.findFirst({
      where: eq(posts.slug, input.slug),
    })

    return post
  })
