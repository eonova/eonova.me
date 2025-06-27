import fs from 'node:fs/promises'
import path from 'node:path'

import { consola } from 'consola'

import { db } from './db'
import { posts } from './schema'

async function main() {
  try {
    const postFiles = await fs.readdir(path.join(process.cwd(), 'data/posts'))

    for (const file of postFiles) {
      const slug = file.replace('.md', '')
      await db.insert(posts).values({ slug, views: 0 })
    }

    consola.success('Post Data inserted successfully!')

    process.exit(0)
  }
  catch (error) {
    consola.error('Error inserting data:\n', error)
  }
}

main()
