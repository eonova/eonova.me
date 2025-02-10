/**
 * Adapted from: https://github.com/delbaoliveira/website/blob/59e6f181ad75751342ceaa8931db4cbcef86b018/ui/BlurImage.tsx
 */
'use client'

import NextImage from 'next/image'
import { useState } from 'react'
import { cn } from '~/lib/utils'

type ImageProps = {
  imageClassName?: string
  lazy?: boolean
  blurGlass?: boolean
} & React.ComponentProps<typeof NextImage>

function BlurImage(props: ImageProps) {
  const { blurGlass = false, alt, src, className, imageClassName, lazy = true, ...rest } = props
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn('overflow-hidden relative', isLoading && 'animate-pulse', className)}>
      <NextImage
        className={cn(isLoading && 'scale-[1.02] blur-xl grayscale', imageClassName)}
        style={{
          transition: 'filter 700ms ease, scale 150ms ease',
        }}
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : undefined}
        priority={!lazy}
        quality={100}
        onLoad={() => {
          setIsLoading(false)
        }}
        {...rest}
      />
      {
        blurGlass && <div className="absolute bottom-0 right-0 w-full h-[60%] bg-gradient-to-t from-black/70" />
      }
    </div>
  )
}

export { BlurImage }
