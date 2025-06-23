import { Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { dayjs } from '~/lib/dayjs'
import { useTalkStore } from '~/stores/talk'
import { cn } from '~/utils'
import LikeButton from './likes'
import TalkMdx from './mdx'

interface TalkBoxProps {
  id?: string
  name?: string
  images?: string
  time?: Date
  children: string
  likes?: number
}

const TalkBox: React.FC<TalkBoxProps> = ({
  id,
  children,
  images = '/images/home/avatar.webp',
  name = 'Eonova',
  time = Date.now(),
  likes = 0,
}) => {
  const { setIsOpenCommentDialog } = useTalkStore()
  return (
    <li className="mt-[50px] flex flex-col gap-2 space-y-2 sm:flex-row sm:gap-4">
      <div className="flex gap-3 sm:hidden sm:w-[40px]">
        <Image
          className="size-[32px] rounded-full ring-2 ring-slate-200 sm:size-[40px] dark:ring-zinc-800"
          src={images}
          alt="avatar"
          width={200}
          height={200}
        />
        <div className="flex flex-col items-center self-start md:flex-row md:gap-2">
          <span className="self-start text-sm font-medium sm:text-lg md:self-auto">{name}</span>
          <span className="text-xs opacity-80 md:-translate-y-1 md:self-end">
            {dayjs(time).format('YYYY 年 M 月 D 日 dddd')}
          </span>
        </div>
      </div>
      <Image
        className="hidden size-[32px] rounded-full ring-2 ring-slate-200 sm:block sm:size-[40px] dark:ring-zinc-800"
        src={images}
        alt="avatar"
        width={200}
        height={200}
      />
      <div className="flex max-w-full min-w-0 flex-col gap-2 pl-3 sm:gap-3 sm:pl-0">
        <div className="hidden flex-col items-center self-start sm:flex md:flex-row md:gap-2">
          <span className="self-start text-lg font-medium md:self-auto">{name}</span>
          <span className="text-xs opacity-80 md:-translate-y-1 md:self-end">
            {dayjs(time).format('YYYY 年 M 月 D 日 dddd')}
          </span>
        </div>
        <div className="relative w-full min-w-0 grow sm:w-auto">
          <div
            className={cn(
              'font-world relative inline-block rounded-xl p-3 text-zinc-800 dark:text-zinc-200',
              'rounded-tl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
              'max-w-full overflow-auto',
            )}
          >
            <TalkMdx>{children}</TalkMdx>
          </div>
        </div>
        <div className="dark:text-color-500/80 flex w-full items-center gap-4 text-xs text-gray-500 sm:gap-12">
          <div>
            {id
              ? (
                  <LikeButton initialLikes={likes} talkId={id} />
                )
              : (
                  <div className="flex cursor-pointer items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>0</span>
                  </div>
                )}
          </div>
          <div
            className="flex cursor-pointer items-center gap-1"
            onClick={() => setIsOpenCommentDialog(true)}
          >
            <MessageCircle className="h-3 w-3" />
            <span>0</span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default TalkBox
