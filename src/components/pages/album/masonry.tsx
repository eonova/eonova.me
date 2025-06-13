// @ts-nocheck
'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { a, useTransition } from 'react-spring'

interface ImageItem {
  id: number
  imageUrl: string
  height: number
  width: number
  description?: string | null
}

interface MasonryProps {
  data: ImageItem[]
  onImageClick?: (index: number) => void
}

function MasonryComponent({ data, onImageClick }: MasonryProps) {
  const [columns, setColumns] = useState(1)
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const prevContainerWidth = useRef(0)

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = ref.current?.offsetWidth ?? 0
      if (containerWidth === prevContainerWidth.current)
        return

      prevContainerWidth.current = containerWidth
      setWidth(containerWidth)

      let newColumns = 1
      if (containerWidth >= 1500) {
        newColumns = 5
      }
      else if (containerWidth >= 750 && containerWidth < 1024) {
        newColumns = 4
      }
      else if (containerWidth >= 500 && containerWidth < 750) {
        newColumns = 3
      }
      else {
        newColumns = 2
      }

      setColumns(newColumns)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [heights, gridItems] = useMemo(() => {
    const heights = Array.from({ length: columns }, () => 0)
    const gridItems = data.map((child, index) => {
      if (!child)
        return null
      const column = heights.indexOf(Math.min(...heights))
      const x = (width / columns) * column
      const y = (heights[column] += child.height) - child.height
      return {
        ...child,
        x,
        y,
        width: width / columns,
        height: child.height,
        index,
      }
    })
    return [heights, gridItems.filter(Boolean)]
  }, [columns, data, width])

  const transitions = useTransition(gridItems, {
    keys: item => item?.index ?? 'fallback-key',
    from: ({ x, y, width, height }) => ({
      x,
      y,
      width,
      height,
    }),
    update: ({ x, y, width, height }) => ({
      x,
      y,
      width,
      height,
    }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  })

  return (
    <div
      ref={ref}
      className="relative w-full h-full"
      style={{ height: Math.max(...heights) }}
    >
      {transitions((style, item) => {
        if (!item)
          return null
        return (
          <a.div
            key={item.id}
            style={style}
            className="absolute p-1 [will-change:transform,width,height,opacity] overflow-hidden cursor-pointer"
            onClick={() => {
              if (onImageClick) {
                onImageClick(item.index)
              }
            }}
          >
            <img
              src={item.imageUrl}
              height={item.height}
              width={item.width}
              alt={item.description ?? ''}
              className="w-full h-full object-cover"
            />
          </a.div>
        )
      })}
    </div>
  )
}

export default MasonryComponent
