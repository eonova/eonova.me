'use client'
import { useState, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Captions from "yet-another-react-lightbox/plugins/captions";
import 'yet-another-react-lightbox/styles.css';
import "yet-another-react-lightbox/plugins/captions.css";
import '~/styles/page/gallery.css'

interface ImageItem {
  imageUrl: string;
  height: number | null;
  width: number | null;
  description?: string | null;
}

interface WaterfallGalleryProps {
  items: ImageItem[];
  itemsPerPage?: number;
}

const WaterfallGallery = ({
  items,
  itemsPerPage = 12
}: WaterfallGalleryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 分页处理
  const visibleItems = useMemo(() =>
    items.slice(0, currentPage * itemsPerPage),
    [items, currentPage, itemsPerPage]
  );

  // Lightbox配置
  const slides = useMemo(() =>
    items.map(item => ({
      src: item.imageUrl,
      description: item.description,
    })),
    [items]
  );

  // 瀑布流断点配置
  const breakpointColumns = {
    default: 4,
    1200: 3,
    600: 2
  };

  return (
    <div className="container mx-auto">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-3"
        columnClassName="pl-3"
      >
        {visibleItems.map((item, index) => (
          <div
            key={`${item.imageUrl}-${index}`}
            className="mb-3 cursor-zoom-in relative"
            onClick={() => {
              setSelectedIndex(index);
              setIsOpen(true);
            }}
          >
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src={item.imageUrl}
                alt={item.description || ''}
                width={item.width ?? 300}
                height={item.height ?? 200}
                className="rounded-xl w-full h-auto object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
            </div>
          </div>
        ))}
      </Masonry>

      {visibleItems.length < items.length && (
        <div className="text-center my-8">
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
          >
            加载更多
          </button>
        </div>
      )}

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={selectedIndex}
        plugins={[Captions]}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: items.length <= 5 }}
      />
    </div>
  );
};

export default WaterfallGallery;
