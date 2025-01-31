import { cn } from '~/lib/utils'
import '~/styles/font.css'

interface BackgroundFontProps {
  children: React.ReactNode
  className?: string
}

const BackgroundFont: React.FC<BackgroundFontProps> = ({ children, className }) => {
  return (
    <h6 className={cn('page-section-title font-world', className)}>
      {children}
    </h6>
  )
}

export default BackgroundFont
