import { collection, config, fields } from '@keystatic/core'
import { generateSlug } from '~/utils/generate-slug'

export default config({
  storage: {
    kind: 'github',
    repo: 'eonova/blog-posts',
  },
  collections: {
    posts: collection({
      label: '博客',
      slugField: 'slug',
      path: 'posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({
          label: 'Slug',
          description: 'The URL slug for this post',
          validation: { length: { min: 1 } },
        }),
        date: fields.date({ label: 'Date' }),
        modifiedTime: fields.date({ label: 'Modified Time' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        categories: fields.array(fields.text({ label: 'Category' }), {
          label: 'Categories',
          itemLabel: props => props.value,
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: props => props.value,
        }),
        cover: fields.text({ label: 'Cover URL' }),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),
    notes: collection({
      label: '手记',
      slugField: 'slug',
      path: 'notes/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({
          label: 'Title',
          description: 'The title for this note',
        }),
        slug: fields.slug({
          name: {
            label: 'Title',
            description: 'The title for this note',
          },
          slug: {
            generate: name => generateSlug(name, 10),
          },
        }),
        date: fields.date({ label: 'Date' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        mood: fields.text({ label: 'Mood' }),
        weather: fields.text({ label: 'Weather' }),
        cover: fields.text({ label: 'Cover URL' }),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),
    projects: collection({
      label: '项目',
      slugField: 'slug',
      path: 'projects/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.text({ label: 'Name' }),
        slug: fields.text({
          label: 'Slug',
          description: 'The URL slug for this project',
          validation: { length: { min: 1 } },
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        homepage: fields.text({ label: 'Homepage URL' }),
        github: fields.text({ label: 'GitHub URL' }),
        techstack: fields.array(fields.text({ label: 'Tech Stack' }), {
          label: 'Tech Stack',
          itemLabel: props => props.value,
        }),
        selected: fields.checkbox({ label: 'Selected', defaultValue: false }),
        dateCreated: fields.date({ label: 'Date Created' }),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),
    pages: collection({
      label: '页面',
      slugField: 'slug',
      path: 'pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Title' }), // Pages usually need a title for admin UI
        slug: fields.text({
          label: 'Slug',
          description: 'The URL slug for this page',
          validation: { length: { min: 1 } },
        }),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),
    links: collection({
      label: '收藏',
      slugField: 'categoryName',
      path: 'links/*',
      format: { data: 'json' },
      schema: {
        categoryName: fields.text({ label: 'Category Name' }),
        websites: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            url: fields.text({ label: 'URL' }),
            desc: fields.text({ label: 'Description', multiline: true }),
            images: fields.text({ label: 'Image URL' }),
          }),
          {
            label: 'Websites',
            itemLabel: props => props.fields.title.value,
          },
        ),
      },
    }),
  },
})
