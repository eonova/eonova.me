// @ts-nocheck
'use client';
import { useState } from 'react';
import Masonry from './masonry';
import Lightbox from './lightbox';

interface ImageItem {
  id: number; // 图片 ID
  imageUrl: string;
  height: number; // 图片原始高度
  width: number; // 图片原始宽度
  description?: string | null;
}

interface WaterfallGalleryProps {
  items: ImageItem[]; // 图片数据
  itemsPerPage?: number; // 每页显示的图片数量
}

const WaterfallGallery = ({
  items,
  itemsPerPage = 12,
}: WaterfallGalleryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 分页处理
  const visibleItems = items.slice(0, currentPage * itemsPerPage);

  // 处理图片点击事件
  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  // 处理 Lightbox 关闭事件
  const handleCloseLightbox = () => {
    setIsOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      {/* 瀑布流布局 */}
      <Masonry
        data={visibleItems}
        onImageClick={handleImageClick}
      />

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
      {isOpen && (
        <Lightbox
          items={items}
          selectedIndex={selectedIndex}
          onLightboxClose={handleCloseLightbox}
        />
      )}
    </div>
  );
};

export default WaterfallGallery;
