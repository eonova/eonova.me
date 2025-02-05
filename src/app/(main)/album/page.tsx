'use client'
import Masonry from '~/components/masonry'
import PageTitle from '~/components/page-title'

const datas = [
  { id: 1, image: 'https://picsum.photos/id/10/200/300', height: 400 },
  { id: 2, image: 'https://picsum.photos/id/14/200/300', height: 300 },
  { id: 3, image: 'https://picsum.photos/id/15/200/300', height: 300 },
  { id: 4, image: 'https://picsum.photos/id/16/200/300', height: 300 },
  { id: 5, image: 'https://picsum.photos/id/17/200/300', height: 300 },
  { id: 6, image: 'https://picsum.photos/id/19/200/300', height: 300 },
  { id: 7, image: 'https://picsum.photos/id/37/200/300', height: 200 },
  { id: 8, image: 'https://picsum.photos/id/39/200/300', height: 300 },
  { id: 9, image: 'https://picsum.photos/id/85/200/300', height: 200 },
  { id: 10, image: 'https://picsum.photos/id/103/200/300', height: 400 },
]

const Album: React.FC = () => {
  return (
    <>
      <PageTitle
        title="相册"
        description="👋 嗨！我是 LeoStar，一个热爱网页开发的学生。"
      />
      <Masonry data={datas} />
    </>
  )
}

export default Album
