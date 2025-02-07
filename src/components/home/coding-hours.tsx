'use client'

import { ClockIcon } from 'lucide-react'
import { flags } from '~/lib/env'

import { api } from '~/trpc/react'

function CodingHours() {
  const { status, data } = api.wakatime.get.useQuery(undefined, {
    enabled: flags.stats,
  })

  return (
    <div className="shadow-feature-card flex flex-col gap-6 rounded-xl p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <ClockIcon className="size-[18px]" />
        <h2 className="text-sm">编程时间</h2>
      </div>
      <div className="flex grow items-center justify-center text-4xl font-semibold">
        {status === 'pending' ? '--' : null}
        {status === 'error' ? '错误' : null}
        {status === 'success' ? Math.round(data.seconds / 60 / 60) : null}
        {' '}
        hrs
      </div>
    </div>
  )
}

export default CodingHours
