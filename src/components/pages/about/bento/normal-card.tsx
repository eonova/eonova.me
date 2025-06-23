import { cn } from '~/utils'

interface NormalCardProps {
  children?: React.ReactNode
  title?: string
  subheading?: string
  desc?: string
  spotlightColor?: string
  isColor?: boolean
  position?: { x: number, y: number }
  opacity?: number
}

const NormalCard: React.FC<NormalCardProps> = ({
  children,
  title,
  subheading,
  desc,
  spotlightColor = 'rgba(222, 255, 236, 0.106)',
  isColor = false,
  position = { x: 0, y: 0 },
  opacity = 0,
}) => {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {subheading && (
        <p
          className={cn(
            'text-sm text-black/50 dark:text-white/60',
            isColor ? 'text-white' : 'text-black/50 dark:text-white/80',
          )}
        >
          {subheading}
        </p>
      )}
      {title && <p className="mt-5 text-4xl">{title}</p>}
      {children}
      {desc && (
        <p
          className={cn(
            'absolute bottom-6',
            isColor ? 'text-white' : 'text-black/50 dark:text-white/80',
          )}
        >
          {desc}
        </p>
      )}
    </>
  )
}

export default NormalCard
