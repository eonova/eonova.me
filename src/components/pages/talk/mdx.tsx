import MarkdownToJSX from 'markdown-to-jsx'
import Link from 'next/link'
import { Fragment, memo } from 'react'
import { MParagraph } from './paragraph'
import IframeCard from './video-card'

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
          p: MParagraph,
          iframe: IframeCard,
        },
        disableParsingRawHTML: false,
        wrapper: Fragment,
        tagfilter: false,
      }}
    >
      {children}
    </MarkdownToJSX>
  )
})

TalkMdx.displayName = 'TalkMdx'

export default TalkMdx
