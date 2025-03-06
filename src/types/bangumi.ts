import { z } from 'zod'

export type AnimeAction = 'wish' | 'watched' | 'watching' | 'shelving' | 'abandon'
export enum AnimeType {
  wish = 1,
  watched = 2,
  watching = 3,
  shelving = 4,
  abandon = 5,
}
export const AnimeActionSchema = z.enum(['wish', 'watched', 'watching', 'shelving', 'abandon'])

export interface BangumiPluginConfig {
  contentConfig?: {
    pagination?: {
      limit?: number
      offset?: number
    }
  }
}

export interface BangumiItem {
  title: string
  detailUrl: string
  coverUrl?: string
  metaInfo: string
  publishDate: string
  collectionInfo: string
  comment?: string
  score?: string
  episodesInfo?: string
}
