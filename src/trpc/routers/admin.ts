import { TRPCError } from '@trpc/server'
import { and, count, desc, gte, sql } from 'drizzle-orm'
import { z } from 'zod'
import { album, comments, friend, guestbook, talks, users } from '~/db'
import { adminProcedure, createTRPCRouter } from '../init'

export const adminRouter = createTRPCRouter({
  // 获取仪表盘统计数据
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    try {
      // 获取总用户数
      const totalUsersResult = await ctx.db.select({ count: count() }).from(users)

      // 获取总评论数
      const totalCommentsResult = await ctx.db
        .select({ count: count() })
        .from(comments)
        .where(sql`${comments.isDeleted} = false`)

      // 获取总说说数
      const totalTalksResult = await ctx.db.select({ count: count() }).from(talks)

      // 获取总相册图片数
      const totalAlbumResult = await ctx.db.select({ count: count() }).from(album)

      // 获取总友链数
      const totalFriendsResult = await ctx.db.select({ count: count() }).from(friend)

      // 获取总留言数
      const totalGuestbookResult = await ctx.db.select({ count: count() }).from(guestbook)

      // 获取最近7天的用户注册数
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const recentUsersResult = await ctx.db
        .select({ count: count() })
        .from(users)
        .where(gte(users.createdAt, sevenDaysAgo))

      // 获取最近7天的评论数
      const recentCommentsResult = await ctx.db
        .select({ count: count() })
        .from(comments)
        .where(and(gte(comments.createdAt, sevenDaysAgo), sql`${comments.isDeleted} = false`))

      // 获取最近7天的说说数
      const recentTalksResult = await ctx.db
        .select({ count: count() })
        .from(talks)
        .where(gte(talks.createdAt, sevenDaysAgo))

      return {
        totalUsers: totalUsersResult[0]?.count ?? 0,
        totalComments: totalCommentsResult[0]?.count ?? 0,
        totalTalks: totalTalksResult[0]?.count ?? 0,
        totalAlbumImages: totalAlbumResult[0]?.count ?? 0,
        totalFriends: totalFriendsResult[0]?.count ?? 0,
        totalGuestbook: totalGuestbookResult[0]?.count ?? 0,
        recentUsers: recentUsersResult[0]?.count ?? 0,
        recentComments: recentCommentsResult[0]?.count ?? 0,
        recentTalks: recentTalksResult[0]?.count ?? 0,
      }
    }
    catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `获取统计数据失败${error}`,
      })
    }
  }),

  // 获取最近活动
  getRecentActivity: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // 获取最近的评论
        const recentComments = await ctx.db
          .select({
            id: comments.id,
            type: sql<'comment'>`'comment'`,
            content: comments.body,
            createdAt: comments.createdAt,
            user: {
              name: users.name,
              image: users.image,
            },
          })
          .from(comments)
          .leftJoin(users, sql`${comments.userId} = ${users.id}`)
          .where(sql`${comments.isDeleted} = false`)
          .orderBy(desc(comments.createdAt))
          .limit(input.limit)

        // 获取最近的说说
        const recentTalks = await ctx.db
          .select({
            id: talks.id,
            type: sql<'talk'>`'talk'`,
            content: talks.content,
            createdAt: talks.createdAt,
            user: sql<{ name: string, image: string | null }>`NULL`,
          })
          .from(talks)
          .orderBy(desc(talks.createdAt))
          .limit(input.limit)

        // 获取最近的用户注册
        const recentUsers = await ctx.db
          .select({
            id: users.id,
            type: sql<'user'>`'user'`,
            content: sql<string>`${users.name} || ' 加入了网站'`,
            createdAt: users.createdAt,
            user: {
              name: users.name,
              image: users.image,
            },
          })
          .from(users)
          .orderBy(desc(users.createdAt))
          .limit(input.limit)

        // 合并所有活动并按时间排序
        const allActivities = [...recentComments, ...recentTalks, ...recentUsers].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

        return allActivities.slice(0, input.limit)
      }
      catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `获取最近活动失败${error}`,
        })
      }
    }),

  // 获取用户增长趋势（最近30天）
  getUserGrowthTrend: adminProcedure.query(async ({ ctx }) => {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const growthData = await ctx.db
        .select({
          date: sql<string>`DATE(${users.createdAt})`,
          count: count(),
        })
        .from(users)
        .where(gte(users.createdAt, thirtyDaysAgo))
        .groupBy(sql`DATE(${users.createdAt})`)
        .orderBy(sql`DATE(${users.createdAt})`)

      return growthData
    }
    catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `获取用户增长趋势失败${error}`,
      })
    }
  }),

  // 获取内容统计（按类型）
  getContentStats: adminProcedure.query(async ({ ctx }) => {
    try {
      const commentsByType = await ctx.db
        .select({
          type: comments.contentType,
          count: count(),
        })
        .from(comments)
        .where(sql`${comments.isDeleted} = false`)
        .groupBy(comments.contentType)

      return commentsByType
    }
    catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `获取内容统计失败${error}`,
      })
    }
  }),
})
