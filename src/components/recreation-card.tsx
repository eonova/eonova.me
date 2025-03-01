import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '~/lib/utils'

function getMinYear(dateString: string) {
  const datePattern = /\d{4}-\d{2}-\d{2}/g
  const dates = dateString.match(datePattern) || []
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
    rate?: string
    publishDate?: string
    rating?: string
    episodesInfo?: string
  }
  className?: string
}

const RecreationCard: React.FC<IRecreationCardProps> = ({ item, className }) => {
  return (
    <motion.a
      href={item.detailUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        width={300}
        height={450}
        src={item.coverUrl}
        alt={item.metaInfo}
        className="w-full h-64 object-cover"
      />
      <div className="p-4 bg-background">
        <h3 className="font-semibold line-clamp-2 mb-2">{item.title}</h3>
        <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {item.metaInfo}
        </div>
        <div className="flex justify-between text-sm">
          {item.rating && (
            <span className="text-primary">
              ★
              {item.rating}
            </span>
          )}
          {item.episodesInfo && <span>{item.episodesInfo}</span>}
          {item.publishDate && <span>{getMinYear(item.publishDate)}</span>}
        </div>
      </div>
    </motion.a>
  )
}
export default RecreationCard
