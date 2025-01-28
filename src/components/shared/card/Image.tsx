'use client'
import { motion, useDeprecatedInvertedScale as useInvertedScale } from 'framer-motion'
import * as React from 'react'
import { closeSpring } from './animations'

interface ImageProps {
  id: string
  isSelected: boolean
  pointOfInterest?: number
  backgroundColor?: string
}

export function Image({
  id,
  isSelected,
  pointOfInterest = 0,
  backgroundColor,
}: ImageProps) {
  const inverted = useInvertedScale()

  return (
    <motion.div
      className="card-image-container"
      style={{ ...inverted, backgroundColor, originX: 0, originY: 0 }}
    >
      <motion.img
        className="card-image"
        src={`images/about/${id}.jpg`}
        alt=""
        initial={false}
        animate={
          isSelected ? { x: -20, y: -20 } : { x: -pointOfInterest, y: 0 }
        }
        transition={closeSpring}
      />
    </motion.div>
  )
}
