import type { DoubanItem, DoubanPluginConfig, MovieAction } from '~/types/douban'
import { z } from 'zod'
import { MovieActionSchema } from '~/types/douban'
import { buildErrorResponse } from '~/utils/build-error-response'
import { fetchUser } from '~/utils/douban/fetch-douban-user'
import { getRateLevel } from '~/utils/douban/get-rate-level'
import { handleApiError } from '~/utils/douban/handle-api-error'
import { mapDoubanUser } from '~/utils/douban/map-douban-user'
import { createTRPCRouter, publicProcedure } from '../trpc'

function validateMovieItem(raw: any): DoubanItem {
  return {
    title: raw.item.title,
    detailUrl: `https://movie.douban.com/subject/${raw.item.douban_id}/`,
    coverUrl: raw.item.thumbnail,
    metaInfo: [
      raw.style,
      `导演: ${raw.item.director}`,
      `编剧: ${raw.item.writer}`,
      `主演: ${raw.item.actor}`,
    ].filter(Boolean).join(' | '),
    publishDate: raw.item.publish_date,
    markInfo: [raw.mark_date, raw.label].filter(Boolean).join(' · '),
    rate: raw.rate ? getRateLevel(raw.rate) : undefined,
    comment: raw.comment,
  }
}

async function fetchMovieAction(userId: string, action: MovieAction, config: Partial<DoubanPluginConfig>) {
  const res = await fetch(
    `https://mouban.mythsman.com/guest/user_movie?action=${action}&id=${userId}`,
    { headers: config.httpHeaders },
  )
  const data = await res.json()
  return {
    action,
    items: data.result?.comment || [],
  }
}

export const moviesRouter = createTRPCRouter({
  getMovieData: publicProcedure
    .input(z.object({
      userId: z.string(),
      actions: z.array(MovieActionSchema),
      config: z.custom<Partial<DoubanPluginConfig>>(),
    }))
    .query(async ({ input }) => {
      try {
        // 1. 验证用户有效性
        const userRes = await fetchUser(input.userId, input.config.httpHeaders?.referer)
        if (!userRes.success) {
          return buildErrorResponse(userRes.msg || '用户验证失败')
        }

        // 2. 并行获取各动作数据
        const actionsData = await Promise.all(
          input.actions.map(action =>
            fetchMovieAction(input.userId, action, input.config),
          ),
        )

        // 3. 构建标准化响应
        return {
          success: true,
          data: {
            user: mapDoubanUser(userRes.result),
            collections: actionsData.map(data => ({
              action: data.action,
              items: data.items.map(validateMovieItem),
            })),
            pagination: {
              pageSize: input.config.contentConfig?.pagination.defaultPageSize || 10,
              maxVisibleLines: input.config.contentConfig?.pagination.maxVisibleLines || 4,
            },
          },
        }
      }
      catch (error) {
        return handleApiError(error)
      }
    }),
})
