import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const album = pgTable('album', {
  id: text('id').primaryKey().$defaultFn(createId),
  imageUrl: text('image_url').notNull(),
  description: text('description'),
  width: integer('width').default(300),
  height: integer('height').default(200),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
}, table => [
  // Index for performance optimization
  index('idx_album_created').on(table.createdAt.desc()),
])
