'use client'

import { Button } from '~/components/base/button'
import MainLayout from '~/components/layouts/main-layout'

interface PageProps {
  error: Error & { digest?: string }
  reset: () => void
}

function Page(props: PageProps) {
  const { error, reset } = props

  return (
    <MainLayout>
      <div className="space-y-4 px-2 py-8">
        <h1 className="text-2xl font-bold">出了一些问题！</h1>
        <Button onClick={reset}>重试</Button>
        <p className="rounded-md bg-zinc-100 p-4 break-words dark:bg-zinc-800">{error.message}</p>
      </div>
    </MainLayout>
  )
}
export default Page
