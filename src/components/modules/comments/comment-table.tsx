import { Table } from '~/components/base/table'
import { cn } from '~/utils'

type CommentTableProps = React.ComponentProps<'table'>

function CommentTable(props: CommentTableProps) {
  const { className, ...rest } = props

  return <Table className={cn('not-prose my-2', className)} {...rest} />
}

export default CommentTable
