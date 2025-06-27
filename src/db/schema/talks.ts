import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { comments } from './comments'

export const talks = pgTable(
  'talk',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    content: text('content').notNull().default(''),
    likes: integer('likes').notNull().default(0),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
  },
  table => [
    // Index for performance optimization
    index('idx_talk_created').on(table.createdAt.desc()),
  ],
)

export const talksRelations = relations(talks, ({ many }) => ({
  comments: many(comments),
}))
