import { count, desc, gt } from 'drizzle-orm'
import * as z from 'zod'
import { album, comments, friends, talks, users } from '~/db'

import { adminProcedure } from '~/orpc/root'

import {
  dashboardStatsOutputSchema,
  listAllAlbumOutputSchema,
  listAllCommentsOutputSchema,
  listAllFriendsOutputSchema,
  listAllTalksOutputSchema,
  listAllUsersOutputSchema,
  recentActivityOutputSchema,
} from '../schemas/admin.schema'

export const getDashboardStats = adminProcedure.output(dashboardStatsOutputSchema).handler(async ({ context }) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    recentUsers,
    totalComments,
    recentComments,
    totalTalks,
    recentTalks,
    totalAlbumImages,
    totalFriends,
  ] = await Promise.all([
    context.db.select({ count: count() }).from(users).then(res => res[0]?.count ?? 0),
    context.db.select({ count: count() }).from(users).where(gt(users.createdAt, sevenDaysAgo)).then(res => res[0]?.count ?? 0),
    context.db.select({ count: count() }).from(comments).then(res => res[0]?.count ?? 0),
    context.db.select({ count: count() }).from(comments).where(gt(comments.createdAt, sevenDaysAgo)).then(res => res[0]?.count ?? 0),
    context.db.select({ count: count() }).from(talks).then(res => res[0]?.count ?? 0),
    context.db.select({ count: count() }).from(talks).where(gt(talks.createdAt, sevenDaysAgo)).then(res => res[0]?.count ?? 0),
    context.db.select({ count: count() }).from(album).then(res => res[0]?.count ?? 0),
    context.db.select({ count: count() }).from(friends).then(res => res[0]?.count ?? 0),
  ])

  return {
    totalUsers,
    recentUsers,
    totalComments,
    recentComments,
    totalTalks,
    recentTalks,
    totalAlbumImages,
    totalFriends,
    totalGuestbook: 0,
  }
})

export const getRecentActivity = adminProcedure
  .input(z.object({ limit: z.number().optional() }).optional())
  .output(recentActivityOutputSchema)
  .handler(async ({ context, input }) => {
    const limit = input?.limit ?? 10

    const [recentComments, recentTalks, recentUsers] = await Promise.all([
      context.db.query.comments.findMany({
        limit,
        orderBy: desc(comments.createdAt),
        with: { user: true },
      }),
      context.db.query.talks.findMany({
        limit,
        orderBy: desc(talks.createdAt),
      }),
      context.db.query.users.findMany({
        limit,
        orderBy: desc(users.createdAt),
      }),
    ])

    const activities = [
      ...recentComments.map(c => ({
        id: c.id,
        type: 'comment' as const,
        content: c.body,
        createdAt: c.createdAt,
        user: c.user ? { name: c.user.name, image: c.user.image } : null,
      })),
      ...recentTalks.map(t => ({
        id: t.id,
        type: 'talk' as const,
        content: t.content,
        createdAt: t.createdAt,
        user: null,
      })),
      ...recentUsers.map(u => ({
        id: u.id,
        type: 'user' as const,
        content: `User joined: ${u.name}`,
        createdAt: u.createdAt,
        user: { name: u.name, image: u.image },
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)

    return activities
  })

export const listAllAlbum = adminProcedure.output(listAllAlbumOutputSchema).handler(async ({ context }) => {
  const result = await context.db.select().from(album)

  return {
    album: result,
  }
})
export const listAllFriends = adminProcedure.output(listAllFriendsOutputSchema).handler(async ({ context }) => {
  const result = await context.db.select().from(friends)

  return {
    friends: result,
  }
})

export const listAllTalks = adminProcedure.output(listAllTalksOutputSchema).handler(async ({ context }) => {
  const result = await context.db.select().from(talks)

  return {
    talks: result,
  }
})

export const listAllComments = adminProcedure.output(listAllCommentsOutputSchema).handler(async ({ context }) => {
  const result = await context.db.select().from(comments)

  return {
    comments: result,
  }
})

export const listAllUsers = adminProcedure.output(listAllUsersOutputSchema).handler(async ({ context }) => {
  const result = await context.db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)

  return {
    users: result,
  }
})
