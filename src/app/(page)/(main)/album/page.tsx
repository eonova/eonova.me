'use client'
import WaterfallGallery from '~/components/masonry-gallery';
import PageTitle from '~/components/page-title'
import { api } from '~/trpc/react';

const Album: React.FC = () => {
  const { status, data } = api.album.getAllImages.useQuery()

  const isSuccess = status === 'success'
  const isError = status === 'error'
  console.log('============', data?.images)
  return (
    <>
      <PageTitle
        title="相册"
        description="👋 嗨！我是 LeoStar，一个热爱网页开发的学生。"
      />
      {isError && <div>无法获取用户数据。请刷新页面。</div>}
      {isSuccess && <WaterfallGallery
        items={data?.images}
        itemsPerPage={12}
      />}
    </>
  )
}

export default Album
