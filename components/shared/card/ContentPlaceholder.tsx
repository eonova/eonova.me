'use client'
import { motion, useDeprecatedInvertedScale } from 'framer-motion'
import * as React from 'react'
import { LoremIpsum } from 'react-lorem-ipsum'

export const ContentPlaceholder = React.memo(() => {
  const inverted = useDeprecatedInvertedScale()
  return (
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    >
      <LoremIpsum p={6} avgWordsPerSentence={6} avgSentencesPerParagraph={4} />
    </motion.div>
  )
})
