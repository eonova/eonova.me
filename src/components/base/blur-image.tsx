'use client'

import NextImage from 'next/image'
import { useState } from 'react'
import { cn } from '~/utils'

type ImageProps = {
  imageClassName?: string
  lazy?: boolean
  blurGlass?: boolean
  optimized?: boolean
  webpFallback?: boolean
} & React.ComponentProps<typeof NextImage>

function BlurImage(props: ImageProps) {
  const {
    blurGlass = false,
    alt,
    src,
    className,
    imageClassName,
    lazy = true,
    optimized = true,
    ...rest
  } = props
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 生成优化的图片尺寸
  const optimizedSizes
    = rest.sizes
      || '(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw'

  // 优化质量设置
  const quality = rest.quality || (optimized ? 75 : 85)

  return (
    <div className={cn('relative overflow-hidden', isLoading && 'animate-pulse', className)}>
      <NextImage
        className={cn(
          'transition-all duration-700 ease-out',
          isLoading && 'scale-[1.02] blur-xl grayscale',
          hasError && 'opacity-50',
          imageClassName,
        )}
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : undefined}
        priority={!lazy}
        quality={quality}
        sizes={optimizedSizes}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onLoad={() => {
          setIsLoading(false)
        }}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        {...rest}
      />
      {blurGlass && (
        <div className="absolute right-0 bottom-0 h-[60%] w-full bg-linear-to-t from-black/70" />
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-sm text-gray-500">图片加载失败</span>
        </div>
      )}
    </div>
  )
}

export { BlurImage }
