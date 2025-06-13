import { z } from 'zod'
import { env } from '~/lib/env'
import { createTRPCRouter, publicProcedure } from '../init'

// NeoDB 支持的类型
const CategorySchema = z.enum(['book', 'movie', 'music', 'podcast', 'tv'])
const ShelfTypeSchema = z.enum(['wishlist', 'progress', 'complete'])

// 统一的收藏项结构
function validateNeodbItem(raw: any) {
  return {
    title: raw.item?.title || raw.item?.display_title,
    detailUrl: raw.item?.url,
    coverUrl: raw.item?.cover_image_url,
    metaInfo: [
      raw.item?.category && `类型: ${raw.item.category}`,
      raw.item?.brief && `简介: ${raw.item.brief}`,
    ].filter(Boolean).join(' | '),
    createdTime: raw.created_time,
    comment: raw.comment_text,
    rate: raw.rating_grade,
    tags: raw.tags,
  }
}

async function fetchNeodbCollection({ type, category, cursor, pageSize }: { type: string, category: string, cursor?: number, pageSize?: number }) {
  const url = new URL(`https://neodb.social/api/user/eonova/shelf/${type}`)
  const token = env.NEODB_TOKEN
  if (category)
    url.searchParams.append('category', category)
  if (cursor)
    url.searchParams.append('page', String(cursor))
  if (pageSize)
    url.searchParams.append('page_size', String(pageSize))

  const res = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok)
    throw new Error('NeoDB API 请求失败')
  return res.json()
}

export const neodbRouter = createTRPCRouter({
  getShelf: publicProcedure
    .input(z.object({
      types: z.array(ShelfTypeSchema),
      config: CategorySchema,
      cursor: z.number().optional().default(1),
    }))
    .query(async ({ input }) => {
      try {
        const pageSize = 24
        const data = await fetchNeodbCollection({
          type: input.types[0]!,
          category: input.config,
          cursor: input.cursor,
          pageSize,
        })
        const total = data.count ?? 0
        const nextCursor = (input.cursor ?? 1) * pageSize < total ? (input.cursor ?? 1) + 1 : undefined
        return {
          success: true,
          data: {
            items: (data.data || []).map(validateNeodbItem),
            nextCursor,
            total,
          },
        }
      }
      catch (error: any) {
        return {
          success: false,
          message: error.message || 'NeoDB API 请求异常',
        }
      }
    }),
})
