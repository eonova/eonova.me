import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'
import { cn } from '~/utils'

export const MParagraph: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = (props) => {
  const { children, ...other } = props
  const { className, ...rest } = other

  return (
    <div className={cn('paragraph', className)} {...rest}>
      {children}
    </div>
  )
}
