import type { Note, Post } from 'content-collections'
import Link from 'next/link'
import { BottomToUpTransitionView } from '~/components/modules/transition/bottom-to-top'
import NonFound from '~/components/shared/not-found'
import TimelineList from '~/components/shared/timeline-list'

interface ArchiveContentProps {
  articlesByYear: Record<string, (Post | Note)[]>
}

const ArchiveContent: React.FC<ArchiveContentProps> = ({ articlesByYear }) => {
  return (
    <>
      {articlesByYear && Object.keys(articlesByYear).length > 0
        ? (
            <main className="mt-10 text-zinc-950/80 md:px-3 dark:text-zinc-50/80">
              {Object.entries(articlesByYear)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([year, articles]) => {
                  return (
                    <ul key={year} className="mb-10">
                      <BottomToUpTransitionView
                        as="h4"
                        delay={700}
                        className="before:content-auto before:bg-accent relative mb-4 ml-3 rounded-md text-lg font-medium before:absolute before:inset-y-1 before:-left-3 before:w-0.5"
                      >
                        {year}
                      </BottomToUpTransitionView>
                      <TimelineList>
                        {(articles as (Post | Note)[]).map((child: Post | Note, i: number) => {
                          return (
                            <BottomToUpTransitionView
                              key={child.slug}
                              delay={700 + 50 * i}
                              as="li"
                              className="flex min-w-0 items-center justify-between leading-loose"
                            >
                              <Link href={`/${child.type}/${child.slug}`} className="min-w-0 truncate">
                                {child.title}
                              </Link>
                              <span className="meta ml-2">
                                {child.type === 'posts'
                                  ? `${child.categoriesText ?? ''}/文章`
                                  : `天气：${(child as Note).weather ?? ''}/心情：${(child as Note).mood ?? ''}/手记`}
                              </span>
                            </BottomToUpTransitionView>
                          )
                        })}
                      </TimelineList>
                    </ul>
                  )
                })}
            </main>
          )
        : (
            <NonFound />
          )}
    </>
  )
}

export default ArchiveContent
