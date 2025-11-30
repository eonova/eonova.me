import type { Context, Meta } from '@content-collections/core'
import { createHash } from 'node:crypto'
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { getTOC, rehypePlugins, remarkPlugins } from '@eonova/mdx-plugins'
import { z } from 'zod'

// Simple categories for content config (without React components)
const CATEGORIES = [
  { name: '技术', label: 'tech' },
  { name: '总结', label: 'summary' },
  { name: '设计', label: 'design' },
]

interface BaseDoc {
  _meta: Meta
  content: string
}

function removeTrim(str: string): string {
  return str.includes('\\') ? str.slice(str.lastIndexOf('\\') + 1) : str
}

function validateCategory(category: string): string {
  if (category.includes('/')) {
    return category.split('/')[0] as string
  }
  else if (category.includes('\\')) {
    return category.split('\\')[0] as string
  }
  return category
}

function validateSlug(slug: string): string {
  if (slug.includes('/')) {
    return slug.slice(slug.lastIndexOf('/') + 1)
  }
  else if (slug.includes('\\')) {
    return slug.slice(slug.lastIndexOf('\\') + 1)
  }
  return slug
}

function generateSlug(str: string, length: number): string {
  const trimmed = str.trim()
  if (!trimmed)
    return ''

  const chinesePattern = /[\u4E00-\u9FA5\u3400-\u4DBF\uF900-\uFAFF]/

  if (chinesePattern.test(trimmed)) {
    const hash = createHash('sha256').update(str.normalize('NFKC')).digest('hex')

    return hash.slice(0, Math.min(length, 64))
  }
  return str
}
function getCategoryText(category: string): string {
  return String(CATEGORIES.find(i => i.label === category)?.name)
}

async function transform<D extends BaseDoc>(
  document: D,
  context: Context,
): Promise<
  D & {
    code: string
    categories?: string
    categoriesText?: string
    slug: string
    type: string
    toc: any
  }
> {
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

  const pathStr = removeTrim(path)
  const slug = isPost || isNote ? generateSlug(pathStr ?? '', 10) : pathStr

  return {
    ...document,
    code,
    ...{
      categories: isPost ? validateCategory(path) : void 0,
      categoriesText: isPost ? getCategoryText(validateCategory(path)) : void 0,
    },
    slug: validateSlug(slug),
    type: context.collection.name,
    toc: await getTOC(document.content),
  }
}

const posts = defineCollection({
  name: 'posts',
  directory: './data/posts',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    modifiedTime: z.string(),
    summary: z.string(),
    cover: z.string(),
    content: z.string(),
  }),
  transform,
})

const notes = defineCollection({
  name: 'notes',
  directory: './data/notes',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string().optional(),
    mood: z.string(),
    weather: z.string(),
    cover: z.string(),
    content: z.string(),
  }),
  transform,
})

const projects = defineCollection({
  name: 'projects',
  directory: './data/projects',
  include: '**/*.md',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    homepage: z.string().optional(),
    github: z.string(),
    techstack: z.array(z.string()),
    selected: z.boolean().optional().default(false),
    dateCreated: z.string(),
    content: z.string(),
  }),
  transform,
})

const pages = defineCollection({
  name: 'Page',
  directory: './data/pages',
  include: '**/*.md',
  schema: z.object({
    content: z.string(),
  }),
  transform,
})

export default defineConfig({
  collections: [notes, posts, projects, pages],
})
