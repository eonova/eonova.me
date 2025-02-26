interface VideoCardProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  aspectRatio?: string
}

const VideoCard: React.FC<VideoCardProps> = ({
  aspectRatio = '16/9',
  style,
  title = '视频播放器',
  allowFullScreen = true,
  ...props
}) => {
  const [widthRadio, heightRadio] = aspectRatio.split('/').map(Number)
  const scaleRadio = heightRadio! / widthRadio!

  return (
    <div
      className="w-screen max-w-full"
    >
      <div className="flex justify-center">
        <div
          className="relative h-0 w-full shadow-lg"
          style={{
            paddingBottom: `${scaleRadio * 100}%`,
          }}
        >
          <iframe
            title={title}
            allowFullScreen={allowFullScreen}
            style={{
              border: 0,
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              aspectRatio: 'unset',
              position: 'absolute',
            }}
            className="absolute inset-0 size-full rounded-md border-0"
            {...props}
            src={`${props.src}&autoplay=0`}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoCard
