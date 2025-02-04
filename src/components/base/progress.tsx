import { Progress as ProgressPrimitive } from '@ark-ui/react'
import { cn } from '~/lib/utils'

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>

function Progress(props: ProgressProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.Root
      className={cn('[--size:96px] [--thickness:12px]', className)}
      {...rest}
    />
  )
}

type ProgressLabelProps = React.ComponentProps<typeof ProgressPrimitive.Label>

function ProgressLabel(props: ProgressLabelProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.Label
      className={cn('text-sm font-medium leading-none', className)}
      {...rest}
    />
  )
}

type ProgressTrackProps = React.ComponentProps<typeof ProgressPrimitive.Track>

function ProgressTrack(props: ProgressTrackProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.Track
      className={cn('bg-secondary relative h-3 w-full overflow-hidden rounded-full', className)}
      {...rest}
    />
  )
}

type ProgressRangeProps = React.ComponentProps<typeof ProgressPrimitive.Range>

function ProgressRange(props: ProgressRangeProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.Range
      className={cn('bg-primary size-full flex-1 transition-all', className)}
      {...rest}
    />
  )
}

type ProgressValueTextProps = React.ComponentProps<typeof ProgressPrimitive.ValueText>

function ProgressValueText(props: ProgressValueTextProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.ValueText
      className={cn('text-muted-foreground text-sm', className)}
      {...rest}
    />
  )
}

const ProgressCircle = ProgressPrimitive.Circle

type ProgressCircleTrackProps = React.ComponentProps<typeof ProgressPrimitive.CircleTrack>

function ProgressCircleTrack(props: ProgressCircleTrackProps) {
  const { className, ...rest } = props

  return <ProgressPrimitive.CircleTrack className={cn('stroke-secondary', className)} {...rest} />
}

type ProgressCircleRangeProps = React.ComponentProps<typeof ProgressPrimitive.CircleRange>

function ProgressCircleRange(props: ProgressCircleRangeProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.CircleRange
      className={cn('stroke-primary transition-all', className)}
      {...rest}
    />
  )
}

export {
  Progress,
  ProgressCircle,
  ProgressCircleRange,
  ProgressCircleTrack,
  ProgressLabel,
  ProgressRange,
  ProgressTrack,
  ProgressValueText,
}
