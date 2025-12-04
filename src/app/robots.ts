import type { MetadataRoute } from 'next'
import { getBaseUrl } from '~/utils/get-base-url'

function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/avatar/*', '/og/*'],
        disallow: ['/api/', '/rpc/'],
      },
    ],
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  }
}

export default robots
