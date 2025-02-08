import type { Metadata } from 'next'

import MainLayout from '~/components/main-layout'
import Link from 'next/link'
import { buttonVariants } from '~/components/base'

export const metadata: Metadata = {
  title: '404'
}

const NotFound = () => {

  return (
    <MainLayout>
      <div className='mb-40 mt-52 flex flex-col items-center justify-center gap-12'>
        <h1 className='text-center text-6xl font-bold'>404</h1>
        <Link href='/' className={buttonVariants()}>
          回到首页
        </Link>
      </div>
    </MainLayout>
  )
}

export default NotFound
