import Link from 'next/link'
import { cn } from '~/lib/utils'
import { BlurImage } from './base/blur-image'
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
    <FadeContent blur={true} duration={300} easing="ease-out" initialOpacity={0}>
      <Link href={url} className={cn('shadow-feature-card dark:shadow-feature-card-dark group rounded-2xl flex gap-2 p-2 hover:bg-gray-200/20 dark:bg-gray-700/20 dark:hover:bg-gray-500/20', className)} target="black">
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
          <p className="text-sm text-gray-600/70 dark:text-white/50 text-ellipsis" title={desc}>{desc}</p>
        </div>
      </Link>
    </FadeContent>
  )
}

export default LinkCard
