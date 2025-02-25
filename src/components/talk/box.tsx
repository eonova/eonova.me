import { Heart, MessageCircle, Share2 } from 'lucide-react'
import Image from 'next/image'

interface TalkBoxProps {
  children: React.ReactNode
}

const TalkBox: React.FC<TalkBoxProps> = ({ children }) => {
  return (
    <div className="flex items-start gap-3 w-full">
      <Image
        className="hidden sm:block w-10 h-10 rounded-full"
        src="/images/home/avatar.webp"
        alt="avatar"
        width={200}
        height={200}
      />
      <div className="flex flex-col flex-1 w-full items-start gap-3">
        <div className="flex gap-4">
          <Image
            className="block sm:hidden w-9 h-9 rounded-full"
            src="/images/home/avatar.webp"
            alt="avatar"
            width={200}
            height={200}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <h3 className="text-sm sm:text-[14px] font-medium">LeoStar</h3>
            <p className="text-xs text-muted-foreground">2小时前</p>
          </div>
        </div>
        <div className="ml-3 sm:ml-0 bg-[#F6F6F7] dark:bg-[#2D2D30] p-3 rounded-xl rounded-tl-none">
          {children}
        </div>
        <div className="ml-3 sm:ml-0 flex items-center text-xs text-gray-500 dark:text-color-500/80 gap-4 w-full">
          <div className="flex items-center gap-1 cursor-pointer">
            <Heart className="h-3 w-3" />
            <span>12</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <MessageCircle className="h-3 w-3" />
            <span>8</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <Share2 className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TalkBox
