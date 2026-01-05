import { cn } from '~/utils/cn'

function Intro({ intro }: { intro: string }) {
  return (
    <p
      className={cn(
        'text-muted-foreground leading-loose',
        'text-black dark:text-white mb-16 mx-4',
      )}
    >
      <span>{intro}</span>
    </p>
  )
}

export default Intro
