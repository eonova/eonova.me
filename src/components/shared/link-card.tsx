import Link from 'next/link'
import { BlurImage } from '~/components/base/blur-image'
import { cn } from '~/utils'
import FadeContent from './fade-content'

interface LinkCardProps {
  props: {
    images: string
    url: string
    title: string
    desc: string
  }
  className?: string
}

const LinkCard: React.FC<LinkCardProps> = ({ props, className }) => {
  const { images, title, desc, url } = props
  return (
    <FadeContent blur duration={300} easing="ease-out" initialOpacity={0}>
      <Link
        href={url as any}
        className={cn(
          'group shadow-feature-card during-300 flex h-32 gap-3 rounded-2xl border border-solid border-black/5 p-2 hover:bg-gray-200/20 dark:border-white/10 dark:bg-[#1d1e22]/30 dark:shadow-inner dark:shadow-white/5 dark:hover:bg-[#1d1e22]/10',
          className,
        )}
        target="black"
      >
        <div className="h-12 w-12 overflow-hidden rounded-full">
          <BlurImage
            src={images}
            width={80}
            height={80}
            imageClassName="transition-transform group-hover:scale-105"
            alt={title}
            unoptimized
          />
        </div>
        <div className="w-[70%]">
          <h3 className="text-md font-bold text-black dark:text-white" title={title}>
            {title}
          </h3>
          <p
            className="line-clamp-3 text-sm text-ellipsis text-gray-600/70 dark:text-white/50"
            title={desc}
          >
            {desc}
          </p>
        </div>
      </Link>
    </FadeContent>
  )
}

export default LinkCard
