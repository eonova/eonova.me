import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const talks = pgTable('talk', {
  id: text('id').primaryKey().$defaultFn(createId),
  content: text('content').notNull().default(''),
  likes: integer('likes').notNull().default(0),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
})
