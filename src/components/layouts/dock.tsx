import { animated, useSpring, useSprings } from '@react-spring/web'
import { useCallback, useEffect, useState } from 'react'

function Dock({ position = 'bottom', collapsible = false, responsive = 'bottom' }) {
  const [hoverIndex, setHoverIndex] = useState(null)
  const [isDockVisible, setDockVisible] = useState(!collapsible)
  const [currentPosition, setCurrentPosition] = useState(position)

  const DOCK_ITEMS = ['🍕', '🍔', '🌭', '🌮', '🌯']

  const getTranslateValue = useCallback((position, isHovered) => {
    if (!isHovered)
      return 'translateX(0px) translateY(0px)'

    const translations = {
      left: 'translateX(5px) translateY(0px)',
      right: 'translateX(-5px) translateY(0px)',
      top: 'translateX(0px) translateY(5px)',
      bottom: 'translateX(0px) translateY(-5px)',
    }
    return translations[position]
  }, [])

  const [springs, api] = useSprings(
    DOCK_ITEMS.length,
    () => ({
      scale: 1,
      translate: 'translateX(0px) translateY(0px)',
      config: { tension: 200, friction: 15 },
    }),
    [currentPosition],
  )

  useEffect(() => {
    api.start((index) => {
      const isHovered = index === hoverIndex
      const isNeighbor = hoverIndex !== null && Math.abs(hoverIndex - index) === 1

      return {
        scale: isHovered ? 1.5 : isNeighbor ? 1.3 : 1,
        translate: getTranslateValue(currentPosition, isHovered),
        immediate: false,
      }
    })
  }, [hoverIndex, currentPosition, api, getTranslateValue])

  const handleMouseEnter = useCallback((index) => {
    setHoverIndex(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null)
  }, [])

  const handleParentMouseEnter = useCallback(() => {
    if (collapsible)
      setDockVisible(true)
  }, [collapsible])

  const handleParentMouseLeave = useCallback(() => {
    if (collapsible)
      setDockVisible(false)
  }, [collapsible])

  useEffect(() => {
    const updatePosition = () => {
      setCurrentPosition(responsive && window.innerWidth <= 768 ? responsive : position)
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [position, responsive])

  const getDockStyle = useCallback((position) => {
    const styles = {
      left: 'flex-col items-start justify-center h-full left-4',
      right: 'flex-col items-end justify-center h-full right-4',
      top: 'flex-row items-start justify-center w-full top-4',
      bottom: 'flex-row items-end justify-center w-full bottom-4',
    }
    return styles[position] || styles.bottom
  }, [])

  const visibilitySpring = useSpring({
    opacity: isDockVisible ? 1 : 0,
    config: { tension: 120, friction: 14 },
  })

  return (
    <div
      className={`fixed w-24 h-36 pointer-events-none flex ${getDockStyle(currentPosition)}`}
      onMouseEnter={handleParentMouseEnter}
      onMouseLeave={handleParentMouseLeave}
    >
      <animated.div
        className="flex pointer-events-auto border border-white/[0.11] p-3 rounded-[20px] transition-all duration-200 ease-out"
        style={visibilitySpring}
      >
        {springs.map((springs, index) => (
          <animated.div
            key={DOCK_ITEMS[index]}
            className="bg-[#060606] m-[5px] w-[50px] h-[50px] p-[10px] rounded-[10px] border border-white/[0.11] flex relative z-0 text-[1.5em] items-center justify-center transition-all duration-100 ease-out cursor-pointer pointer-events-auto hover:z-[2] hover:bg-[#111] hover:transition-colors hover:duration-300"
            style={{
              transform: springs.scale.to(s => `${springs.translate.get()} scale(${s})`),
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {DOCK_ITEMS[index]}
          </animated.div>
        ))}
      </animated.div>
    </div>
  )
}

export default Dock
