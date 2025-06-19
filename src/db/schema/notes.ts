import { relations, sql } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { comments } from './comments'

export const notes = pgTable('note', {
  id: text('id').primaryKey(),
  updatedAt: timestamp('updated_at'),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
  likes: integer('likes').notNull().default(0),
  views: integer('views').notNull().default(0),
  summary: text('summary').notNull().default('s'),
})

export const notesRelations = relations(notes, ({ many }) => ({
  comments: many(comments),
}))
