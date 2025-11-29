import * as z from 'zod'

export const AddImageInputSchema = z.object({
  imageUrl: z.string(),
  description: z.string(),
  height: z.number(),
  width: z.number(),
})
export const DeleteImageInputSchema = z.object({
  id: z.string(),
})

export const UpdateImageInputSchema = z.object({
  id: z.string().nonempty(),
  imageUrl: z.string(),
  description: z.string(),
  height: z.number(),
  width: z.number(),
})
