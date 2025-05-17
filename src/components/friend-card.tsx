'use client'
import { motion } from 'motion/react'
import Image from 'next/image'

interface FriendCardProps {
  name: string
  url: string
  avatar: string
  description?: string
}

const FriendCard: React.FC<FriendCardProps> = ({ name, url, avatar, description }) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-3 border border-gray-200/20 rounded-lg no-underline text-inherit mb-3 transition-shadow shadow-sm hover:shadow-lg hover:scale-[1.03] focus:scale-[1.03] active:scale-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="mr-4">
        <Image
          unoptimized
          src={avatar}
          alt={name}
          width={48}
          height={48}
          className="rounded-full object-cover bg-gray-100"
        />
      </div>
      <div>
        <div className="font-semibold text-base">{name}</div>
        {description && (
          <div className="text-gray-500 text-sm mt-1">{description}</div>
        )}
      </div>
    </motion.a>
  )
}

export default FriendCard
