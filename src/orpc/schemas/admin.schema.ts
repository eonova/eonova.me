import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'
import { album, comments, friends, talks, users } from '~/db'

export const listAllCommentsOutputSchema = z.object({
  comments: z.array(createSelectSchema(comments)),
})

export const listAllAlbumOutputSchema = z.object({
  album: z.array(createSelectSchema(album)),
})

export const listAllFriendsOutputSchema = z.object({
  friends: z.array(createSelectSchema(friends)),
})

export const listAllTalksOutputSchema = z.object({
  talks: z.array(createSelectSchema(talks)),
})

export const listAllUsersOutputSchema = z.object({
  users: z.array(
    createSelectSchema(users).pick({
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }),
  ),
})

export const dashboardStatsOutputSchema = z.object({
  totalUsers: z.number(),
  recentUsers: z.number(),
  totalComments: z.number(),
  recentComments: z.number(),
  totalTalks: z.number(),
  recentTalks: z.number(),
  totalAlbumImages: z.number(),
  totalFriends: z.number(),
  totalGuestbook: z.number(),
})

export const recentActivityOutputSchema = z.array(
  z.object({
    id: z.string(),
    type: z.enum(['comment', 'talk', 'user']),
    content: z.string(),
    createdAt: z.date(),
    user: z.object({
      name: z.string(),
      image: z.string().nullable(),
    }).nullable(),
  }),
)

export const deleteUserInputSchema = z.object({
  id: z.string().min(1),
})

export const updateUserInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50).optional(),
  role: z.enum(['user', 'admin']).optional(),
})

export const deleteCommentInputSchema = z.object({
  id: z.string().min(1),
})
