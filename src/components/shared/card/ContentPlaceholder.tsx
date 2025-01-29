'use client'
import { motion, useDeprecatedInvertedScale } from 'framer-motion'
import * as React from 'react'

export const ContentPlaceholder = React.memo(() => {
  const inverted = useDeprecatedInvertedScale()
  return (
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    >
      1111
    </motion.div>
  )
})
