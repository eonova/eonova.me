import type { MetadataRoute } from 'next'

import { SITE_URL } from '~/config/constants'

function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/avatar/*', '/og/*'],
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

export default robots
