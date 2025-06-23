import type { TextareaAutosizeProps } from 'react-textarea-autosize'
import TextareaAutosize from 'react-textarea-autosize'
import { cn } from '~/utils'

type TextareaProps = TextareaAutosizeProps & React.ComponentProps<'textarea'>

function Textarea(props: TextareaProps) {
  const { className, ...rest } = props

  return (
    <TextareaAutosize
      className={cn(
        'border-input bg-background ring-offset-background flex min-h-20 w-full rounded-lg border px-3 py-2',
        'placeholder:text-muted-foreground',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  )
}

export { Textarea }
