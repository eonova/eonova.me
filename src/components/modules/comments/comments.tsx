'use client'

import type { GetInfiniteCommentsInput } from '~/trpc/routers/comments'

import { useCallback, useRef, useState } from 'react'

import { CommentsProvider } from '~/contexts/comments'

import { RatesProvider } from '~/contexts/rates'
import CommentContent from './comment-content'
import CommentsList from './comment-list'

interface CommentsProps {
  slug: string
  type?: 'post' | 'note' | 'talk'
}

function Comments(props: CommentsProps) {
  const { slug, type = 'post' } = props
  const mutationCount = useRef(0)
  const [sort, setSort] = useState<GetInfiniteCommentsInput['sort']>('newest')

  const increment = useCallback(() => {
    mutationCount.current += 1
  }, [])

  const decrement = useCallback(() => {
    mutationCount.current -= 1
  }, [])

  const getCount = useCallback(() => mutationCount.current, [])

  return (
    <RatesProvider value={{ increment, decrement, getCount }}>
      <CommentsProvider
        value={{
          slug,
          sort,
          setSort,
          type,
        }}
      >
        <div id="comment" className="space-y-6">
          <CommentContent />
          <CommentsList />
        </div>
      </CommentsProvider>
    </RatesProvider>
  )
}

export default Comments
