import { LinkIcon } from 'lucide-react'
import { cn } from '~/utils'

type Types = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingProps<T extends Types> = Omit<React.ComponentProps<T>, 'as'> & {
  as?: T
}

function Heading<T extends Types = 'h1'>(props: HeadingProps<T>) {
  const { as, className, children, id, ...rest } = props
  const Component = as ?? 'h1'

  return (
    <Component className={cn('scroll-m-32', className)} id={id} {...rest}>
      <a href={`#${id}`} className="group font-bold no-underline">
        {children}
        <LinkIcon
          aria-label="连结至章节"
          className="text-muted-foreground ml-2 inline size-4 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </a>
    </Component>
  )
}

export default Heading
