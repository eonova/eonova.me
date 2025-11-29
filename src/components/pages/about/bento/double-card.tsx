'use client'
import { useState } from 'react'
import UpMotion from '~/components/pages/about/bento/up-motion'
import { DATE_BIRTH, PROFESSION } from '~/config/about-profiles'
import { cn } from '~/utils'
import NormalCard from './normal-card'

interface DoubleCardProps {
  className?: string
  children?: React.ReactNode
  title?: string
  subheading?: string
  desc?: string
  spotlightColor?: string
  isColor?: boolean
}

const DoubleCard: React.FC<DoubleCardProps> = ({
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
    <UpMotion
      className={cn(className, 'border-none p-0 shadow-none')}
      setPosition={setPosition}
      setOpacity={setOpacity}
    >
      <div className="font-world shadow-feature-card dark:shadow-feature-card-dark relative flex h-[90px] w-full items-center justify-between rounded-3xl border border-black/5 bg-amber-300 text-black/80 p-6 backdrop-blur-xs transition-all duration-500 dark:border-white/10">
        <NormalCard
          title={title}
          subheading={subheading}
          desc={desc}
          spotlightColor={spotlightColor}
          isColor={isColor}
          position={position}
          opacity={opacity}
        >
          <h2 className="text-2xl">生于</h2>
          <p className="text-[32px]">{DATE_BIRTH}</p>
        </NormalCard>
      </div>
      <div className="font-world relative flex h-[90px] w-full items-center justify-between rounded-3xl bg-[#FDBA74] p-6 text-white shadow-lg backdrop-blur-xs transition-all duration-500">
        <NormalCard
          title={title}
          subheading={subheading}
          desc={desc}
          spotlightColor={spotlightColor}
          isColor
          position={position}
          opacity={opacity}
        >
          <h2 className="text-2xl">专业</h2>
          <p className="text-[32px]">{PROFESSION}</p>
        </NormalCard>
      </div>
    </UpMotion>
  )
}

export default DoubleCard
