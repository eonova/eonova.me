import * as z from 'zod'

export const listAllFriendsInputSchema
  = z
    .object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.date().optional(),
    })
    .optional()

export const createFriendInputSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(100, '名称不能超过100字符'),
  url: z.string().url('请输入有效的URL'),
  avatar: z.string().url('请输入有效的头像URL').optional(),
  description: z.string().optional(),
})

export const deleteFriendInputSchema = z.object({ id: z.string() })

export const updateFriendInputSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().min(1, '名称不能为空').max(100, '名称不能超过100字符'),
  url: z.string().url('请输入有效的URL'),
  avatar: z.string().url('请输入有效的头像URL').optional(),
  description: z.string().optional(),
})
