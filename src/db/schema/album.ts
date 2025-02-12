import { createId } from '@paralleldrive/cuid2'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const album = pgTable('album', {
  id: text('id').primaryKey().$defaultFn(createId),
  imageUrl: text('image_url').notNull(),
  description: text('description'),
  width: integer('width').default(300),
  height: integer('height').default(200),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3 }).notNull().defaultNow(),
})
