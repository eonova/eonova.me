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
      <LoremIpsum p={3} avgWordsPerSentence={5} avgSentencesPerParagraph={2} />
    </motion.div>
  )
})
