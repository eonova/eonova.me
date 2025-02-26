import clsx from 'clsx'
import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'
import * as React from 'react'


export const MParagraph: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = (props) => {
  const { children, ...other } = props
  const { className, ...rest } = other

  if (React.Children.count(children) === 1) {
    // isImage
    const child = React.Children.toArray(children)[0]
    if (isImage(child)) {
      return children
    }
  }

  return (
    <div className={clsx('paragraph', className)} {...rest}>
      {children}
    </div>
  )
}

const isImage = (child: any) => {
  if (typeof child === 'object' && (child as any)?.props?.src) {
    return true
  }
  return false
}
