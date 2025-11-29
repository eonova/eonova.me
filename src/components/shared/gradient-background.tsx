import { useId } from 'react'
import { cn } from '~/utils/cn'

type GradientBackgroundProps = React.ComponentProps<'svg'>

function Filter(props: React.ComponentProps<'filter'>) {
  return (
    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" {...props}>
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
      <feGaussianBlur result="gradient-background-blur" stdDeviation="118.081" />
    </filter>
  )
}

function GradientBackground(props: GradientBackgroundProps & { isBottom?: boolean }) {
  const { className, isBottom = false, ...rest } = props

  const id = useId()
  const orange = `orange-${id}`
  const red = `red-${id}`
  const blue = `blue-${id}`

  const filterUrl = (id: string) => `url(#${id})`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      fill="none"
      viewBox={isBottom ? '-30 70 1550 550' : '0 0 1550 550'}
      preserveAspectRatio="xMidYMid meet"
      className={cn(isBottom ? 'max-w-430' : 'max-w-355', className)}
      {...rest}
    >
      <g filter={filterUrl(orange)}>
        <ellipse cx="1068.121" cy="70.207" fill="#FFB800" fillOpacity={isBottom ? '.8' : '.43'} rx="307.881" ry="75.058" />
      </g>
      <g filter={filterUrl(red)}>
        <ellipse cx="758.789" cy={isBottom ? '150' : '70.819'} fill="#E93F3F" fillOpacity={isBottom ? '.75' : '.55'} rx="324.881" ry="135.671" />
      </g>
      <g filter={filterUrl(blue)}>
        <ellipse cx="470.666" cy="50.364" fill="#3F64E9" fillOpacity={isBottom ? '.75' : '.48'} rx="294.881" ry="89.316" />
      </g>
      <defs>
        <Filter id={orange} width="1642.08" height="910.509" x="377.079" y="-120.012" />
        <Filter id={red} width="1642.08" height="935.665" x="-106.747" y="-150.013" />
        <Filter id={blue} width="1942.08" height="900.953" x="-956.376" y="-120.113" />
      </defs>
    </svg>
  )
}

export default GradientBackground
