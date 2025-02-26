import MarkdownToJSX from 'markdown-to-jsx'
import Link from 'next/link'
import { Fragment, memo } from 'react'
import VideoCard from './video-card'

interface MarkdownProps {
  children: string
}

const TalkMdx = memo((props: MarkdownProps) => {
  const { children } = props

  return (
    <MarkdownToJSX
      options={{
        overrides: {
          a: Link,
          iframe: {
            component: VideoCard,
          },
        },
        wrapper: Fragment,
      }}
    >
      {children}
    </MarkdownToJSX>
  )
})

TalkMdx.displayName = 'TalkMdx'

export default TalkMdx
