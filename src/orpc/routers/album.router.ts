import { ORPCError } from '@orpc/client'

import { album, desc, eq } from '~/db'
import { ratelimit } from '~/lib/kv'
import { adminProcedure, publicProcedure } from '~/orpc/root'
import { getIp } from '~/utils/get-ip'
import { AddImageInputSchema, DeleteImageInputSchema, UpdateImageInputSchema } from '../schemas/album.schema'

const getKey = (id: string) => `album:${id}`

export const listAllImages = publicProcedure.handler(async ({ context }) => {
  const ip = getIp(context.headers)

  const { success } = await ratelimit.limit(getKey(`get:${ip}`))

  if (!success)
    throw new ORPCError('TOO_MANY_REQUESTS')

  const result = await context.db.query.album.findMany({
    columns: {
      id: true,
      imageUrl: true,
      height: true,
      width: true,
      description: true,
      createdAt: true,
    },
    orderBy: desc(album.createdAt),
  })

  return {
    images: result,
  }
})

export const addImage = adminProcedure
  .input(AddImageInputSchema)
  .handler(async ({ context, input }) => {
    const { imageUrl, description, height, width } = input
    await context.db.insert(album).values({
      imageUrl,
      description,
      width,
      height,
    })
  })

export const deleteImage = adminProcedure
  .input(DeleteImageInputSchema)
  .handler(async ({ context, input }) => {
    await context.db.delete(album).where(eq(album.id, input.id))
  })

export const updateImage = adminProcedure
  .input(UpdateImageInputSchema)
  .handler(async ({ context, input }) => {
    const { id, imageUrl, description, height, width } = input
    await context.db
      .update(album)
      .set({
        ...(imageUrl ? { imageUrl } : {}),
        ...(description ? { description } : {}),
        ...(height ? { height } : {}),
        ...(width ? { width } : {}),
      })
      .where(eq(album.id, id))
  })
