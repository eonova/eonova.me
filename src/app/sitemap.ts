import type { MetadataRoute } from 'next'
import { allPosts, allProjects } from 'content-collections'
import { SITE_URL } from '~/config/constants'

const sitemap = (): MetadataRoute.Sitemap => {
  const routes = [
    '',
    '/blog',
    '/projects',
    '/links',
    '/guestbook',
    '/albums',
    '/about',
    ...new Set(allProjects.map((project) => `/projects/${project.slug}`)),
    ...new Set(allPosts.map((post) => `/blog/${post.slug}`))
  ]

  return routes.map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))
}

export default sitemap
