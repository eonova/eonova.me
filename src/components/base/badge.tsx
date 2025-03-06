import type { VariantProps } from 'cva'
import { cva } from 'cva'
import { cn } from '~/utils'

const badgeVariants = cva({
  base: 'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground border-transparent shadow',
      secondary: 'bg-secondary text-secondary-foreground border-transparent shadow',
      destructive: 'bg-destructive text-destructive-foreground border-transparent shadow',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type BadgeProps = React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>

function Badge(props: BadgeProps) {
  const { className, variant, ...rest } = props

  return <div className={cn(badgeVariants({ variant }), className)} {...rest} />
}

export { Badge, badgeVariants }
