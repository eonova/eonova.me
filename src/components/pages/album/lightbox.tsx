// @ts-nocheck
'use client'
import { useMemo } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/styles.css'

interface ImageItem {
  id: number
  imageUrl: string
  height: number
  width: number
  description?: string | null
}
interface LightboxProps {
  items: ImageItem[]
  selectedIndex: number
  onLightboxClose: () => void
}

function LightboxComponent({ items, selectedIndex, onLightboxClose }: LightboxProps) {
  // Lightbox 配置的 slides 数据
  const slides = useMemo(
    () => items.map(item => ({ src: item.imageUrl, description: item.description })),
    [items],
  )

  return (
    <Lightbox
      open
      close={onLightboxClose}
      slides={slides}
      index={selectedIndex}
      plugins={[Captions]}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ finite: items.length <= 5 }}
    />
  )
}

export default LightboxComponent
