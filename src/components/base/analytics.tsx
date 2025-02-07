import Script from 'next/script'
import { isProduction } from '~/config/constants'
import { env } from '~/lib/env'

function Analytics() {
  if (!isProduction)
    return null

  return (
    <Script
      async
      data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      src={`${env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
    />
  )
}

export default Analytics
