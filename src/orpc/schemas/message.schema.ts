import * as z from 'zod'

export const createMessageOutputSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  body: z.string(),
})

export const createMessageInputSchema = z.object({
  message: z.string().min(1),
})

export const listMessagesOutputSchema = z.object({
  messages: z.array(
    createMessageOutputSchema.extend({
      user: z.object({
        name: z.string().nullable(),
        image: z.string().nullable(),
        id: z.string(),
      }),
    }),
  ),
  nextCursor: z.date().optional(),
})

export const deleteMessageInputSchema = z.object({
  id: z.string(),
})

export { infiniteQuerySchema as listMessagesInputSchema } from './common.schema'
