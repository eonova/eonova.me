'use client'

import type { Post } from 'content-collections'

import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

import { Input } from './base/input'
import { Label } from './base/label'
import PostCards from './post-cards'

interface FilteredPostsProps {
  posts: Post[]
}

function FilteredPosts(props: FilteredPostsProps) {
  const { posts } = props
  const [searchValue, setSearchValue] = useState('')

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchValue.toLowerCase()),
  )

  return (
    <>
      <div className="relative mb-8">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
          }}
          placeholder="搜寻文章"
          aria-label="搜寻文章"
          className="w-full pl-12"
          id="search"
        />
        <Label htmlFor="search">
          <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2" />
        </Label>
      </div>
      {filteredPosts.length === 0
        ? (
          <div className="my-24 text-center text-xl">
            暂无结果
          </div>
        )
        : null}
      <PostCards posts={filteredPosts} />
    </>
  )
}

export default FilteredPosts
