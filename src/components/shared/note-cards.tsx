'use client'

import type { Note } from 'content-collections'

import { useQuery } from '@tanstack/react-query'
import { Clock, Cloud, Eye, Sticker, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { BottomToUpTransitionView } from '~/components/modules/transition'
import { useTRPC } from '~/trpc/client'
import { formatDate } from '~/utils'

interface NoteCardsProps {
  notes: Note[]
}

type NoteCardProps = Note

function NoteCards(props: NoteCardsProps) {
  const { notes } = props

  return (
    <ul className="flex flex-col gap-5">
      {notes.map((post, idx) => (
        <NoteCard key={post.slug} {...post} idx={idx} />
      ))}
    </ul>
  )
}

function NoteCard(props: NoteCardProps & { idx: number }) {
  const { slug, title, mood, weather, date, idx } = props
  const trpc = useTRPC()
  const viewsQuery = useQuery(
    trpc.views.get.queryOptions({
      slug,
    }),
  )

  const likesQuery = useQuery(
    trpc.likes.get.queryOptions({
      slug,
    }),
  )

  return (
    <BottomToUpTransitionView delay={700 + 50 * idx}>
      <Link
        href={`/notes/${slug}`}
        className="group relative flex w-full flex-col items-start gap-3 rounded-xl p-5 tracking-wide duration-500 hover:bg-slate-300/30 focus-visible:!shadow-none dark:hover:bg-slate-300/10"
      >
        <h2 className="font-world w-full text-3xl">{title}</h2>
        <ul className="flex items-center gap-2.5">
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <Clock className="size-3" />
            <span className="text-sm">{formatDate(date)}</span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <Cloud className="size-3" />
            <span className="text-sm">{weather}</span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <Sticker className="size-3" />
            <span className="text-sm">{mood}</span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <Eye className="size-3" />
            <span className="text-sm">
              {viewsQuery.status === 'pending' && '--'}
              {viewsQuery.status === 'error' && '错误'}
              {viewsQuery.status === 'success' && viewsQuery.data.views}
            </span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <ThumbsUp className="size-3" />
            <span className="text-sm">
              {likesQuery.status === 'pending' && '--'}
              {likesQuery.status === 'error' && '错误'}
              {likesQuery.status === 'success' && likesQuery.data.likes}
            </span>
          </li>
        </ul>
      </Link>
    </BottomToUpTransitionView>
  )
}

export default NoteCards
