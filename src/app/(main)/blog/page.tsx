import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import FilteredPosts from '~/components/filtered-posts'
import PageTitle from '~/components/page-title'

const Blog: React.FC = () => {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  console.log('posts', posts)
  return (
    <>
      <PageTitle
        title="博客"
        description="欢迎来到我的博客！在这里，我会分享生活中的点滴感悟，从日常小事里汲取的温暖与力量，也会复盘个人成长的关键时刻，那些迷茫、坚持与突破，都是宝贵的人生财富。作为前端技术爱好者，我还会分享各类技术干货，如 JavaScript 的实用技巧、CSS 的奇思妙想布局，希望能为同行提供新思路，和大家一起在技术海洋里畅游，共同成长。"
      />
      <FilteredPosts posts={posts} />
    </>
  )
}

export default Blog
