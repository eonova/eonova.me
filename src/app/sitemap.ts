import type { MetadataRoute } from 'next'

// import { allBlogPosts, allPages, allProjects } from 'mdx/generated'

import { SITE_URL } from '~/config/constants'

function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/blog', '/guestbook', '/albums', '/friends', '/about']

  return routes.map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))
}

export default sitemap
