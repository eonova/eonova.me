import { consola } from 'consola'
import { sql } from 'drizzle-orm'
import { execa } from 'execa'
import { env } from '~/lib/env'

import { db } from './db'

async function main() {
  const confirmed = await consola.prompt('Are you sure you want to reset the database?', {
    type: 'confirm',
  })

  if (!confirmed) {
    consola.info('Aborting...')

    return
  }

  if (!env.DATABASE_URL.includes('localhost')) {
    const nonLocalConfirmed = await consola.prompt(
      'Non-local database detected. Are you sure you want to continue?',
      {
        type: 'confirm',
      },
    )

    if (!nonLocalConfirmed) {
      consola.info('Aborting...')

      return
    }
  }
  consola.info('Resetting database...')

  try {
    consola.info('Dropping public schema...')

    await db.execute(sql`
      DROP SCHEMA public CASCADE;
    `)

    consola.info('Recreating public schema...')

    await db.execute(sql`
      CREATE SCHEMA public;
    `)

    consola.info('Granting privileges...')

    await db.execute(sql`
      GRANT ALL ON SCHEMA public TO "postgres";
      GRANT ALL ON SCHEMA public TO public;
    `)

    consola.info('Migrating database...')

    await execa('pnpm', ['db:push', '--force'], { stdio: 'inherit' })
    await execa('pnpm', ['db:migrate'], { stdio: 'inherit' })

    consola.info('Seeding database...')

    await execa('pnpm', ['db:seed'], { stdio: 'inherit' })

    consola.success('Database reset successfully!')

    process.exit(0)
  }
  catch (error) {
    consola.error('Error resetting database:', error)
  }
}

main()
