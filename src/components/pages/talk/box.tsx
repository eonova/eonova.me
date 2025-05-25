import { Heart } from 'lucide-react'
import Image from 'next/image'
import { dayjs } from '~/lib/dayjs'
import { cn } from '~/utils'
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
  name = 'Eonova',
  time = Date.now(),
}) => {
  return (
    <li className="flex flex-col sm:flex-row mt-[50px] gap-2 sm:gap-4 space-y-2">
      <div className="flex sm:hidden gap-3 sm:w-[40px]">
        <Image
          className="size-[32px] sm:size-[40px] ring-2 ring-slate-200 dark:ring-zinc-800 rounded-full"
          src={images}
          alt="avatar"
          width={200}
          height={200}
        />
        <div className="flex flex-col items-center self-start md:flex-row md:gap-2">
          <span className="self-start text-sm sm:text-lg font-medium md:self-auto">{name}</span>
          <span className="text-xs opacity-80 md:-translate-y-1 md:self-end">
            {dayjs(time).format('YYYY 年 M 月 D 日 dddd')}
          </span>
        </div>
      </div>
      <Image
        className="hidden sm:block size-[32px] sm:size-[40px] ring-2 ring-slate-200 dark:ring-zinc-800 rounded-full"
        src={images}
        alt="avatar"
        width={200}
        height={200}
      />
      <div className="min-w-0 max-w-full flex flex-col gap-2 sm:gap-3 pl-3 sm:pl-0">
        <div className="hidden sm:flex flex-col items-center self-start md:flex-row md:gap-2">
          <span className="self-start text-lg font-medium md:self-auto">{name}</span>
          <span className="text-xs opacity-80 md:-translate-y-1 md:self-end">
            {dayjs(time).format('YYYY 年 M 月 D 日 dddd')}
          </span>
        </div>
        <div className="relative w-full sm:w-auto min-w-0 grow">
          <div
            className={cn(
              'relative inline-block rounded-xl p-3 font-world text-zinc-800 dark:text-zinc-200',
              'rounded-tl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
              'max-w-full overflow-auto',
            )}
          >
            <TalkMdx>
              {children}
            </TalkMdx>
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-color-500/80 gap-4 w-full">
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
        </div>
      </div>
    </li>
  )
}

export default TalkBox
