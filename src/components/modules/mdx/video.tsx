import { AspectRatio } from '~/components/base/aspect-ratio'
import { cn } from '~/utils'

type VideoProps = {
  src: string
  width: number
  height: number
  second?: string
} & React.ComponentProps<'video'>

function Video(props: VideoProps) {
  const { src, width, height, controls = true, second, className, ...rest } = props

  return (
    <AspectRatio ratio={16 / 9}>
      <video
        className={cn('my-4 w-full h-full rounded-lg shadow-lg absolute top-0', className)}
        loop
        muted
        controls={controls}
        width={width}
        height={height}
        {...rest}
      >
        <source src={src} type="video/mp4" />
        {second && <source src={second} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>
    </AspectRatio>
  )
}

export default Video
