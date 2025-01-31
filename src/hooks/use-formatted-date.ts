import { useEffect, useMemo, useState } from 'react'

import { dayjs } from '~/utils/dayjs'

interface Options {
  format: string
  loading?: string
  relative?: boolean
  prefix?: string
  suffix?: string
}

export function useFormattedDate(date: Date | string, options: Options) {
  const { relative = false, format, loading, prefix = '', suffix = '' } = options
  const [formattedDate, setFormattedDate] = useState<string | null>(loading ?? null)

  const computedDate = useMemo(() => {
    if (relative) {
      const targetDate = dayjs(date)
      const weeksDiff = dayjs().diff(targetDate, 'week')

      return Math.abs(weeksDiff) > 1 ? `on ${targetDate.format(format)}` : dayjs().to(targetDate)
    }
    else {
      return `${prefix}${dayjs(date).format(format)}${suffix}`
    }
  }, [date, format, prefix, relative, suffix])

  useEffect(() => {
    setFormattedDate(computedDate)
  }, [computedDate])

  return formattedDate
}
