import { cn } from '~/utils'
import { Table } from '../base/table'

type CommentTableProps = React.ComponentProps<'table'>

function CommentTable(props: CommentTableProps) {
  const { className, ...rest } = props

  return <Table className={cn('not-prose my-2', className)} {...rest} />
}

export default CommentTable
