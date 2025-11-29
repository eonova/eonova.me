import { ORPCError } from '@orpc/client'
import { and, contentLikes, eq, posts, sql } from '~/db'

import { getAnonKey } from '~/utils/get-anon-key'
import { getIp } from '~/utils/get-ip'

import { cache } from '../cache'
import { publicProcedure } from '../root'
import {
  countLikeInputSchema,
  countLikeOutputSchema,
  incrementLikeInputSchema,
  incrementLikeOutputSchema,
} from '../schemas/like.schema'

export const countLike = publicProcedure
  .input(countLikeInputSchema)
  .output(countLikeOutputSchema)
  .handler(async ({ input, context }) => {
    const { contentType } = input
    const ip = getIp(context.headers)
    const anonKey = getAnonKey(ip)

    // Check cache for both global and user-specific like counts
    const [cachedLikes, cachedUserLikes] = await Promise.all([
      cache[contentType].likes.get(input.slug),
      cache[contentType].userLikes.get(input.slug, anonKey),
    ])

    // If both are cached, return immediately
    if (cachedLikes !== null && cachedUserLikes !== null) {
      return {
        likes: cachedLikes,
        currentUserLikes: cachedUserLikes,
      }
    }

    // Fetch missing data from DB
    const [[post], [user]] = await Promise.all([
      cachedLikes === null
        ? context.db.select({ likes: posts.likes }).from(posts).where(eq(posts.slug, input.slug))
        : Promise.resolve([null]),
      cachedUserLikes === null
        ? context.db
            .select({ likeCount: contentLikes.likeCount })
            .from(contentLikes)
            .where(and(eq(contentLikes.contentId, input.slug), eq(contentLikes.anonKey, anonKey)))
        : Promise.resolve([null]),
    ])

    if (cachedLikes === null && !post) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Content not found',
      })
    }

    const likes = cachedLikes ?? post!.likes
    const currentUserLikes = cachedUserLikes ?? user?.likeCount ?? 0

    // Cache any missing values
    const cachePromises = []
    if (cachedLikes === null) {
      cachePromises.push(cache[contentType].likes.set(likes, input.slug))
    }
    if (cachedUserLikes === null) {
      cachePromises.push(cache[contentType].userLikes.set(currentUserLikes, input.slug, anonKey))
    }
    await Promise.all(cachePromises)

    return {
      likes,
      currentUserLikes,
    }
  })

export const incrementLike = publicProcedure
  .input(incrementLikeInputSchema)
  .output(incrementLikeOutputSchema)
  .handler(async ({ input, context }) => {
    const { contentType } = input
    const ip = getIp(context.headers)
    const anonKey = getAnonKey(ip)

    const [content, currentUserLikes] = await context.db.transaction(async (tx) => {
      // Validate content existence first
      const [existingContent] = await tx.select({ contentId: contentLikes.contentId }).from(contentLikes).where(eq(contentLikes.contentId, input.slug))

      if (!existingContent) {
        throw new ORPCError('NOT_FOUND', {
          message: 'Content not found',
        })
      }

      // Try to update existing like record with atomic validation
      const updated = await tx
        .update(contentLikes)
        .set({ likeCount: sql`${contentLikes.likeCount} + ${input.value}` })
        .where(
          and(
            eq(contentLikes.contentId, input.slug),
            eq(contentLikes.anonKey, anonKey),
            sql`${contentLikes.likeCount} + ${input.value} <= 3`,
          ),
        )
        .returning()

      let userLikes

      if (updated.length > 0) {
        // Update succeeded
        userLikes = updated[0]
      }
      else {
        // Update returned 0 rows - either record doesn't exist or limit would be exceeded
        const [existing] = await tx
          .select()
          .from(contentLikes)
          .where(and(eq(contentLikes.contentId, input.slug), eq(contentLikes.anonKey, anonKey)))

        if (existing && existing.likeCount + input.value > 3) {
          // Record exists and limit would be exceeded
          throw new ORPCError('BAD_REQUEST', {
            message: 'You can only like a content 3 times',
          })
        }

        // Insert with conflict handling to prevent race conditions
        const [inserted] = await tx
          .insert(contentLikes)
          .values({ contentId: input.slug, anonKey, likeCount: input.value })
          .onConflictDoUpdate({
            target: [contentLikes.contentId, contentLikes.anonKey],
            set: { likeCount: sql`${contentLikes.likeCount} + ${input.value}` },
          })
          .returning()

        if (!inserted) {
          throw new ORPCError('INTERNAL_SERVER_ERROR', {
            message: 'Failed to insert like record',
          })
        }

        // Validate limit after insert/update (transaction will rollback if exceeded)
        if (inserted.likeCount > 3) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'You can only like a post 3 times',
          })
        }

        userLikes = inserted
      }

      // Update the post's total like count
      const [postResult] = await tx
        .update(posts)
        .set({ likes: sql`${posts.likes} + ${input.value}` })
        .where(eq(posts.slug, input.slug))
        .returning()

      return [postResult, userLikes]
    })

    if (!content || !currentUserLikes) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to increment like',
      })
    }

    // Update both global and user-specific like caches
    await Promise.all([
      cache[contentType].likes.set(content.likes, input.slug),
      cache[contentType].userLikes.set(currentUserLikes.likeCount, input.slug, anonKey),
    ])

    return {
      likes: content.likes,
      currentUserLikes: currentUserLikes.likeCount,
    }
  })
