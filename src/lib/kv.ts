import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from './env'

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '10 s'),
  analytics: true,
})

export const redisKeys = {
  // 文章相关缓存
  postViews: (slug: string) => `post:views:${slug}`,
  postViewCount: 'post:views:count',
  postLikes: (slug: string) => `post:likes:${slug}`,
  postLikeCount: 'post:likes:count',
  currentUserLikes: (slug: string, sessionId: string) =>
    `post:likes:${slug}:current-user-likes:${sessionId}`,

  // 内容缓存
  postContent: (slug: string) => `content:post:${slug}`,
  noteContent: (slug: string) => `content:note:${slug}`,
  projectContent: (slug: string) => `content:project:${slug}`,

  // 列表缓存
  postsList: (page: number, perPage: number) => `list:posts:${page}:${perPage}`,
  notesList: (page: number, perPage: number) => `list:notes:${page}:${perPage}`,
  projectsList: (page: number, perPage: number) => `list:projects:${page}:${perPage}`,

  // 用户相关缓存
  userProfile: (userId: string) => `user:profile:${userId}`,
  userComments: (userId: string, page: number) => `user:comments:${userId}:${page}`,

  // 统计数据缓存
  siteStats: 'stats:site',
  popularPosts: 'stats:popular:posts',
  recentComments: 'stats:recent:comments',

  // 第三方API缓存
  doubanMovies: (userId: string, action: string) => `douban:movies:${userId}:${action}`,
  doubanBooks: (userId: string, action: string) => `douban:books:${userId}:${action}`,
  bangumiAnime: (username: string, type: string, cursor: number) =>
    `bangumi:anime:${username}:${type}:${cursor}`,
  githubStats: (username: string) => `github:stats:${username}`,
  spotifyNowPlaying: (userId: string) => `spotify:now-playing:${userId}`,
}

// 缓存TTL配置（秒）
export const cacheTTL = {
  // 内容缓存 - 较长时间，因为内容不经常变化
  content: 3600, // 1小时
  contentLong: 86400, // 24小时，用于很少变化的内容

  // 列表缓存 - 中等时间
  lists: 1800, // 30分钟
  listsShort: 600, // 10分钟，用于频繁更新的列表

  // 统计数据 - 中等时间
  stats: 900, // 15分钟
  statsLong: 3600, // 1小时，用于不常变化的统计

  // 用户数据 - 较短时间
  user: 600, // 10分钟
  userSession: 1800, // 30分钟，用户会话数据

  // 第三方API - 根据API特性设置
  douban: 7200, // 2小时，豆瓣数据变化不频繁
  bangumi: 3600, // 1小时
  github: 1800, // 30分钟
  spotify: 60, // 1分钟，音乐状态变化频繁

  // 实时数据 - 很短时间
  realtime: 30, // 30秒

  // 页面缓存
  page: 300, // 5分钟
  pageStatic: 3600, // 1小时，静态页面

  // 搜索缓存
  search: 1800, // 30分钟
  searchPopular: 3600, // 1小时，热门搜索
}
