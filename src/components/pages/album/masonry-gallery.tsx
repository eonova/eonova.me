// @ts-nocheck
'use client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { buttonVariants } from '~/components/base/button'
import NonFound from '~/components/shared/non-found'
import { useTRPC } from '~/trpc/client'
import { cn } from '~/utils'
import Lightbox from './lightbox'
import Masonry from './masonry'
import WhirlpoolLoader from './whirlpool-loader'

interface ImageItem {
  id: number // 图片 ID
  imageUrl: string
  height: number // 图片原始高度
  width: number // 图片原始宽度
  description?: string | null
}

interface WaterfallGalleryProps {
  itemsPerPage?: number // 每页显示的图片数量
}

function WaterfallGallery({ itemsPerPage = 12 }: WaterfallGalleryProps) {
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(trpc.album.getAllImages.queryOptions())
  const items: ImageItem[] = data?.images ?? []
  const [currentPage, setCurrentPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // 分页处理
  const visibleItems = items.slice(0, currentPage * itemsPerPage)

  // 处理图片点击事件
  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
    setIsOpen(true)
  }

  // 处理 Lightbox 关闭事件
  const handleCloseLightbox = () => {
    setIsOpen(false)
  }

  return (
    <>
      {isLoading && <WhirlpoolLoader />}
      {isError && <div>无法获取用户数据。请刷新页面。</div>}
      {!isLoading && !isError && items.length > 0 && (
        <div className="container mx-auto py-8">
          {/* 瀑布流布局 */}
          <Masonry data={visibleItems} onImageClick={handleImageClick} />

          {/* 加载更多按钮 */}
          {visibleItems.length < items.length && (
            <div className="my-8 text-center">
              <button
                type="button"
                onClick={() => setCurrentPage(p => p + 1)}
                className={cn(
                  'cursor-pointer rounded-xl px-6 py-2 transition-colors',
                  buttonVariants({
                    variant: 'outline',
                  }),
                )}
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
      )}
      {!isLoading && !isError && items.length === 0 && <NonFound />}
    </>
  )
}

export default WaterfallGallery
