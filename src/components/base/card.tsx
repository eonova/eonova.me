import { cn } from '~/utils'

type CardProps = React.ComponentProps<'div'>

function Card(props: CardProps) {
  const { className, ...rest } = props

  return (
    <div
      className={cn('bg-card text-card-foreground rounded-lg border shadow-sm', className)}
      {...rest}
    />
  )
}

type CardHeaderProps = React.ComponentProps<'div'>

function CardHeader(props: CardHeaderProps) {
  const { className, ...rest } = props

  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...rest} />
}

type CardTitleProps = React.ComponentProps<'h3'>

function CardTitle(props: CardTitleProps) {
  const { className, ...rest } = props

  return <h3 className={cn('text-2xl font-semibold', className)} {...rest} />
}

type CardDescriptionProps = React.ComponentProps<'p'>

function CardDescription(props: CardDescriptionProps) {
  const { className, ...rest } = props

  return <p className={cn('text-muted-foreground text-sm', className)} {...rest} />
}

type CardContentProps = React.ComponentProps<'div'>

function CardContent(props: CardContentProps) {
  const { className, ...rest } = props

  return <div className={cn('px-6 pb-6', className)} {...rest} />
}

type CardFooterProps = React.ComponentProps<'div'>

function CardFooter(props: CardFooterProps) {
  const { className, ...rest } = props

  return <div className={cn('flex items-center px-6 pb-6', className)} {...rest} />
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
