import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '~/components/base'

export const metadata: Metadata = {
  title: '404',
}

function NotFound() {
  return (
    <div className="mt-52 mb-40 flex flex-col items-center justify-center gap-12">
      <h1 className="text-center text-6xl font-bold">404 未找到</h1>
      <Link href="/">
        <Button className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-focus:outline-1 data-focus:outline-white data-hover:bg-gray-600 data-open:bg-black dark:bg-white dark:text-black">
          返回首页
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
