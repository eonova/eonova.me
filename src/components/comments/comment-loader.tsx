import { Loader2Icon } from 'lucide-react'
import { cn } from '~/lib/utils'

function CommentLoader(props: React.ComponentProps<'div'>) {
  const { className, ...rest } = props

  return (
    <div className={cn('flex min-h-20 items-center justify-center', className)} {...rest}>
      <Loader2Icon className="size-7 animate-spin" />
    </div>
  )
}

export default CommentLoader
