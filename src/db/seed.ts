import fs from 'node:fs/promises'
import path from 'node:path'

import { consola } from 'consola'

import { db } from './db'
import { posts } from './schemas'

async function main() {
  try {
    const postFiles = await fs.readdir(path.join(process.cwd(), 'data/posts'), { recursive: true })

    for (const file of postFiles) {
      if (!file.endsWith('.md'))
        continue

      const slug = path.basename(file, '.md')
      await db.insert(posts).values({ slug, views: 0 }).onConflictDoNothing()
    }

    consola.success('Post Data inserted successfully!')

    process.exit(0)
  }
  catch (error) {
    consola.error('Error inserting data:\n', error)
  }
}

main()
