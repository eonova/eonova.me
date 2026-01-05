import * as z from 'zod'

export const infiniteQuerySchema = z.object({
  cursor: z.coerce.date().optional(),
  limit: z.number().min(1).max(50).default(10),
})

export const emptyOutputSchema = z.undefined()
