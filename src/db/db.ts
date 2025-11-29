import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from '~/lib/env'

import * as schema from './schemas'

export const db = drizzle(env.DATABASE_URL, { schema })
