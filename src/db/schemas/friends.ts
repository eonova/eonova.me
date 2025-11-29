import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const friends = pgTable('friends', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
  url: text('url').notNull(),
  avatar: text('avatar'),
  description: text('description'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
}, table => [
  // Index for performance optimization
  index('idx_friend_order').on(table.order),
])
