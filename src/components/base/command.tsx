import type { DialogProps } from '@radix-ui/react-dialog'

import { Command as CommandPrimitive } from 'cmdk'

import { cn } from '~/utils'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog'
import { VisuallyHidden } from './visually-hidden'

type CommandProps = React.ComponentProps<typeof CommandPrimitive>

function Command(props: CommandProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive
      className={cn(
        'bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-lg border pt-2 shadow-md',
        '[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:mt-2',
        className,
      )}
      {...rest}
    />
  )
}

type CommandDialogProps = DialogProps & Pick<CommandProps, 'value' | 'onValueChange'>

function CommandDialog(props: CommandDialogProps) {
  const { children, value, onValueChange, ...rest } = props

  return (
    <Dialog {...rest}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <VisuallyHidden>
          <DialogTitle>Command Menu</DialogTitle>
          <DialogDescription>Search a command</DialogDescription>
        </VisuallyHidden>
        <Command value={value} onValueChange={onValueChange} className="border-0 shadow-none">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

type CommandInputProps = React.ComponentProps<typeof CommandPrimitive.Input>

function CommandInput(props: CommandInputProps) {
  const { className, ...rest } = props

  return (
    <div className="border-b pb-2">
      <CommandPrimitive.Input
        className={cn(
          'w-full bg-transparent px-4 py-2 text-sm outline-none',
          'placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
      />
    </div>
  )
}

type CommandListProps = React.ComponentProps<typeof CommandPrimitive.List>

function CommandList(props: CommandListProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive.List
      className={cn(
        'max-h-[50vh] overflow-x-hidden overflow-y-auto px-2 [&>[cmdk-list-sizer]]:py-2',
        className,
      )}
      {...rest}
    />
  )
}

type CommandEmptyProps = React.ComponentProps<typeof CommandPrimitive.Empty>

function CommandEmpty(props: CommandEmptyProps) {
  return <CommandPrimitive.Empty className="py-6 text-center text-sm" {...props} />
}

type CommandGroupProps = React.ComponentProps<typeof CommandPrimitive.Group>

function CommandGroup(props: CommandGroupProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive.Group
      className={cn(
        'text-foreground overflow-hidden',
        '[&>[cmdk-group-items]]:mt-2',
        '[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-xs',
        className,
      )}
      {...rest}
    />
  )
}

type CommandSeparatorProps = React.ComponentProps<typeof CommandPrimitive.Separator>

function CommandSeparator(props: CommandSeparatorProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive.Separator className={cn('bg-border -mx-2 my-2 h-px', className)} {...rest} />
  )
}

type CommandItemProps = React.ComponentProps<typeof CommandPrimitive.Item>

function CommandItem(props: CommandItemProps) {
  const { className, ...rest } = props

  return (
    <CommandPrimitive.Item
      className={cn(
        'flex h-10 cursor-default items-center rounded-lg px-2 text-sm outline-none select-none [&:not(:first-child)]:mt-1',
        '[&_svg]:pointer-events-none [&_svg]:mr-2 [&_svg]:size-3.5',
        'aria-[selected=true]:bg-accent',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        '[&_kbd]:text-muted-foreground [&_kbd]:ml-auto [&_kbd]:text-xs',
        className,
      )}
      {...rest}
    />
  )
}

type CommandFooterProps = React.ComponentProps<'div'>

function CommandFooter(props: CommandFooterProps) {
  return (
    <div
      cmdk-footer=""
      className="flex h-10 w-full items-center justify-between rounded-b-lg border-t p-2"
      {...props}
    />
  )
}

type CommandFooterTriggerProps = {
  triggerKey: React.ReactNode
} & React.ComponentProps<'div'>

function CommandFooterTrigger(props: CommandFooterTriggerProps) {
  const { triggerKey, children, className, ...rest } = props

  return (
    <div className={cn('ml-auto flex items-center gap-2 text-xs', className)} {...rest}>
      {children}
      {triggerKey}
    </div>
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandFooterTrigger,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
}
