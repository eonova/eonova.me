import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'

import { boolean, index, integer, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { notes } from './notes' // 新增笔记模型
import { posts } from './posts'
import { talks } from './talks' // 新增碎碎念模型
import { unsubscribes } from './unsubscribe'

export const contentTypeEnum = pgEnum('content_type', ['posts', 'notes', 'talks'])

export const comments = pgTable(
  'comment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    body: text('body').notNull(),
    userId: text('user_id')
      .notNull()
      .default('ghost')
      .references(() => users.id, { onDelete: 'set default' }),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),

    // 多态关联核心字段
    contentId: text('content_id').notNull(),
    contentType: contentTypeEnum('content_type').notNull(),

    parentId: text('parent_id'),
    isDeleted: boolean('is_deleted').notNull().default(false),

    // Denormalized columns for performance
    replyCount: integer('reply_count').notNull().default(0),
    likeCount: integer('like_count').notNull().default(0),
    dislikeCount: integer('dislike_count').notNull().default(0),
  },
  table => [
    // Indexes for performance optimization
    index('idx_comment_content_id').on(table.contentId),
    index('idx_comment_parent_id').on(table.parentId),
    index('idx_comment_user_id').on(table.userId),
    // Composite indexes for common query patterns
    index('idx_comment_content_created')
      .on(table.contentId, table.createdAt.desc())
      .where(sql`${table.parentId} IS NULL`),
    index('idx_comment_parent_created')
      .on(table.parentId, table.createdAt.desc())
      .where(sql`${table.parentId} IS NOT NULL`),
    // Full-text search index
    index('idx_comment_body_search').using('gin', sql`to_tsvector('english', ${table.body})`),
  ],
)

export const votes = pgTable(
  'votes',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    isLike: boolean('is_like').notNull(),
  },
  vote => [
    primaryKey({ columns: [vote.userId, vote.commentId] }),
    index('votes_comment_id_like_idx').on(vote.commentId, vote.isLike),
  ],
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),

  // 动态关联不同目标类型
  post: one(posts, {
    fields: [comments.contentId], // `contentId` maps to `posts.slug`
    references: [posts.slug],
  }),
  note: one(notes, {
    fields: [comments.contentId], // `contentId` maps to `notes.id`
    references: [notes.title],
  }),
  talk: one(talks, {
    fields: [comments.contentId], // `contentId` maps to `talks.id`
    references: [talks.id],
  }),

  // 自引用关系保持不变
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'comment_replies',
  }),
  replies: many(comments, {
    relationName: 'comment_replies',
  }),
  votes: many(votes),
  unsubscribes: many(unsubscribes),
}))

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [votes.commentId],
    references: [comments.id],
  }),
}))
