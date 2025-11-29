import type { MetadataRoute } from 'next'
import { SITE_URL } from '~/config/constants'
import { getPathnames } from '~/utils'

function sitemap(): MetadataRoute.Sitemap {
  const routes = getPathnames()

  return routes.map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))
}

export default sitemap
