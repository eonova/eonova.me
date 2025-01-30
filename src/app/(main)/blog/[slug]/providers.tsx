'use client'

import type { BlogPost } from 'mdx/generated'

import { PostProvider } from '~/contexts/post'

interface ProvidersProps {
  children: React.ReactNode
  post: BlogPost
}

function Providers(props: ProvidersProps) {
  const { children, post } = props

  return <PostProvider value={post}>{children}</PostProvider>
}

export default Providers
