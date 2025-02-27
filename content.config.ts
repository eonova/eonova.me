// @ts-nocheck
import type { Context, Meta } from '@content-collections/core'
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { getTOC, rehypePlugins, remarkPlugins } from '@ileostar/mdx-plugins'

interface BaseDoc {
  _meta: Meta
  content: string
}

async function transform<D extends BaseDoc>(document: D, context: Context) {
  const code = await compileMDX(context, document, {
    remarkPlugins,
    rehypePlugins,
  });

  const path = document._meta.path;

  if (!path) {
    throw new Error(`Invalid path: ${document._meta.path}`);
  }

  const isPost = path.includes('\\');
  const pathSplit = path.split('\\');

  return {
    ...document,
    code,
    categories: isPost ? pathSplit[0] : undefined,
    slug: pathSplit[pathSplit.length - 1],
    toc: await getTOC(document.content),
  };
}

const posts = defineCollection({
  name: 'Post',
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
  name: 'Notes',
  directory: './data/notes',
  include: '**/*.md',
  schema: z => ({
    title: z.string(),
    createTime: z.string(),
    mood: z.string()
  }),
  transform,
})


const projects = defineCollection({
  name: 'Project',
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
