'use client'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useEffect } from 'react'
import '~/styles/bounce.css'

interface BounceCardsProps {
  className?: string
  images?: string[]
  containerWidth?: number
  containerHeight?: number
  animationDelay?: number
  animationStagger?: number
  easeType?: string
  transformStyles?: string[]
}

export default function BounceCards({
  className = '',
  images = [],
  animationDelay = 0.3,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
}: BounceCardsProps) {
  useEffect(() => {
    gsap.fromTo(
      '.card',
      { scale: 0 },
      {
        scale: 1,
        stagger: animationStagger,
        ease: easeType,
        delay: animationDelay,
      },
    )
  }, [animationStagger, easeType, animationDelay])
  return (
    <div
      className={`mx-auto relative flex h-[180px] sm:h-[300px] justify-center items-center w-full ${className}`}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className="bounce-card card absolute w-[120px] sm:w-[200px] aspect-square border-4 sm:border-8 border-white dark:border-gray-700/60 rounded-[15px] sm:rounded-[30px] overflow-hidden shadow-md shadow-gray-200 dark:shadow-white/20"
        >
          <Image
            className="w-full h-full object-cover"
            src={src}
            alt={`card-${idx}`}
            width={160}
            height={200}
          />
        </div>
      ))}
    </div>
  )
}
