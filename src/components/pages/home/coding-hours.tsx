'use client'

import { useQuery } from '@tanstack/react-query'
import { ClockIcon } from 'lucide-react'

import { useTRPC } from '~/trpc/client'

function CodingHours() {
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(trpc.wakatime.get.queryOptions())

  return (
    <div className="shadow-feature-card flex flex-col gap-6 rounded-xl p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <ClockIcon className="size-[18px]" />
        <h2 className="text-sm">编程时间</h2>
      </div>
      <div className="flex grow items-center justify-center text-4xl font-semibold">
        {isLoading ? '--' : null}
        {isError ? '错误' : null}
        {!isLoading && !isError && data ? Math.round(data.seconds / 60 / 60) : null}
        {' '}
        hrs
      </div>
    </div>
  )
}

export default CodingHours
