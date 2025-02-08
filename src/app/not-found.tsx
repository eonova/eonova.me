import type { Metadata } from 'next'
import { Button } from '@headlessui/react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404',
}

function NotFound() {
  return (
    <div className="mb-40 mt-52 flex flex-col items-center justify-center gap-12">
      <h1 className="text-center text-6xl font-bold">404 未找到</h1>
      <Link href="/">
        <Button className="inline-flex items-center gap-2 rounded-md bg-black dark:bg-white py-1.5 px-3 text-sm/6 font-semibold text-white dark:text-black shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-black data-[focus]:outline-1 data-[focus]:outline-white">
          返回首页
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
