'use client'

import type { Post } from 'content-collections'

import { useState } from 'react'
import PostCards from './post-cards'
import { CATEGORIES } from '~/config/post'
import { buttonVariants } from './base'
import { cn } from '~/lib/utils'

interface FilteredPostsProps {
  posts: Post[]
}



function FilteredPosts(props: FilteredPostsProps) {
  const [currentCategories, setCategories] = useState<string>(CATEGORIES[0]!)
  const { posts } = props
  // const [searchValue, setSearchValue] = useState('')

  // const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchValue.toLowerCase()) && post.categories.includes(currentCategories)
  // )

  const filteredPosts = posts.filter(post => post.categories.includes(currentCategories)
  )

  return (
    <>
      {/* <div className="relative mb-5">
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
      </div> */}
      <ul className='flex gap-5 mb-8'>
        {
          CATEGORIES.map(i => {
            return (
              <li
                className={cn(buttonVariants({ variant: 'ghost' }), 'border cursor-pointer', i === currentCategories && 'bg-gray-300/20')}
                key={i}
                onClick={() => setCategories(i)}
              >
                {i}
              </li>
            )
          })
        }
      </ul>
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
