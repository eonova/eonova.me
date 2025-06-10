import { albumRouter } from './routers/album'
import { bangumiRouter } from './routers/bangumi'
import { booksRouter } from './routers/books'
import { commentsRouter } from './routers/comments'
import { friendRouter } from './routers/friend'
import { githubRouter } from './routers/github'
import { guestbookRouter } from './routers/guestbook'
import { likesRouter } from './routers/likes'
import { moviesRouter } from './routers/movies'
import { ratesRouter } from './routers/rates'
import { spotifyRouter } from './routers/spotify'
import { talksRouter } from './routers/talks'
import { upyunRouter } from './routers/upyun'
import { usersRouter } from './routers/users'
import { viewsRouter } from './routers/views'
import { wakatimeRouter } from './routers/wakatime'
import { youtubeRouter } from './routers/youtube'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  github: githubRouter,
  youtube: youtubeRouter,
  wakatime: wakatimeRouter,
  views: viewsRouter,
  likes: likesRouter,
  spotify: spotifyRouter,
  comments: commentsRouter,
  guestbook: guestbookRouter,
  rates: ratesRouter,
  users: usersRouter,
  album: albumRouter,
  talks: talksRouter,
  movies: moviesRouter,
  books: booksRouter,
  bangumi: bangumiRouter,
  friend: friendRouter,
  upyun: upyunRouter,
})

export type AppRouter = typeof appRouter
