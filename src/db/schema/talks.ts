import { createId } from '@paralleldrive/cuid2'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const talks = pgTable('talk', {
  id: text('id').primaryKey().$defaultFn(createId),
  content: text('content').notNull().default(''),
  likes: integer('likes').notNull().default(0),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
})
