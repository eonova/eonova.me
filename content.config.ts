// @ts-nocheck
import type { Context, Meta } from '@content-collections/core'
import { createHash } from 'node:crypto'
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { getTOC, rehypePlugins, remarkPlugins } from '@ileostar/mdx-plugins'
import { CATEGORIES } from '~/config/posts'

interface BaseDoc {
  _meta: Meta
  content: string
}

enum CATEGORIES {
  tech = '技术',
  summary = '总结',
  design = '设计',
}

function generateSlug(str: string, length: number): string {
  const trimmed = str.trim()
  if (!trimmed)
    return ''

  const chinesePattern = /[\u4E00-\u9FA5\u3400-\u4DBF\uF900-\uFAFF]/

  if (chinesePattern.test(trimmed)) {
    const hash = createHash('sha256')
      .update(str.normalize('NFKC'))
      .digest('hex')

    return hash.slice(0, Math.min(length, 64))
  }
  return str
}

async function transform<D extends BaseDoc>(document: D, context: Context) {
  const code = await compileMDX(context, document, {
    remarkPlugins,
    rehypePlugins,
  })

  const path = document._meta.path

  if (!path) {
    throw new Error(`Invalid path: ${document._meta.path}`)
  }

  const isPost = context.collection.name === 'posts'
  const isNote = context.collection.name === 'notes'
  const pathSplit = path.split('\\')
  const slug = (isPost || isNote) ? generateSlug(pathSplit[pathSplit.length - 1] ?? '', 10) : pathSplit[pathSplit.length - 1]

  return {
    ...document,
    code,
    ...{
      categories: isPost ? pathSplit[0] : void 0,
      categoriesText: isPost ? CATEGORIES[pathSplit[0]] : void 0,
    },
    slug,
    type: context.collection.name,
    toc: await getTOC(document.content),
  }
}

const posts = defineCollection({
  name: 'posts',
  directory: './data/posts',
  include: '**/*.md',
  schema: z => ({
    title: z.string(),
    date: z.string(),
    modifiedTime: z.string(),
    summary: z.string(),
    cover: z.string(),
  }),
  transform,
})

const notes = defineCollection({
  name: 'notes',
  directory: './data/notes',
  include: '**/*.md',
  schema: z => ({
    title: z.string(),
    date: z.string(),
    mood: z.string(),
    weather: z.string(),
    cover: z.string(),
  }),
  transform,
})

const projects = defineCollection({
  name: 'projects',
  directory: './data/projects',
  include: '**/*.md',
  schema: z => ({
    name: z.string(),
    date: z.string(),
    description: z.string(),
    homepage: z.string().optional(),
    github: z.string(),
    techstack: z.array(z.string()),
    selected: z.boolean().optional().default(false),
  }),
  transform,
})

export default defineConfig({
  collections: [notes, posts, projects],
})
