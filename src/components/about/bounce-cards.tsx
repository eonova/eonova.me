'use client'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'

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

function getTransformStyles(val: boolean) {
  return val
    ? [
      'rotate(10deg) translate(-170px)',
      'rotate(5deg) translate(-85px)',
      'rotate(-3deg)',
      'rotate(-10deg) translate(85px)',
      'rotate(2deg) translate(170px)',
    ]
    : [
      'rotate(10deg) translate(-100px)',
      'rotate(5deg) translate(-35px)',
      'rotate(-3deg)',
      'rotate(-10deg) translate(35px)',
      'rotate(2deg) translate(100px)',
    ]
}

export default function BounceCards({
  className = '',
  images = [],
  animationDelay = 0.3,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
}: BounceCardsProps) {
  const matches = useMediaQuery('(min-width: 640px)')
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
          className="card absolute w-[120px] sm:w-[200px] aspect-square border-4 sm:border-8 border-white rounded-[15px] sm:rounded-[30px] overflow-hidden"
          style={{
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            transform:
              getTransformStyles(matches)[idx] !== undefined ? getTransformStyles(matches)[idx] : 'none',
          }}
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
