import path from 'node:path'

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { env } from '~/lib/env'

import * as schema from './schema'

async function main() {
  try {
    const db = drizzle({
      connection: env.DATABASE_URL,
      schema,
    })

    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), 'src/migrations'),
    })
    console.log('🎉 Database migration successfully!')
  }
  catch (error) {
    console.error('❌ Database migration failed:\n', error)
  }
}

// eslint-disable-next-line antfu/no-top-level-await
await main()
