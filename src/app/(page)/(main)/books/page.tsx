'use client'
import type { MovieDataResponse } from '~/types/douban'
import { useState } from 'react'
import PageTitle from '~/components/page-title'
import { api } from '~/trpc/react'

export default async function MovieList() {
  const { data } = await api.movies.getMovieData.useQuery({
    userId: '271041273',
    actions: ['wish', 'collect'],
    config: {
      contentConfig: {
        pagination: {
          defaultPageSize: 15,
          maxVisibleLines: 3
        },
        type: "movie",
        allowedActions: [],
        showQuote: false
      }
    }
  });

  console.log('123333333333333333', data)
  const moviesData = (data as MovieDataResponse).data

  const [currentTab, setCurrentTab] = useState('wish')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = moviesData.pagination.pageSize ?? 0

  // 获取当前选项卡数据
  const currentCollection = moviesData.collections.find((c: { action: string }) => c.action === currentTab)
  const allItems = currentCollection?.items.flat() || []

  // 分页计算
  const totalPages = Math.ceil(allItems.length / pageSize)
  const paginatedItems = allItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <>
      <PageTitle
        title="书单"
        description="多看看书📚"
      />
      <div className="min-h-screen bg-gray-100 p-8">
        {/* 选项卡 */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => {
              setCurrentTab('wish')
              setCurrentPage(1)
            }}
            className={`px-6 py-2 rounded-lg ${currentTab === 'wish'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
              }`}
          >
            想看 (
            {moviesData.user.stats.movie.wish}
            )
          </button>
          <button
            onClick={() => {
              setCurrentTab('collect')
              setCurrentPage(1)
            }}
            className={`px-6 py-2 rounded-lg ${currentTab === 'collect'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
              }`}
          >
            看过 (
            {moviesData.user.stats.movie.collect}
            )
          </button>
        </div>

        {/* 电影网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={item.coverUrl}
                alt={item.metaInfo}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                  {item.metaInfo?.split('|')[0]!.replace('导演: ', '')}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.metaInfo}
                </p>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-500">{item.markInfo}</span>
                  <a
                    href={item.detailUrl}
                    className="text-blue-500 hover:text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看详情 →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分页控件 */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            上一页
          </button>

          <span className="text-gray-600">
            第
            {' '}
            {currentPage}
            {' '}
            页 / 共
            {' '}
            {totalPages}
            {' '}
            页
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      </div>
    </>
  )
}
