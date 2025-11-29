'use client'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import '~/styles/page/bounce.css'

interface BounceCardsProps {
  className?: string
  images?: string[]
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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Initial animation
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

    // Hover animation
    cardRefs.current.forEach((card) => {
      if (card) {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      }
    })
  }, [animationStagger, easeType, animationDelay])

  return (
    <div
      className={`relative mx-auto flex h-[180px] w-full items-center justify-center sm:h-[300px] ${className}`}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          ref={(el) => {
            cardRefs.current[idx] = el
          }}
          className="bounce-card card absolute aspect-square w-[120px] overflow-hidden rounded-[15px] border-4 border-white shadow-md shadow-gray-200 sm:2-[190px] xl:w-[210px] sm:rounded-[30px] sm:border-8 dark:border-gray-700/60 dark:shadow-white/20"
        >
          <Image
            className="h-full w-full object-cover"
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
