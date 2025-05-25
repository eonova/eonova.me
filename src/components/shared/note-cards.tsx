'use client'

import type { Note } from 'content-collections'

import { Clock, Cloud, Eye, Sticker, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { BottomToUpTransitionView } from '~/components/modules/transition'
import { api } from '~/trpc/react'
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

function NoteCard(props: NoteCardProps) {
  const { slug, title, mood, weather, date, idx } = props

  const viewsQuery = api.views.get.useQuery({
    slug,
  })

  const likesQuery = api.likes.get.useQuery({
    slug,
  })

  return (
    <BottomToUpTransitionView
      delay={700 + 50 * idx}
    >
      <Link
        href={`/notes/${slug}`}
        className="relative tracking-wide group rounded-xl hover:bg-slate-300/30 dark:hover:bg-slate-300/10 duration-500 p-5 w-full flex flex-col items-start gap-3 focus-visible:!shadow-none"
      >
        <h2 className="font-world text-3xl w-full">{title}</h2>
        <ul className="flex items-center gap-2.5">
          <li className="text-black/55 dark:text-white/55 flex gap-1 items-center">
            <Clock className="size-3" />
            <span className="text-sm">{formatDate(date)}</span>
          </li>
          <li className="text-black/55 dark:text-white/55 flex gap-1 items-center">
            <Cloud className="size-3" />
            <span className="text-sm">{weather}</span>
          </li>
          <li className="text-black/55 dark:text-white/55 flex gap-1 items-center">
            <Sticker className="size-3" />
            <span className="text-sm">{mood}</span>
          </li>
          <li className="text-black/55 dark:text-white/55 flex gap-1 items-center">
            <Eye className="size-3" />
            <span className="text-sm">
              {likesQuery.status === 'pending' && '--'}
              {likesQuery.status === 'error' && '错误'}
              {likesQuery.status === 'success' && likesQuery.data.likes}
            </span>
          </li>
          <li className="text-black/55 dark:text-white/55 flex gap-1 items-center">
            <ThumbsUp className="size-3" />
            <span className="text-sm">
              {viewsQuery.status === 'pending' && '--'}
              {viewsQuery.status === 'error' && '错误'}
              {viewsQuery.status === 'success' && viewsQuery.data.views}
            </span>
          </li>
        </ul>
      </Link>
    </BottomToUpTransitionView>
  )
}

export default NoteCards
