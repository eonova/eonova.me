// src/trpc/routers/books.ts
import type { DoubanItem, DoubanPluginConfig } from '~/types/douban'
import { z } from 'zod'
import { env } from '~/lib/env'
import { buildErrorResponse, fetchUser, getRateLevel, handleApiError, mapDoubanUser } from '~/utils'
import { createTRPCRouter, publicProcedure } from '../init'

const BookActionSchema = z.enum(['do', 'wish', 'collect'])
type BookAction = z.infer<typeof BookActionSchema>

function validateBookItem(raw: any): DoubanItem {
  return {
    title: raw.item.title,
    detailUrl: `https://book.douban.com/subject/${raw.item.douban_id}/`,
    coverUrl: raw.item.thumbnail,
    metaInfo: [
      raw.item.author && `作者: ${raw.item.author}`,
      raw.item.translator && `译者: ${raw.item.translator}`,
      raw.item.press && `出版社: ${raw.item.press}`,
      raw.item.producer && `出品方: ${raw.item.producer}`,
    ].filter(Boolean).join(' | '),
    publishDate: raw.item.publish_date,
    markInfo: [raw.mark_date, raw.label].filter(Boolean).join(' · '),
    rate: (raw.rate ? getRateLevel(raw.rate) : undefined),
    comment: raw.comment,
  }
}

// 共享函数和类型与movies.ts类似，主要差异在数据处理部分
export const booksRouter = createTRPCRouter({
  getBookData: publicProcedure
    .input(z.object({
      actions: z.array(BookActionSchema),
      config: z.custom<Partial<DoubanPluginConfig>>(),
    }))
    .query(async ({ input }) => {
      try {
        const userRes = await fetchUser(env.DOUBAN_ID, input.config.httpHeaders?.referer)
        if (!userRes.success) {
          return buildErrorResponse(userRes.msg ?? '用户验证失败')
        }

        const actionsData = await Promise.all(
          input.actions.map(action =>
            fetchBookAction(env.DOUBAN_ID, action, input.config),
          ),
        )

        return {
          success: true,
          data: {
            user: mapDoubanUser(userRes.result),
            collections: actionsData.map(data => ({
              action: data.action,
              items: data.items.map(validateBookItem),
            })),
            pagination: {
              pageSize: input.config.contentConfig?.pagination.defaultPageSize ?? 10,
              maxVisibleLines: input.config.contentConfig?.pagination.maxVisibleLines ?? 4,
            },
          },
        }
      }
      catch (error) {
        return handleApiError(error)
      }
    }),
})

async function fetchBookAction(userId: string, action: BookAction, config: Partial<DoubanPluginConfig>) {
  const res = await fetch(
    `https://mouban.mythsman.com/guest/user_book?action=${action}&id=${userId}`,
    { headers: config.httpHeaders },
  )
  const data = await res.json()
  return {
    action,
    items: data.result?.comment ?? [],
  }
}
