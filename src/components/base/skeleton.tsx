import { cn } from '~/lib/utils'

type SkeletonProps = React.ComponentProps<'div'>

function Skeleton(props: SkeletonProps) {
  const { className, ...rest } = props

  return <div className={cn('bg-muted animate-pulse rounded-lg', className)} {...rest} />
}

export { Skeleton }
