'use client'

import type { ListCommentsInput } from '~/orpc/routers'

import { useState } from 'react'

import { CommentsProvider } from '~/contexts/comments.context'

import CommentList from './comment-list'
import CommentPost from './comment-post'

interface CommentSectionProps {
  slug: string
  contentType?: 'posts' | 'notes' | 'talks'
}

function CommentSection(props: CommentSectionProps) {
  const { slug, contentType = 'posts' } = props
  const [sort, setSort] = useState<ListCommentsInput['sort']>('newest')

  return (
    <CommentsProvider value={{ slug, sort, setSort, contentType }}>
      <div id="comment" className="space-y-6">
        <CommentPost />
        <CommentList />
      </div>
    </CommentsProvider>
  )
}

export default CommentSection
