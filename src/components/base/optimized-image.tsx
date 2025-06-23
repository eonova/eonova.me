'use client'

import NextImage from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  imageClassName?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  lazy?: boolean
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
  enableWebP?: boolean
  enableAVIF?: boolean
}

/**
 * 优化的图片组件，支持多种格式、懒加载、错误处理等
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  lazy = true,
  onLoad,
  onError,
  fallbackSrc,
  enableWebP = true,
  enableAVIF = true,
  ...props
}: OptimizedImageProps & Omit<React.ComponentProps<typeof NextImage>, keyof OptimizedImageProps>) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const imgRef = useRef<HTMLImageElement>(null)

  // 默认的模糊占位符
  const defaultBlurDataURL
    = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

  // 生成响应式尺寸
  const responsiveSizes
    = sizes || '(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw'

  // 处理图片加载成功
  const handleLoad = useCallback(() => {
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  // 处理图片加载错误
  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)

    // 如果有备用图片，尝试加载备用图片
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
      setIsLoading(true)
      return
    }

    onError?.()
  }, [onError, fallbackSrc, currentSrc])

  // 检测浏览器支持的图片格式
  const getSupportedFormat = useCallback(() => {
    if (typeof window === 'undefined')
      return src

    // 检测 AVIF 支持
    if (enableAVIF) {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
        if (avifSupported) {
          return src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif')
        }
      }
    }

    // 检测 WebP 支持
    if (enableWebP) {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      if (webpSupported) {
        return src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      }
    }

    return src
  }, [src, enableWebP, enableAVIF])

  // 在客户端检测支持的格式
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const optimizedSrc = getSupportedFormat()
      if (optimizedSrc !== currentSrc) {
        setCurrentSrc(optimizedSrc)
      }
    }
  }, [getSupportedFormat, currentSrc])

  // 图片容器样式
  const containerClasses = cn(
    'relative overflow-hidden',
    isLoading && 'animate-pulse bg-gray-200 dark:bg-gray-700',
    className,
  )

  // 图片样式
  const imageClasses = cn(
    'transition-all duration-700 ease-out',
    isLoading && 'scale-105 blur-sm opacity-0',
    !isLoading && 'scale-100 blur-0 opacity-100',
    hasError && 'opacity-50',
    imageClassName,
  )

  const imageProps = {
    src: currentSrc,
    alt,
    className: imageClasses,
    loading: lazy && !priority ? ('lazy' as const) : undefined,
    priority,
    quality,
    sizes: responsiveSizes,
    placeholder,
    blurDataURL: blurDataURL || defaultBlurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    ref: imgRef,
    ...props,
  }

  if (fill) {
    return (
      <div className={containerClasses}>
        <NextImage {...imageProps} fill />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <span className="text-sm text-gray-500">图片加载失败</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={containerClasses}>
      <NextImage {...imageProps} width={width} height={height} />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-sm text-gray-500">图片加载失败</span>
        </div>
      )}
    </div>
  )
}

// 预设的图片尺寸配置
export const imageSizePresets = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
  hero: { width: 1920, height: 1080 },
}

// 图片质量预设
export const qualityPresets = {
  low: 50,
  medium: 75,
  high: 90,
  lossless: 100,
}
