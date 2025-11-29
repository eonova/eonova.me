import { useMDXComponent } from '@content-collections/mdx/react'
import { BlurImage } from '~/components/base/blur-image'

import { CodeBlock } from '~/components/base/code-block'

import { Link } from '~/components/base/link'

import ImageZoom from '~/components/pages/album/image-zoom'
import Logo from '~/components/shared/logo'
import Heading from './heading'
import ItemGrid from './item-grid'
import LinkCard from './link-card'
import Table from './table'
import TreeView from './tree-view'
import Video from './video'

interface MdxProps {
  code: string
}

const components = {
  h2: (props: React.ComponentProps<'h2'>) => <Heading as="h2" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <Heading as="h3" {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <Heading as="h4" {...props} />,
  h5: (props: React.ComponentProps<'h5'>) => <Heading as="h5" {...props} />,
  h6: (props: React.ComponentProps<'h6'>) => <Heading as="h6" {...props} />,
  a: (props: React.ComponentProps<'a'>) => {
    const { children, ...rest } = props

    return (
      <Link
        className="text-anchor no-underline transition-colors hover:text-foreground"
        {...(rest as { href: string })}
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
        <img className="rounded-xl border" {...rest} alt={alt || ''} />
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
}

function Mdx(props: MdxProps) {
  const { code } = props
  const MDXContent = useMDXComponent(code)

  return (
    <div className="prose w-full">
      <MDXContent components={components} />
    </div>
  )
}

export default Mdx
