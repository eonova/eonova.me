import { cn } from '~/lib/utils'
import '~/styles/page/font.css'

interface BackgroundFontProps {
  children: React.ReactNode
  className?: string
  lineHeight?: string
}

const BackgroundFont: React.FC<BackgroundFontProps> = ({ children, className, lineHeight = '1.1' }) => {
  return (
    <h6
      className={cn('page-section-title font-world', className)}
      style={{
        lineHeight,
      }}
    >
      {children}
    </h6>
  )
}

export default BackgroundFont
