import { ORPCError } from '@orpc/client'
import { eq, sql } from '~/db'

import { getContent, getContentDB } from '~/utils/get-content-db'
import { cache } from '../cache'
import { publicProcedure } from '../root'
import {
  countViewInputSchema,
  countViewOutputSchema,
  incrementViewInputSchema,
  incrementViewOutputSchema,
} from '../schemas/view.schema'

export const countView = publicProcedure
  .input(countViewInputSchema)
  .output(countViewOutputSchema)
  .handler(async ({ input, context }) => {
    const cached = await cache[input.contentType].views.get(input.slug)
    if (cached)
      return cached
    const { contentType } = input
    const typeDB = getContentDB(contentType)

    const [content] = await context.db.select({ views: typeDB.views }).from(typeDB).where(eq(getContent(contentType), input.slug))

    if (!content) {
      throw new ORPCError('NOT_FOUND', {
        message: `${contentType} not found`,
      })
    }

    const viewsData = { views: content.views }

    await cache[contentType].views.set(viewsData, input.slug)

    return viewsData
  })

export const incrementView = publicProcedure
  .input(incrementViewInputSchema)
  .output(incrementViewOutputSchema)
  .handler(async ({ input, context }) => {
    const { contentType } = input
    const typeDB = getContentDB(contentType)
    const val = contentType === 'talks'
      ? { content: input.slug }
      : contentType === 'notes'
        ? { title: input.slug }
        : { slug: input.slug }
    const [result] = await context.db
      .insert(typeDB)
      .values({
        ...val,
        views: 1,
      })
      .onConflictDoUpdate({
        target: getContent(contentType),
        set: {
          views: sql`${typeDB.views} + 1`,
        },
      })
      .returning()

    if (!result) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to increment view',
      })
    }

    const viewsData = { views: result.views }
    await cache[contentType].views.set(viewsData, input.slug)

    return viewsData
  })
