interface VideoCardProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  ratio?: number
}

const VideoCard: React.FC<VideoCardProps> = ({
  style,
  title = "视频播放器", // 可访问性要求
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  allowFullScreen = true,
  ...props
}) => {
  return (
    <div className="flex justify-center w-full">
      <div
        className="relative overflow-hidden w-full rounded-md bg-gray-100 shadow-lg"
      >
        <iframe
          className="absolute left-0 top-0 w-full size-full border-0"
          title={title}
          allow={allow}
          allowFullScreen={allowFullScreen}
          {...props}
        />
      </div>
    </div>
  )
}

export default VideoCard;
