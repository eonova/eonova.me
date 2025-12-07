import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { notes, sum } from '~/db'

import { publicProcedure } from '../root'
import { likesStatsOutputSchema, viewsStatsOutputSchema } from '../schemas/content.schema'

export const viewsStats = publicProcedure.output(viewsStatsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(notes.views),
    })
    .from(notes)

  const views = result?.value ? Number(result.value) : 0

  return {
    views,
  }
})

export const likesStats = publicProcedure.output(likesStatsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(notes.likes),
    })
    .from(notes)

  const likes = result?.value ? Number(result.value) : 0

  return {
    likes,
  }
})

export const bySlug = publicProcedure
  .input(z.object({ slug: z.string() }))
  .handler(async ({ context, input }) => {
    const note = await context.db.query.notes.findFirst({
      where: eq(notes.title, input.slug),
    })

    return note
  })
