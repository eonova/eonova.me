import Link from 'next/link'
import { cn } from '~/lib/utils'
import { BlurImage } from './base/blur-image'

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
    <Link href={url} className={cn('shadow-feature-card dark:shadow-feature-card-dark group rounded-2xl flex gap-2 p-2', className)}>
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
        <h3 className="text-md font-bold" title={title}>{title}</h3>
        <p className="text-sm text-gray-600/70 text-ellipsis" title={desc}>{desc}</p>
      </div>
    </Link>
  )
}

export default LinkCard
