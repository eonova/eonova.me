'use client'

import type { Post } from 'content-collections'
import PostCards from './post-cards'

interface FilteredPostsProps {
  posts: Post[]
}

function FilteredPosts(props: FilteredPostsProps) {
  const { posts } = props

  return (
    <>
      {posts.length === 0
        ? (
          <div className="my-24 text-center text-xl">
            暂无结果
          </div>
        )
        : null}
      <PostCards posts={posts} />
    </>
  )
}

export default FilteredPosts
