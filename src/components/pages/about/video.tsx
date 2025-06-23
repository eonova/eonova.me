'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface VideoFallbackProps {
  className?: string
  videoSrc: string
  videoSecondSrc?: string
  fallbackImageSrc: string
}

const VideoFallback: React.FC<VideoFallbackProps> = ({
  className,
  videoSrc,
  videoSecondSrc,
  fallbackImageSrc,
}) => {
  const [isVideoError, setIsVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleVideoError = () => {
      setIsVideoError(true)
    }

    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener('error', handleVideoError)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('error', handleVideoError)
      }
    }
  }, [])

  if (isVideoError) {
    return (
      <div className="fallback-image">
        <Image src={fallbackImageSrc} alt="Fallback Image" width={600} height={400} priority />
      </div>
    )
  }

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className={className}
        poster={fallbackImageSrc}
        controls={false}
        autoPlay
        width={0}
        height={0}
        loop
        muted
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSecondSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoFallback
