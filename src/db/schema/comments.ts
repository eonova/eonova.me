import { relations, sql } from 'drizzle-orm'
import { boolean, index, integer, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth'
import { notes } from './notes' // 新增笔记模型
import { posts } from './posts'
import { talks } from './talks' // 新增碎碎念模型

export const contentTypeEnum = pgEnum('content_type', ['post', 'note', 'talk'])

export const comments = pgTable('comment', {
  id: text('id').primaryKey(),
  body: text('body').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),

  // 多态关联核心字段
  contentId: text('content_id').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),

  parentId: text('parent_id'),
  isDeleted: boolean('is_deleted').notNull().default(false),

  // Denormalized columns for performance
  replyCount: integer('reply_count').notNull().default(0),
  likeCount: integer('like_count').notNull().default(0),
  dislikeCount: integer('dislike_count').notNull().default(0),
}, table => [
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
])

export const rates = pgTable(
  'rate',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    like: boolean('like').notNull(),
  },
  rate => [
    primaryKey({ columns: [rate.userId, rate.commentId] }),
    // Indexes for performance optimization
    index('idx_rate_comment_like').on(rate.commentId, rate.like),
    index('idx_rate_user_comment').on(rate.userId, rate.commentId),
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
    references: [notes.id],
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
  rates: many(rates),
}))

export const ratesRelations = relations(rates, ({ one }) => ({
  user: one(users, {
    fields: [rates.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [rates.commentId],
    references: [comments.id],
  }),
}))
