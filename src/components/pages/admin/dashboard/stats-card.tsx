import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/base/card'
import { cn } from '~/utils'

interface StatsCardProps {
  title: string
  value: number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  className?: string
  loading?: boolean
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  className,
  loading = false,
}: StatsCardProps) {
  const isPositiveChange = change !== undefined && change > 0
  const isNegativeChange = change !== undefined && change < 0

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          </CardTitle>
          <div className="bg-muted h-4 w-4 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="bg-muted mb-1 h-8 w-16 animate-pulse rounded" />
          <div className="bg-muted h-3 w-24 animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {change !== undefined && changeLabel && (
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            {isPositiveChange && <TrendingUp className="h-3 w-3 text-green-500" />}
            {isNegativeChange && <TrendingDown className="h-3 w-3 text-red-500" />}
            <span
              className={cn(
                isPositiveChange && 'text-green-500',
                isNegativeChange && 'text-red-500',
              )}
            >
              {isPositiveChange && '+'}
              {change}
            </span>
            <span>{changeLabel}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
