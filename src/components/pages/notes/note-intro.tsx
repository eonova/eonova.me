import { cn } from '~/utils/cn'

function Intro({ intro }: { intro: string }) {
  return (
    <p
      className={cn(
        'text-muted-foreground leading-loose',
        'first-letter:float-left first-letter:mr-3 first-letter:my-[15px] first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-foreground font-yozai text-black dark:text-white mb-16',
      )}
    >
      <span>{intro}</span>
    </p>
  )
}

export default Intro
