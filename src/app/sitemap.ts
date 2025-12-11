import type { MetadataRoute } from 'next'
import { SITE_URL } from '~/config/constants'
import { getPathnames } from '~/utils/get-pathnames'

async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getPathnames()

  return routes.map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))
}

export default sitemap
