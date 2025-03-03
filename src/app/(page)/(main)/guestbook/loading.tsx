import { Skeleton } from '~/components/base/skeleton'
import PageTitle from '~/components/page-title'
import Pinned from './pinned'

function Loading() {
  const title = '留言板'
  const description = '有任何问题可以给我留言'

  return (
    <>
      <PageTitle title={title} description={description} />
      <div className="mx-auto max-w-xl space-y-10">
        <Pinned />
        <div className="flex gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="w-full space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="ml-auto h-10 w-40" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Loading
