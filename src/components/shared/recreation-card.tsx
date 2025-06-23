import { motion } from 'motion/react'
import Image from 'next/image'
import { cn } from '~/utils'

function getMinYear(dateString: string) {
  const datePattern = /\d{4}/g
  const dates = dateString.match(datePattern) ?? []
  if (dates.length === 0)
    return null
  const years = dates.map(date => Number.parseInt(date.substring(0, 4), 10))
  return Math.min(...years)
}

interface IRecreationCardProps {
  item: {
    title: string
    detailUrl: string
    coverUrl: string
    metaInfo: string
    score?: string
    rate?: string
    publishDate?: string
    rating?: string
    episodesInfo?: string
  }
  className?: string
}

const RecreationCard: React.FC<IRecreationCardProps> = ({ item, className }) => {
  const date = item.publishDate ? getMinYear(item.publishDate) : '---'

  return (
    <motion.a
      href={item.detailUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'relative block overflow-hidden rounded-xl shadow-lg transition-shadow hover:shadow-xl dark:bg-[#1E2939]',
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        width={300}
        height={500}
        src={item.coverUrl}
        alt={item.metaInfo}
        className="during-300 h-72 w-full object-cover transition-transform will-change-transform hover:scale-103 sm:h-80"
      />
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2.5 pt-4 text-sm text-white">
        <h3 className="mb-2 truncate text-center font-semibold" title={item.title}>
          {item.title}
        </h3>
        <div className="flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-[#2C2721] p-1 px-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-full text-white">
              <svg className="h-2.5 w-2.5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path>
              </svg>
              <span>{item.score ?? item.rate ?? '未评分'}</span>
              ·
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}
export default RecreationCard
