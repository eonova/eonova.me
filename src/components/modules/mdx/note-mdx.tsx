import type { Url } from 'next/dist/shared/lib/router/router'

import { useMDXComponent } from '@content-collections/mdx/react'
import Link from 'next/link'
import { BlurImage } from '~/components/base/blur-image'
import { CodeBlock } from '~/components/base/code-block'
import { Kbd } from '~/components/base/kbd'
import ImageZoom from '~/components/pages/album/image-zoom'
import Logo from '~/components/shared/logo'
import Heading from './heading'
import ItemGrid from './item-grid'
import LinkCard from './link-card'
import Table from './table'
import Video from './video'

interface MdxProps {
  code: string
}

const components = {
  h1: (props: React.ComponentProps<'h1'>) => <Heading as="h1" {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <Heading as="h2" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <Heading as="h3" {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <Heading as="h4" {...props} />,
  h5: (props: React.ComponentProps<'h5'>) => <Heading as="h5" {...props} />,
  h6: (props: React.ComponentProps<'h6'>) => <Heading as="h6" {...props} />,
  a: (props: React.ComponentProps<'a'>) => {
    const { children, ...rest } = props

    return (
      <Link
        className="hover:text-foreground text-anchor no-underline transition-colors"
        {...(rest as { href: Url })}
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
  Kbd,
}

function NoteMdx(props: MdxProps) {
  const { code } = props
  const MDXContent = useMDXComponent(code)

  return (
    <div className="prose w-full">
      <MDXContent components={components} />
    </div>
  )
}

export default NoteMdx
