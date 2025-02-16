// @ts-nocheck
'use client';
import { useState } from 'react';
import Masonry from './masonry';
import Lightbox from './lightbox';
import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/base/button'
import { api } from '~/trpc/react'
import WhirlpoolLoader from './whirlpool-loader'

interface ImageItem {
  id: number; // 图片 ID
  imageUrl: string;
  height: number; // 图片原始高度
  width: number; // 图片原始宽度
  description?: string | null;
}

interface WaterfallGalleryProps {
  itemsPerPage?: number; // 每页显示的图片数量
}

const WaterfallGallery = ({
  itemsPerPage = 12,
}: WaterfallGalleryProps) => {
  const { status, data } = api.album.getAllImages.useQuery()
  const items: ImageItem[] = data?.images ?? []
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isLoading = status === 'pending'
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
    <>
      {isLoading && <WhirlpoolLoader />}
      {isError && <div>无法获取用户数据。请刷新页面。</div>}
      {
        isSuccess && (
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
                  className={cn("px-6 py-2 transition-colors cursor-pointer rounded-xl",
                    buttonVariants({
                      variant: 'outline',
                    }),)}
                >
                  加载更多
                </button>
              </div>
            )
            }

            {/* 图片预览 Lightbox */}
            {
              isOpen && (
                <Lightbox
                  items={items}
                  selectedIndex={selectedIndex}
                  onLightboxClose={handleCloseLightbox}
                />
              )
            }
          </div >
        )
      }
    </>
  );
};

export default WaterfallGallery;
