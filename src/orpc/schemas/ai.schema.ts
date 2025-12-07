import * as z from 'zod'

export const AIAbstractInputSchema = z.object({
  content: z.string().min(50),
  slug: z.string().min(1),
  type: z.enum(['post', 'note']).default('post'),
})
