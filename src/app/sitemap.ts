import type { MetadataRoute } from 'next'

import { SITE_URL } from '~/config/constants'

function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/blog', '/guestbook', '/albums', '/projects', '/about']

  return routes.map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))
}

export default sitemap
