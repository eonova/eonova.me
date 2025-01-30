'use client'

import type { MDXComponents } from '@ileostar/mdx'
import { getMDXComponent } from '@ileostar/mdx'

import Link from 'next/link'
import { BlurImage } from '../base/blur-image'
import { CodeBlock } from '../base/code-block'
import { Kbd } from '../base/kbd'
import { TreeView } from '../base/tree-view'
import ImageZoom from '../image-zoom'
import Logo from '../logo'
import Heading from './heading'
import ItemGrid from './item-grid'
import LinkCard from './link-card'
import Table from './table'
import Video from './video'

interface MdxProps {
  code: string
}

const components: MDXComponents = {
  h2: (props: React.ComponentProps<'h2'>) => <Heading as="h2" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <Heading as="h3" {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <Heading as="h4" {...props} />,
  h5: (props: React.ComponentProps<'h5'>) => <Heading as="h5" {...props} />,
  h6: (props: React.ComponentProps<'h6'>) => <Heading as="h6" {...props} />,
  a: (props: React.ComponentProps<'a'>) => {
    const { children, ...rest } = props

    return (
      <Link
        className="hover:text-foreground text-[#ff6363] no-underline transition-colors"
        {...rest}
      >
        {children}
      </Link>
    )
  },
  Image: (props: React.ComponentProps<typeof BlurImage>) => {
    const { alt, ...rest } = props

    return (
      <>
        <ImageZoom>
          <BlurImage className="rounded-lg border" alt={alt} {...rest} />
        </ImageZoom>
        <figcaption className="mt-4 text-center">{alt}</figcaption>
      </>
    )
  },
  pre: CodeBlock,

  // Custom components
  Table,
  ItemGrid,
  Video,
  LinkCard,
  Logo,
  TreeView,
  Kbd,
}

function Mdx(props: MdxProps) {
  const { code } = props
  const MDXContent = getMDXComponent(code)

  return (
    <div className="prose w-full">
      <MDXContent components={components} />
    </div>
  )
}

export default Mdx
