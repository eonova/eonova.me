import type { Authors, Blog } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { ReactNode } from 'react'
import siteMetadata from '@/data/siteMetadata'
import Comments from '~/components/Comments'
import Link from '~/components/Link'
import PageTitle from '~/components/PageTitle'
import ScrollTopAndComment from '~/components/ScrollTopAndComment'
import SectionContainer from '~/components/SectionContainer'

const editUrl = path => `${siteMetadata.siteRepo}/blob/main/data/${path}`
function discussUrl(path) {
  return `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`
}

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string, title: string }
  prev?: { path: string, title: string }
  children: ReactNode
}

export default function PostLayout({ content, children }: LayoutProps) {
  const { filePath, path, slug, date, title } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
            <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
            <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
              <Link href={discussUrl(path)} rel="nofollow">
                Discuss on Twitter
              </Link>
              {` • `}
              <Link href={editUrl(filePath)}>View on GitHub</Link>
            </div>
            {siteMetadata.comments && (
              <div
                className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                id="comment"
              >
                <Comments slug={slug} />
              </div>
            )}
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
