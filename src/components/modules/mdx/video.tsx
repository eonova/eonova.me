import { AspectRatio } from '~/components/base/aspect-ratio'
import { cn } from '~/utils/cn'

type VideoProps = {
  src: string
  width: number
  height: number
} & React.ComponentProps<'video'>

function Video(props: VideoProps) {
  const { src, width, height, controls = true, className, ...rest } = props

  return (
    <AspectRatio className={cn('rounded-lg shadow-lg', className)} ratio={16 / 9}>
      <video
        className={cn('!mt-0 rounded-lg shadow-lg', className)}
        loop
        muted
        src={src}
        controls={controls}
        width={width}
        height={height}
        {...rest}
      />
    </AspectRatio>
  )
}

export default Video
