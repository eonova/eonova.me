import { reader } from '~/lib/reader'

export async function getAllPosts() {
  const posts = await reader.collections.posts.all()
  return posts.map((post) => {
    const { content, ...rest } = post.entry
    return {
      ...rest,
      slug: post.slug,
      type: 'posts',
    }
  }).sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime())
}

export async function getAllNotes() {
  const notes = await reader.collections.notes.all()
  return notes.map((note) => {
    const { content, ...rest } = note.entry
    return {
      ...rest,
      slug: note.slug,
      type: 'notes',
    }
  }).sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime())
}

export async function getAllProjects() {
  const projects = await reader.collections.projects.all()
  return projects.map((project) => {
    const { content, ...rest } = project.entry
    return {
      ...rest,
      slug: project.slug,
      type: 'projects',
    }
  }).sort((a, b) => new Date(b.dateCreated ?? '').getTime() - new Date(a.dateCreated ?? '').getTime())
}

export async function getAllPages() {
  const pages = await reader.collections.pages.all()
  return pages.map((page) => {
    const { content, ...rest } = page.entry
    return {
      ...rest,
      slug: page.slug,
      type: 'pages',
    }
  })
}

export type Post = Awaited<ReturnType<typeof getAllPosts>>[number]
export type Note = Awaited<ReturnType<typeof getAllNotes>>[number]
export type Project = Awaited<ReturnType<typeof getAllProjects>>[number]
export type Page = Awaited<ReturnType<typeof getAllPages>>[number]

export async function getLatestPosts(limit?: number) {
  const posts = await getAllPosts()
  return posts.slice(0, limit)
}

export async function getLatestNotes(limit?: number) {
  const notes = await getAllNotes()
  return notes.slice(0, limit)
}

export async function getLatestProjects(limit?: number) {
  const projects = await getAllProjects()
  return projects.slice(0, limit)
}

export async function getSelectedProjects() {
  const projects = await getAllProjects()
  return projects.filter(project => project.selected)
}

export async function getNoteBySlug(slug: string) {
  const note = await reader.collections.notes.read(slug)
  if (!note)
    return null
  return {
    ...note,
    slug,
  }
}

export async function getPostBySlug(slug: string) {
  const post = await reader.collections.posts.read(slug)
  if (!post)
    return null
  return {
    ...post,
    slug,
  }
}

export async function getProjectBySlug(slug: string) {
  const project = await reader.collections.projects.read(slug)
  if (!project)
    return null
  return {
    ...project,
    slug,
  }
}

export async function getPageBySlug(slug: string) {
  const page = await reader.collections.pages.read(slug)
  if (!page)
    return null
  return {
    ...page,
    slug,
  }
}
