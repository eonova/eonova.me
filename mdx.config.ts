import { defineCollection, defineConfig } from '@ileostar/mdx'

const BlogPost = defineCollection({
  name: 'BlogPost',
  filePathPattern: '**/posts/*.md',
  fields: [
    {
      name: 'title',
      type: 'string',
      required: true,
    },
    {
      name: 'date',
      type: 'string',
      required: true,
    },
    {
      name: 'modifiedTime',
      type: 'string',
      required: true,
    },
    {
      name: 'summary',
      type: 'string',
      required: true,
    },
    {
      name: 'cover',
      type: 'string',
      required: true,
    },
  ],
  computedFields: [
    {
      name: 'slug',
      type: 'string',
      resolve: (doc) => {
        return doc.filePath.split('/').pop()?.replace(/\.mdx|\.md$/, '')
      },
    },
  ],
})

const Project = defineCollection({
  name: 'Project',
  filePathPattern: '**/projects/*.md',
  fields: [
    {
      name: 'name',
      type: 'string',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      required: true,
    },
    {
      name: 'homepage',
      type: 'string',
      required: false,
    },
    {
      name: 'github',
      type: 'string',
      required: true,
    },
    {
      name: 'techstack',
      type: 'list',
      fields: [
        {
          name: 'label',
          type: 'string',
          required: true,
        },
      ],
      required: true,
    },
    {
      name: 'selected',
      type: 'boolean',
    },
  ],
  computedFields: [
    {
      name: 'slug',
      type: 'string',
      resolve: (doc) => {
        return doc.filePath.split('/').pop()?.replace('.md', '')
      },
    },
  ],
})

export default defineConfig({
  contentDirPath: 'data/',
  collections: [BlogPost, Project],
})
