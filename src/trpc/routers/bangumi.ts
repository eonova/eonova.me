import type { AnimeAction, BangumiItem, BangumiPluginConfig } from '~/types/bangumi'
import { z } from 'zod'
import { env } from '~/lib/env'
import { AnimeActionSchema, AnimeType } from '~/types/bangumi'
import { handleApiError } from '~/utils'
import { createTRPCRouter, publicProcedure } from '../trpc'

function validateBangumiItem(raw: any): BangumiItem {
  return {
    title: raw.name_cn || raw.name,
    detailUrl: `https://bgm.tv/subject/${raw.id}`,
    coverUrl: raw.images?.medium,
    metaInfo: [
      raw.type === 2 ? '动画' : '其他媒体',
      `导演: ${raw.staff?.find((s: any) => s.role === '导演')?.name || '未知'}`,
      `声优: ${raw.cast?.slice(0, 3).map((c: any) => c.name).join('/') || '暂无'}`,
      `制作: ${raw.production?.join('/') || '未知'}`,
    ].filter(Boolean).join(' | '),
    publishDate: raw.date,
    collectionInfo: [
      raw.updated && new Date(raw.updated).toLocaleDateString(),
    ].filter(Boolean).join(' · '),
    score: raw.score,
    comment: raw.comment?.replace(/\\n/g, '\n'),
    episodesInfo: raw.eps ? `全${raw.eps}话` : undefined,
  }
}

async function fetchAnimeCollection(
  userId: string,
  type: AnimeAction,
  config: Partial<BangumiPluginConfig>,
  offset: number,
) {
  const endpoint = new URL(`https://api.bgm.tv/v0/users/${userId}/collections`)
  const limit = config.contentConfig?.pagination?.limit || 24

  endpoint.searchParams.append('subject_type', '2')
  endpoint.searchParams.append('type', AnimeType[type].toString())
  endpoint.searchParams.append('limit', limit.toString())
  endpoint.searchParams.append('offset', offset.toString())

  const res = await fetch(endpoint.toString(), {
    headers: {
      'User-Agent': 'BangumiTRPC/1.0',
    },
  })

  const data = await res.json()
  return {
    items: data.data?.map((item: any) => ({
      ...item.subject,
      comment: item.comment,
    })) || [],
    total: data.total || 0,
  }
}

export const bangumiRouter = createTRPCRouter({
  getAnimeData: publicProcedure
    .input(z.object({
      types: z.array(AnimeActionSchema),
      config: z.custom<Partial<BangumiPluginConfig>>(),
      cursor: z.number().optional().default(0),
    }))
    .query(async ({ input }) => {
      try {
        const { items, total } = await fetchAnimeCollection(
          env.BANGUMI_USERNAME,
          input.types[0]!,
          input.config,
          input.cursor,
        )

        const limit = input.config.contentConfig?.pagination?.limit || 24
        const nextCursor = input.cursor + limit < total ? input.cursor + limit : undefined

        return {
          success: true,
          data: {
            items: items.map(validateBangumiItem),
            nextCursor,
            total,
          },
        }
      }
      catch (error) {
        return handleApiError(error)
      }
    }),
})
