'use client'

import type { Note } from 'content-collections'

import { Clock, Cloud, Eye, MessageCircle, Sticker } from 'lucide-react'
import Link from 'next/link'
import { BottomToUpTransitionView } from '~/components/modules/transition'
import { useContentCommentCount } from '~/hooks/queries/comment.query'
import { useContentViewCount } from '~/hooks/queries/view.query'
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
  const viewsQuery = useContentViewCount({ slug, contentType: 'notes' })
  const commentCountQuery = useContentCommentCount({ slug, withReplies: true }, 'notes')

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
              {viewsQuery.isLoading && '--'}
              {viewsQuery.isError && '错误'}
              {viewsQuery.isSuccess && viewsQuery.data.views}
            </span>
          </li>
          <li className="flex items-center gap-1 text-black/55 dark:text-white/55">
            <MessageCircle className="size-3" />
            <span className="text-sm">
              {commentCountQuery.isLoading && '--'}
              {commentCountQuery.isError && '错误'}
              {commentCountQuery.isSuccess && commentCountQuery.data.count}
            </span>
          </li>
        </ul>
      </Link>
    </BottomToUpTransitionView>
  )
}

export default NoteCards
