'use client'
import { motion, useMotionValue } from 'framer-motion'
import * as React from 'react'
import { memo, useRef } from 'react'
import { useInvertedBorderRadius } from '~/hooks/use-inverted-border-radius'
import { useScrollConstraints } from '~/hooks/use-scroll-constraints'
import { useWheelScroll } from '~/hooks/use-wheel-scroll'
import { closeSpring, openSpring } from './animations'
import { ContentPlaceholder } from './ContentPlaceholder'
import { Image } from './Image'
import { Title } from './Title'

export interface CardData {
  id: string
  category: string
  title: string
  pointOfInterest: number
  backgroundColor: string
}

interface Props extends CardData {
  isSelected: boolean
  onSelect: () => void
}

// Distance in pixels a user has to scroll a card down before we recognise
// a swipe-to dismiss action.
const dismissDistance = 150

export const Card = memo(
  ({
    isSelected,
    id,
    title,
    category,
    onSelect,
    pointOfInterest,
    backgroundColor,
  }: Props) => {
    const y = useMotionValue(0)
    const zIndex = useMotionValue(isSelected ? 2 : 0)

    // Maintain the visual border radius when we perform the layoutTransition by inverting its scaleX/Y
    const inverted = useInvertedBorderRadius(20)

    // We'll use the opened card element to calculate the scroll constraints
    const cardRef = useRef<HTMLDivElement>(null)
    const constraints = useScrollConstraints(cardRef, isSelected)

    function checkSwipeToDismiss() {
      y.get() > dismissDistance && onSelect()
    }

    function checkZIndex(latest: { scaleX: number }) {
      if (isSelected) {
        zIndex.set(2)
      }
      else if (!isSelected && latest.scaleX < 1.01) {
        zIndex.set(0)
      }
    }

    // When this card is selected, attach a wheel event listener
    const containerRef = useRef<HTMLLIElement>(null)
    useWheelScroll(
      containerRef,
      y,
      constraints,
      checkSwipeToDismiss,
      isSelected,
    )

    return (
      <li ref={containerRef} className="card " onClick={onSelect}>
        <Overlay isSelected={isSelected} onClick={onSelect} />
        <div className={`card-content-container ${isSelected && 'open'}`}>
          <motion.div
            ref={cardRef}
            className="card-content"
            style={{ ...inverted, zIndex, y }}
            layout
            transition={isSelected ? openSpring : closeSpring}
            drag={isSelected ? 'y' : false}
            dragConstraints={constraints}
            onDrag={checkSwipeToDismiss}
            onUpdate={checkZIndex}
          >
            <Image
              id={id}
              isSelected={isSelected}
              pointOfInterest={pointOfInterest}
              backgroundColor={backgroundColor}
            />
            <Title title={title} category={category} isSelected={isSelected} />
            <ContentPlaceholder />
          </motion.div>
        </div>
      </li>
    )
  },
  (prev, next) => prev.isSelected === next.isSelected,
)

function Overlay({ isSelected, onClick }: { isSelected: boolean, onClick: () => void }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isSelected ? 0.5 : 0 }}
      transition={{ duration: 0.2 }}
      style={{
        pointerEvents: isSelected ? 'auto' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      }}
      className="overlay"
      onClick={onClick}
    />
  )
}
