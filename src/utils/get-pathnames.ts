import { allNotes, allPages, allPosts, allProjects } from 'content-collections'
import { CATEGORIES } from '~/config/posts'

const PROTECTED_ROUTES = ['/admin', '/account', '/account/settings']

interface GetPathnamesOptions {
  includeProtectedRoutes?: boolean
}

export function getPathnames(options: GetPathnamesOptions = {}) {
  const { includeProtectedRoutes = false } = options

  const publicRoutes = [
    '/',
    '/posts',
    '/guestbook',
    '/projects',
    '/links',
    '/neodb',
    '/about',
    '/privacy',
    '/talk',
    '/terms',
    '/archive',
    '/album',
    '/friend',
    ...CATEGORIES.map(category => `/categories/${category}`),
    ...['/posts', '/notes'].map(path => `/archive${path}`),
    ...new Set(allPages.map(page => `/${page.slug}`)),
    ...new Set(allNotes.map(note => `/notes/${note.slug}`)),
    ...new Set(allProjects.map(project => `/projects/${project.slug}`)),
    ...new Set(allPosts.map(post => `/posts/${post.slug}`)),
  ]

  if (includeProtectedRoutes) {
    return [...publicRoutes, ...PROTECTED_ROUTES]
  }

  return publicRoutes
}
