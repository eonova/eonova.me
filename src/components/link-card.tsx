import Link from 'next/link'
import { cn } from '~/lib/utils'
import { BlurImage } from './base/blur-image'
import FadeContent from './fade-content'
import { filterTextByLength } from '~/utils/filter-text'

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
    <FadeContent blur={true} duration={300} easing="ease-out" initialOpacity={0}>
      <Link href={url} className={cn('dark:shadow-inner dark:shadow-white/5 border border-black/5 dark:border-white/10 border-solid group rounded-2xl flex gap-2 p-2 shadow-feature-card hover:bg-gray-200/20 dark:bg-[#1d1e22]/30 dark:hover:bg-[#1d1e22]/10 h-36', className)} target="black">
        <div
          className="overflow-hidden rounded-full h-16 w-16"
        >
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
          <h3 className="text-md font-bold text-black dark:text-white" title={title}>{title}</h3>
          <p className="text-sm text-gray-600/70 dark:text-white/50 text-ellipsis" title={desc}>{filterTextByLength(desc, 32)}</p>
        </div>
      </Link>
    </FadeContent>
  )
}

export default LinkCard
