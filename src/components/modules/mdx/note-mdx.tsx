import type { UrlObject } from 'node:url'
import rehypeShiki from '@shikijs/rehype'
import { MDXRemote } from 'next-mdx-remote/rsc'
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
  h1: (props: React.ComponentProps<'h1'>) => <Heading className="font-yozai" as="h1" {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <Heading className="font-yozai" as="h2" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <Heading className="font-yozai" as="h3" {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <Heading className="font-yozai" as="h4" {...props} />,
  h5: (props: React.ComponentProps<'h5'>) => <Heading className="font-yozai" as="h5" {...props} />,
  h6: (props: React.ComponentProps<'h6'>) => <Heading className="font-yozai" as="h6" {...props} />,
  p: (props: React.ComponentProps<'p'>) => <p className="font-yozai indent-8" {...props} />,
  a: (props: React.ComponentProps<'a'>) => {
    const { children, ...rest } = props

    return (
      <Link
        className="font-yozai hover:text-foreground text-anchor no-underline transition-colors"
        {...(rest as unknown as { href: UrlObject })}
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
  img: (props: React.ComponentProps<'img'>) => {
    const { alt, ...rest } = props
    return (
      <>
        <img className="rounded-xl border max-h-[500px]" {...rest} alt={alt || ''} />
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

  return (
    <div className="prose w-full">
      <MDXRemote
        source={code}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypeShiki, { theme: 'github-dark' }]],
          },
        }}
      />
    </div>
  )
}

export default NoteMdx
