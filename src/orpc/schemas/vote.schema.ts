import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'
import { votes } from '~/db'

export const createVoteInputSchema = z.object({
  id: z.string(),
  isLike: z.boolean().nullable(),
})

export const createVoteOutputSchema = createSelectSchema(votes)
