import React from 'react'
import { cn } from '~/lib/utils'

interface AppointProgressProps {
  startDate: Date // 开始日期
  endDate: Date // 结束日期
  className?: string
}

const AppointProgress: React.FC<AppointProgressProps> = ({ startDate, endDate, className }) => {
  // 计算进度百分比
  const calculateProgress = () => {
    const now = new Date().getTime()
    const start = startDate.getTime()
    const end = endDate.getTime()

    if (now < start)
      return 0 // 如果当前时间早于开始时间，进度为 0
    if (now > end)
      return 100 // 如果当前时间晚于结束时间，进度为 100

    const totalDuration = end - start
    const elapsedDuration = now - start
    return Math.round((elapsedDuration / totalDuration) * 100)
  }

  const progress = calculateProgress()

  return (
    <div className={cn('w-full h-4 bg-gray-200/80 dark:bg-black/50 rounded-2xl overflow-hidden relative', className)}>
      {/* 进度条背景 */}
      <div
        className="h-full bg-blue-500  rounded-2xl"
        style={{ width: `${progress}%` }}
      />
      {/* 进度文本 */}
      <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-700 dark:text-gray-400/70">
        {progress}
        %
      </div>
    </div>
  )
}

export default AppointProgress
