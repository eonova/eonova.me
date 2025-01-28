'use client'

import { Button } from '@headlessui/react'

interface PageProps {
  error: Error & { digest?: string }
  reset: () => void
}

function Page(props: PageProps) {
  const { error, reset } = props

  return (
    <div className="h-content space-y-4 px-2 py-8">
      <h1 className="text-2xl font-bold">出错了</h1>
      <Button onClick={reset}>重试</Button>
      <p className="break-words rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
        {error.message}
      </p>
    </div>
  )
}

export default Page
