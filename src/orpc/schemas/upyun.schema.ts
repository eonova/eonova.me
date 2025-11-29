import * as z from 'zod'

export const uploadInputSchema = z.object({
  file: z.string(),
  path: z.string(),
  filename: z.string(),
  mimetype: z.string(),
})
