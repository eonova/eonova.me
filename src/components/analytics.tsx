import { env } from '~/lib/env'
import Script from 'next/script'

import { isProduction } from '~/config/constants'

const Analytics = () => {
  if (!isProduction) return null

  return (
    <Script
      async
      data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      src={`${env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
    />
  )
}

export default Analytics
