'use client'

import Zoom from 'react-medium-image-zoom'
import '~/styles/page/image-zoom.css'

import 'react-medium-image-zoom/dist/styles.css'

type ImageZoomProps = {
  children: React.ReactNode
} & React.ComponentProps<typeof Zoom>

function ImageZoom(props: ImageZoomProps) {
  const { children, ...rest } = props

  return (
    <Zoom zoomMargin={40} {...rest}>
      {children}
    </Zoom>
  )
}

export default ImageZoom
