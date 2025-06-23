import type { Column } from '@tanstack/react-table'

import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, EyeOffIcon, XIcon } from 'lucide-react'

import { buttonVariants } from '~/components/base/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/base/dropdown-menu'
import { cn } from '~/utils'

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
} & React.ComponentProps<'button'>

function DataTableColumnHeader<TData, TValue>(props: DataTableColumnHeaderProps<TData, TValue>) {
  const { column, title, className, ...rest } = props

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>
  }

  const isDesc = column.getIsSorted() === 'desc'
  const isAsc = column.getIsSorted() === 'asc'
  const isUnsorted = !isDesc && !isAsc

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          '-ml-1.5 h-8 py-1.5',
          'data-[state=open]:bg-accent',
          'has-[>svg]:px-2',
          className,
        )}
        {...rest}
      >
        {title}
        {column.getCanSort() && (
          <>
            {isDesc && <ChevronDownIcon />}
            {isAsc && <ChevronUpIcon />}
            {isUnsorted && <ChevronsUpDownIcon />}
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-28">
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={column.getIsSorted() === 'asc'}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUpIcon />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={column.getIsSorted() === 'desc'}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDownIcon />
              Desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground pl-2"
                onClick={() => column.clearSorting()}
              >
                <XIcon />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOffIcon />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataTableColumnHeader }
