import type { Config } from 'drizzle-kit'

import { env } from './src/lib/env'

export default {
  dialect: 'postgresql',
  schema: './src/db/schemas/index.ts',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: './src/db/migrations',
  strict: true,
  verbose: true,
} satisfies Config
