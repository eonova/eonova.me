import { relations, sql } from 'drizzle-orm'
import { boolean, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

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
})

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
  rate => [primaryKey({ columns: [rate.userId, rate.commentId] })],
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
    // Drizzle doesn't support conditional joins directly in relations definition.
    // The condition (e.g., `comments.contentType === 'post'`) is handled in your queries.
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
