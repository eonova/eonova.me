'use client'
import { useState } from 'react'
import PageTitle from '~/components/page-title'
import { api } from '~/trpc/react'
import Image from 'next/image'
import Link from 'next/link'

function getMinYear(dateString: { match: (arg0: RegExp) => never[] }) {
  // 匹配所有YYYY-MM-DD格式的日期
  const datePattern = /\d{4}-\d{2}-\d{2}/g;
  const dates = dateString.match(datePattern) || [];

  if (dates.length === 0) return null;

  // 提取年份并转换为数字
  const years = dates.map((date: string) => {
    return parseInt(date.substring(0, 4), 10);
  });

  // 返回最小年份
  return Math.min(...years);
}


const Books: React.FC = () => {
  const { data, status } = api.movies.getMovieData.useQuery({
    userId: '271041273',
    actions: ['wish', 'collect'],
    config: {
      contentConfig: {
        pagination: {
          defaultPageSize: 16,
          maxVisibleLines: 4,
        },
        type: 'movie',
        allowedActions: [],
        showQuote: false,
      },
    },
  })
  const [currentTab, setCurrentTab] = useState('wish');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = data?.data?.pagination?.pageSize;

  // 获取当前选项卡数据
  const currentCollection = data?.data?.collections?.find(c => c.action === currentTab);
  const allItems = currentCollection?.items?.flat() || [];

  // 分页计算
  const totalPages = Math.ceil(allItems.length / pageSize);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return (
    <>
      <PageTitle
        title="影单"
        description="看一部电影，走一遍人生🎬"
      />
      {
        data?.success && status === 'success' &&
        <div>
          <div className="mb-8 flex space-x-4">
            <button
              onClick={() => {
                setCurrentTab('wish');
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-lg ${currentTab === 'wish'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              想看 ({data?.data?.user?.stats?.movie?.wish})
            </button>
            <button
              onClick={() => {
                setCurrentTab('collect');
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-lg ${currentTab === 'collect'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              看过 ({data?.data?.user?.stats?.movie?.collect})
            </button>
          </div>
          {/* 电影网格布局 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {paginatedItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg during-200 hover:scale-103 transition-all"
              >
                <Image
                  width={100}
                  height={80}
                  src={item.coverUrl}
                  alt={item.metaInfo}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-md font-semibold mb-2 line-clamp-1" title={item.title} alt={item.title}>
                    {item.title}
                  </h3>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-gray-500">{getMinYear(item.publishDate)}</span>
                    <Link
                      href={item.detailUrl}
                      className="text-blue-500 hover:text-blue-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      查看详情 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页控件 */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              上一页
            </button>

            <span className="text-gray-600">
              第 {currentPage} 页 / 共 {totalPages} 页
            </span>

            <button
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      }
    </>
  )
}

export default Books
