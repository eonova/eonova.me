import type { Metadata } from 'next'

import ActiveSessions from '~/components/modules/account/active-sessions'
import Profile from '~/components/modules/account/profile'
import { createMetadata } from '~/config/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const title = '设置'
  const description = '设置'

  return createMetadata({
    pathname: '/account',
    title,
    description,
  })
}

function Page() {
  return (
    <>
      <Profile />
      <ActiveSessions />
    </>
  )
}

export default Page
