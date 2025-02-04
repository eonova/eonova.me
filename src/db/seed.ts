// import { env } from '~/lib/env'
// import { drizzle } from 'drizzle-orm/node-postgres'

// import * as schema from './schema'

// const db = drizzle(client, {
//   connection: env.DATABASE_URL,
//   schema
// })

function main() {
  try {
    // console.log('🎉 Data inserted successfully!')
    console.log('Nothing to do')
  }
  catch (error) {
    console.error('❌ Error inserting data:\n', error)
  }
}

main()
