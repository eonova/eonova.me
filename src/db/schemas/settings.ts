import { relations } from 'drizzle-orm'
import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth'

export const settings = pgTable(
  'settings',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    diaEnabled: boolean('dia_enabled').notNull().default(true),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  table => [
    index('settings_user_id_idx').on(table.userId),
  ],
)

export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(users, {
    fields: [settings.userId],
    references: [users.id],
  }),
}))
