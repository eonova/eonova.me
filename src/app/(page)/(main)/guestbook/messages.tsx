'use client'

import type { MessageContext } from '~/contexts/message'

import type { GetInfiniteMessagesOutput } from '~/trpc/routers/guestbook'
import { keepPreviousData } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '~/components/base'

import { MessageProvider } from '~/contexts/message'
import { useFormattedDate } from '~/hooks/use-formatted-date'
import { useSession } from '~/lib/auth-client'
import { api } from '~/trpc/react'

import DeleteButton from './delete-button'
import MessagesLoader from './messages-loader'

interface UpdatedDateProps {
  date: Date
}

interface MessageProps {
  message: GetInfiniteMessagesOutput['messages'][number]
}

function UpdatedDate(props: UpdatedDateProps) {
  const { date } = props
  const formattedDate = useFormattedDate(date, {
    format: 'YYYY-MM-DD',
    loading: '--',
  })

  if (!formattedDate)
    return <Skeleton className="h-4 w-24 rounded-md" />

  return <div className="text-muted-foreground text-xs">{formattedDate}</div>
}

function Messages() {
  const { status, data, fetchNextPage, hasNextPage, isFetchingNextPage }
    = api.guestbook.getInfiniteMessages.useInfiniteQuery(
      {},
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
        placeholderData: keepPreviousData,
      },
    )

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage)
      fetchNextPage()
  }, [fetchNextPage, hasNextPage, inView])

  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isLoading = status === 'pending' || isFetchingNextPage
  const noMessages = status === 'success' && data.pages[0]?.messages.length === 0

  return (
    <div className="flex flex-col gap-4" data-testid="guestbook-messages-list">
      {isSuccess
        ? data.pages.map(page =>
            page.messages.map(message => <Message key={message.id} message={message} />),
          )
        : null}
      {noMessages
        ? (
            <div className="flex min-h-24 items-center justify-center">
              <p className="text-muted-foreground text-sm">没有留言，快来成为第一位留言者！</p>
            </div>
          )
        : null}
      {isError
        ? (
            <div className="flex min-h-24 items-center justify-center">
              <p className="text-muted-foreground text-sm">无法载入留言。请刷新页面。</p>
            </div>
          )
        : null}
      {isLoading ? <MessagesLoader /> : null}
      <span ref={ref} className="invisible" />
    </div>
  )
}

function Message(props: MessageProps) {
  const { message } = props
  const { data } = useSession()

  const {
    message: {
      id,
      user: { name, image, id: userId },
      updatedAt,
      body,
    },
  } = props

  const context = useMemo<MessageContext>(
    () => ({
      message,
    }),
    [message],
  )

  const isAuthor = data?.user && userId === data.user.id

  return (
    <MessageProvider value={context}>
      <div className="rounded-lg border p-4 shadow-sm dark:bg-zinc-900/30" id={`message-${id}`}>
        <div className="mb-3 flex gap-3">
          <Avatar>
            <AvatarImage
              src={image}
              width={40}
              height={40}
              className="size-10 rounded-full"
              alt={name}
            />
            <AvatarFallback className="bg-transparent">
              <Skeleton className="size-10 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center gap-px text-sm">
            <div>{name}</div>
            <UpdatedDate date={updatedAt} />
          </div>
        </div>
        <div className="break-words pl-[52px]">{body}</div>
        {isAuthor ? <DeleteButton /> : null}
      </div>
    </MessageProvider>
  )
}

export default Messages
