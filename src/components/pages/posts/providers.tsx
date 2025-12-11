'use client'

import type { Post } from '~/lib/content'

import { PostProvider } from '~/contexts/post'

interface ProvidersProps {
  children: React.ReactNode
  post: Post
}

function Providers(props: Readonly<ProvidersProps>) {
  const { children, post } = props

  return <PostProvider value={post}>{children}</PostProvider>
}

export default Providers
