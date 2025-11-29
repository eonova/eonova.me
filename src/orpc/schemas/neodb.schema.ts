import * as z from 'zod'

const NeoShelfTypeSchema = z.enum(['wishlist', 'progress', 'complete'])

const NeoCategorySchema = z.enum([
  'book',
  'movie',
  'tv',
  'music',
  'game',
  'podcast',
  'performance',
])

export const listNeoShelfInputSchema = z.object({
  types: z.array(NeoShelfTypeSchema),
  category: NeoCategorySchema,
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(1).max(100).optional().default(24),
})

const neoItemSchema = z.object({
  title: z.string(),
  detailUrl: z.string(),
  apiUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  brief: z.string().optional(),
  category: z.string(),
  createdTime: z.string(),
  comment: z.string().optional(),
  rating: z.number().optional(),
  ratingGrade: z.number().optional(),
  tags: z.array(z.string()).optional(),
})

export const listNeoShelfOutputSchema = z.object({
  items: z.array(neoItemSchema),
  nextCursor: z.number().optional(),
})
