import fs from 'node:fs/promises'
import path from 'node:path'

import { db } from './db'
import { posts } from './schema'

async function main() {
  try {
    const files = await fs.readdir(path.join(process.cwd(), '../../data/posts/'))

    for (const file of files) {
      const slug = file.replace('.md', '')
      await db.insert(posts).values({ slug, views: 0 })
    }

    console.log('🎉 Data inserted successfully!')

    process.exit(0)
  }
  catch (error) {
    console.error('❌ Error inserting data:\n', error)
  }
}

main()
