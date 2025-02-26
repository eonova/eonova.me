import { Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import LikeButton from './likes'
import TalkMdx from './mdx'

interface TalkBoxProps {
  id?: string
  name?: string
  images?: string
  time?: Date
  children: string
}

const TalkBox: React.FC<TalkBoxProps> = ({
  id,
  children,
  images = '/images/home/avatar.webp',
  name = 'LeoStar',
  time = Date.now(),
}) => {
  return (
    <div className="flex items-start gap-3 w-full">
      <Image
        className="hidden sm:block w-10 h-10 rounded-full"
        src={images}
        alt="avatar"
        width={200}
        height={200}
      />
      <div className="flex flex-col flex-1 w-full items-start gap-3">
        <div className="flex gap-4">
          <Image
            className="block sm:hidden w-9 h-9 rounded-full"
            src={images}
            alt="avatar"
            width={200}
            height={200}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <h3 className="text-sm sm:text-[14px] font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground">{time.toLocaleString()}</p>
          </div>
        </div>
        <div className="relative min-w-0 grow">
          <div className="ml-3 sm:ml-0 bg-[#F6F6F7] dark:bg-[#2D2D30] p-3 rounded-xl rounded-tl-none relative max-w-full overflow-auto">
            <TalkMdx>
              {children}
            </TalkMdx>
          </div>
        </div>
        <div className="ml-3 sm:ml-0 flex items-center text-xs text-gray-500 dark:text-color-500/80 gap-4 w-full">
          {
            id
              ? <LikeButton initialLikes={0} talkId={id} />
              : (
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Heart className="h-3 w-3" />
                    <span>0</span>
                  </div>
                )
          }
          <div className="flex items-center gap-1 cursor-pointer">
            <Share2 className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TalkBox
