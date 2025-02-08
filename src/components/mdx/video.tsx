import { cn } from '~/lib/utils'
import { AspectRatio } from '../base/aspect-ratio'

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
        className={cn('my-4 rounded-lg shadow-lg', className)}
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
