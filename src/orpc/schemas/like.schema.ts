import * as z from 'zod'

export const countLikeInputSchema = z.object({
  slug: z.string(),
  contentType: z.enum(['posts', 'notes', 'talks']).default('posts'),
})

export const countLikeOutputSchema = z.object({
  likes: z.number(),
  currentUserLikes: z.number(),
})

export { countLikeOutputSchema as incrementLikeOutputSchema }

export const incrementLikeInputSchema = z.object({
  slug: z.string().min(1),
  value: z.number().int().positive().min(1).max(3),
  contentType: z.enum(['posts', 'notes', 'talks']).default('posts'),
})
