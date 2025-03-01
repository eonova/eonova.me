// src/types/douban.ts
import type { mapDoubanUser } from '~/utils/douban/map-douban-user'
import { z } from 'zod'

/** ​ 豆瓣内容类型 */
export type DoubanType = 'book' | 'movie'

/** ​ 用户操作类型 */
export type DoubanAction = 'do' | 'wish' | 'collect'

/** ​ 评分等级 */
export type RateLevel = '粪作' | '封神' | '一般' | '较好' | '佳作'

/** ​ 基础条目信息 */
export interface DoubanItem {
  /** ​ 条目标题 */
  title: string
  /** ​ 豆瓣条目详情页URL */
  detailUrl: string
  /** ​ 封面图URL */
  coverUrl: string
  /** ​ 元数据组合（作者/导演等） */
  metaInfo: string
  /** ​ 标记信息（日期/标签） */
  markInfo: string
  /** ​ 上映时间 */
  publishDate: string
  /** ​ 评分等级 */
  rate?: RateLevel
  /** ​ 用户评论 */
  comment?: string
}

/** ​ 分页数据容器 */
export interface PaginatedData<T> {
  /** ​ 当前页码 */
  currentPage: number
  /** ​ 每页数量 */
  pageSize: number
  /** ​ 总页数 */
  totalPages: number
  /** ​ 数据列表 */
  list: T[]
}

/** ​ 用户数据上下文 */
export interface DoubanContext {
  /** ​ 当前类型 */
  type: DoubanType
  /** ​ 引用文本 */
  quote?: string
  /** ​ 分页配置 */
  pagination: Omit<PaginatedData<unknown>, 'list'>
  /** ​ 分类数据集合 */
  collections: Array<{
    /** ​ 操作类型 */
    action: DoubanAction
    /** ​ 具体条目 */
    items: DoubanItem[]
  }>
}

/** ​ 豆瓣用户信息 */
export interface DoubanUser {
  /** ​ 用户唯一标识 */
  id: string
  /** ​ 用户主页路径 */
  profilePath: string
  /** ​ 显示名称 */
  displayName: string
  /** ​ 头像URL */
  avatarUrl: string
  /** ​ 各类型统计 */
  stats: Record<DoubanType, Record<DoubanAction, number>>
  /** ​ 时间戳信息 */
  timestamps: {
    /** ​ 数据发布时间 */
    publishedAt: Date
    /** ​ 最后同步时间 */
    lastSyncedAt: Date
    /** ​ 最后验证时间 */
    lastCheckedAt: Date
  }
}

/** ​ 插件配置项 */
export interface DoubanPluginConfig {
  /** ​ DOM选择器 */
  selector: string
  /** ​ 语言环境 */
  locale: 'zh-CN' | 'en-US'
  /** ​ 豆瓣用户ID */
  userId: string
  /** ​ 请求来源控制 */
  httpHeaders: {
    referer: string
    /** ​ 可扩展其他头信息 */
    [key: string]: string
  }
  /** ​ 内容类型配置 */
  contentConfig: {
    /** ​ 当前处理类型 */
    type: DoubanType
    /** ​ 允许的操作类型 */
    allowedActions: DoubanAction[]
    /** ​ 是否显示引用 */
    showQuote: boolean
    /** ​ 分页设置 */
    pagination: {
      defaultPageSize: number
      maxVisibleLines: number
    }
  }
  /** ​ 预加载数据 */
  prefetchedData?: Array<{
    action: DoubanAction
    items: DoubanItem[]
  }>
}
export const MovieActionSchema = z.enum(['do', 'wish', 'collect'])
export type MovieAction = z.infer<typeof MovieActionSchema>

export interface DoubanResponseType {
  user: ReturnType<typeof mapDoubanUser>
  collections: {
    action: MovieAction
    items: DoubanItem[]
  }[]
  pagination: {
    pageSize: number
    maxVisibleLines: number
  }
}

export interface DoubanDataResponse {
  success: boolean
  data: DoubanResponseType
  error?: string
};
