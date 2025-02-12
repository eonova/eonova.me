// @ts-nocheck
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useTransition, a } from 'react-spring';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import '~/styles/page/gallery.css';

interface ImageItem {
  id: number; // 图片 ID
  imageUrl: string;
  height: number; // 图片原始高度
  width: number; // 图片原始宽度
  description?: string | null;
}

interface WaterfallGalleryProps {
  items: ImageItem[];
  itemsPerPage?: number;
}

const WaterfallGallery = ({
  items,
  itemsPerPage = 12,
}: WaterfallGalleryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 分页处理
  const visibleItems = useMemo(
    () => items.slice(0, currentPage * itemsPerPage),
    [items, currentPage, itemsPerPage]
  );

  // Lightbox 配置
  const slides = useMemo(
    () => items.map((item) => ({ src: item.imageUrl, description: item.description })),
    [items]
  );

  // 瀑布流布局组件
  const Masonry = ({ data }) => {
    const [columns, setColumns] = useState(1);
    const [width, setWidth] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const prevContainerWidth = useRef(0); // 用于记录上一次的容器宽度

    useEffect(() => {
      const handleResize = () => {
        const containerWidth = ref.current?.offsetWidth || 0;
        if (containerWidth === prevContainerWidth.current) return;

        prevContainerWidth.current = containerWidth;
        setWidth(containerWidth);

        let newColumns = 1;
        if (containerWidth >= 1500) {
          newColumns = 5;
        } else if (containerWidth >= 1024 && containerWidth < 1500) {
          newColumns = 4;
        } else if (containerWidth >= 750 && containerWidth < 1024) {
          newColumns = 4;
        } else {
          newColumns = 2;
        }

        setColumns(newColumns);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [heights, gridItems] = useMemo(() => {
      let heights = new Array(columns).fill(0);
      const gridItems = data.map((child, index) => {
        if (!child) return null; // 跳过无效的 child
        const column = heights.indexOf(Math.min(...heights));
        const x = (width / columns) * column;
        const y = (heights[column] += child.height) - child.height;
        return {
          ...child,
          x,
          y,
          width: width / columns,
          height: child.height,
          index,
        };
      });
      return [heights, gridItems.filter(Boolean)]; // 过滤掉无效的 item
    }, [columns, data, width]);

    const transitions = useTransition(gridItems, {
      keys: (item) => item?.index ?? 'fallback-key',
      update: ({ x, y, width, height }) => ({
        x,
        y,
        width,
        height,
      }),
      leave: { height: 0, opacity: 0 },
      config: { mass: 5, tension: 500, friction: 100 },
      trail: 25,
      immediate: (item) => !item, // 只有当 item 不存在时才立即执行 transition
    });

    return (
      <div
        ref={ref}
        className="relative w-full h-full"
        style={{ height: Math.max(...heights) }}
      >
        {transitions((style, item) => {
          if (!item) return null; // 跳过未定义的 item
          return (
            <a.div
              key={item.id}
              style={style}
              className="absolute p-1 py-2 [will-change:transform,width,height,opacity] overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedIndex(item.index);
                setIsOpen(true);
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.description || ''}
                className="w-full h-full object-cover"
                style={{
                  height: `${item.height}px`,
                  width: `${item.width}px`,
                }}
              />
            </a.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      {/* 瀑布流布局 */}
      <Masonry data={visibleItems} />

      {/* 加载更多按钮 */}
      {visibleItems.length < items.length && (
        <div className="text-center my-8">
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
          >
            加载更多
          </button>
        </div>
      )}

      {/* 图片预览 Lightbox */}
      <Lightbox
        open={isOpen}
        close={() => {
          setIsOpen(false);
          setSelectedIndex(0); // 重置索引
        }}
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
