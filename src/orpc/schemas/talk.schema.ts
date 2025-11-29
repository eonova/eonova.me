import * as z from 'zod'

export const listAllTalksInputSchema
  = z.object({
    limit: z.number().min(1).max(100).default(10),
    cursor: z.date().optional(),
  })
    .optional()

export const createTalkInputSchema = z.object({
  content: z.string().min(1, '内容不能为空').max(500, '内容长度不能超过500字符'),
})

export const deleteTalkInputSchema = z.object({ id: z.string() })

export const updateTalkInputSchema = z.object({
  id: z.string().nonempty(),
  content: z.string().min(1, '内容不能为空').max(500, '内容长度不能超过500字符'),
})
