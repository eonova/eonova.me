import { relations, sql } from 'drizzle-orm'
import { check, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { notes } from './notes'
import { posts } from './posts'
import { talks } from './talks'

export const contentLikes = pgTable(
  'content_likes',
  {
    contentId: text('content_id').notNull(),
    anonKey: text('anon_key').notNull(),
    likeCount: integer('like_count').notNull().default(0),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  contentLike => [
    primaryKey({ columns: [contentLike.contentId, contentLike.anonKey] }),
    check('content_likes_like_count_check', sql`${contentLike.likeCount} BETWEEN 0 AND 3`),
  ],
)

export const contentLikesRelations = relations(contentLikes, ({ one }) => ({
  post: one(posts, {
    fields: [contentLikes.contentId],
    references: [posts.slug],
  }),
  note: one(notes, {
    fields: [contentLikes.contentId],
    references: [notes.title],
  }),
  talk: one(talks, {
    fields: [contentLikes.contentId],
    references: [talks.id],
  }),
}))
