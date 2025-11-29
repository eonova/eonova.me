import type { Metadata } from 'next'

import Settings from '~/components/layouts/settings'
import { createMetadata } from '~/config/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const title = '设置'
  const description = '设置'

  return createMetadata({
    pathname: '/account/settings',
    title,
    description,
  })
}

function Page() {
  return <Settings />
}

export default Page
