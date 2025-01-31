import type { ButtonProps } from './button'
import { CheckIcon, CopyIcon } from 'lucide-react'
import mergeRefs from 'merge-refs'

import { useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils'
import { getIconByFilename } from '~/utils/get-icon-by-filename'
import { Button } from './button'
import { ScrollArea, ScrollBar } from './scroll-area'

type CodeBlockProps = {
  'data-lang'?: string
  'figureClassName'?: string
} & React.ComponentProps<'pre'>

function CodeBlock(props: CodeBlockProps) {
  const { children, className, title, 'data-lang': lang, figureClassName, ref, ...rest } = props

  const textInput = useRef<HTMLPreElement>(null)
  const Icon = getIconByFilename(lang ?? '')

  const onCopy = () => {
    void navigator.clipboard.writeText(textInput.current?.textContent ?? '')
  }

  return (
    <figure
      className={cn(
        'not-prose bg-secondary/50 relative my-6 overflow-hidden rounded-lg border text-sm',
        figureClassName,
      )}
    >
      {title
        ? (
            <div className="bg-muted/50 flex flex-row items-center gap-2 border-b px-4 py-1.5">
              <div className="text-muted-foreground">
                <Icon className="size-3.5" />
              </div>
              <figcaption className="text-muted-foreground flex-1 truncate">{title}</figcaption>
              <CopyButton onCopy={onCopy} />
            </div>
          )
        : (
            <CopyButton className="absolute right-1.5 top-1.5 z-10" onCopy={onCopy} />
          )}

      <ScrollArea>
        <pre ref={mergeRefs(textInput, ref)} className={cn('p-4', className)} {...rest}>
          {children}
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </figure>
  )
}

type CopyButtonProps = {
  onCopy: () => void
} & ButtonProps

function CopyButton(props: CopyButtonProps) {
  const { onCopy, ...rest } = props
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const copyResetTimeoutId = setTimeout(() => {
      setIsCopied(false)
    }, 2000)

    return () => {
      clearTimeout(copyResetTimeoutId)
    }
  }, [isCopied])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        onCopy()
        setIsCopied(true)
      }}
      aria-label="Copy code to clipboard"
      {...rest}
    >
      {isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
    </Button>
  )
}

export { CodeBlock }
