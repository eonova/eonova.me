'use client'
import { useState } from 'react'
import UpMotion from '~/components/pages/about/bento/up-motion'
import NormalCard from './normal-card'

interface IntroCardProps {
  className?: string
  children?: React.ReactNode
  title?: string
  subheading?: string
  desc?: string
  spotlightColor?: string
  isColor?: boolean
  position?: { x: number, y: number }
}

const IntroCard: React.FC<IntroCardProps> = ({
  children,
  className,
  title,
  subheading,
  desc,
  spotlightColor = 'rgba(222, 255, 236, 0.106)',
  isColor = false,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  return (
    <UpMotion className={className} setPosition={setPosition} setOpacity={setOpacity}>
      <NormalCard
        title={title}
        subheading={subheading}
        desc={desc}
        spotlightColor={spotlightColor}
        isColor={isColor}
        position={position}
        opacity={opacity}
      >
        {children}
      </NormalCard>
    </UpMotion>
  )
}

export default IntroCard
