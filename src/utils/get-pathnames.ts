import { CATEGORIES } from '~/config/posts'
import { getAllNotes, getAllPages, getAllPosts, getAllProjects } from '~/lib/content'

const PROTECTED_ROUTES = ['/admin', '/account', '/account/settings']

interface GetPathnamesOptions {
  includeProtectedRoutes?: boolean
}

export async function getPathnames(options: GetPathnamesOptions = {}) {
  const { includeProtectedRoutes = false } = options

  const [posts, notes, pages, projects] = await Promise.all([
    getAllPosts(),
    getAllNotes(),
    getAllPages(),
    getAllProjects(),
  ])

  const publicRoutes = [
    '/',
    '/posts',
    '/guestbook',
    '/projects',
    '/links',
    '/neodb',
    '/about',
    '/talk',
    '/archive',
    '/album',
    '/friend',
    ...CATEGORIES.map(category => `/categories/${category.label}`),
    ...['/posts', '/notes'].map(path => `/archive${path}`),
    ...new Set(pages.map(page => `/${page.slug}`)),
    ...new Set(notes.map(note => `/notes/${note.slug}`)),
    ...new Set(projects.map(project => `/projects/${project.slug}`)),
    ...new Set(posts.map(post => `/posts/${post.slug}`)),
  ]

  if (includeProtectedRoutes) {
    return [...publicRoutes, ...PROTECTED_ROUTES]
  }

  return publicRoutes
}
