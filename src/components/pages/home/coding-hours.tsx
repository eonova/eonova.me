'use client'

import { ClockIcon } from 'lucide-react'
import { useWakatimeStat } from '~/hooks/queries/stat.query'

function CodingHours() {
  const { isSuccess, isLoading, isError, data } = useWakatimeStat()

  return (
    <div className="shadow-feature-card flex flex-col gap-6 rounded-xl p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <ClockIcon className="size-[18px]" />
        <h2 className="text-sm">编程时间</h2>
      </div>
      <div className="flex grow items-center justify-center text-4xl font-semibold">
        {isSuccess && `${2500 + data.hours} hrs`}
        {isLoading && '--'}
        {isError && '错误'}
      </div>
    </div>
  )
}

export default CodingHours
