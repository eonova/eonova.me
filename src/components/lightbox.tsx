// @ts-nocheck
'use client';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

interface LightboxProps {
  items: ImageItem[];
  selectedIndex: number;
  onLightboxClose: () => void;
}

const LightboxComponent = ({ items, selectedIndex, onLightboxClose }: LightboxProps) => {
  // Lightbox 配置的 slides 数据
  const slides = useMemo(
    () => items.map((item) => ({ src: item.imageUrl, description: item.description })),
    [items]
  );

  return (
    <Lightbox
      open={true}
      close={onLightboxClose}
      slides={slides}
      index={selectedIndex}
      plugins={[Captions]}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ finite: items.length <= 5 }}
    />
  );
};

export default LightboxComponent;
