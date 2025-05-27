import type { Post } from 'content-collections'
import Link from 'next/link'
import { BottomToUpTransitionView } from '~/components/modules/transition/bottom-to-top'
import NonFound from '~/components/shared/non-found'
import TimelineList from '~/components/shared/timeline-list'

interface CategoriesContentProps {
  posts: Post[]
}

const CategoriesContent: React.FC<CategoriesContentProps> = (
  { posts },
) => {
  return (
    <>
      {
        posts.length > 0
          ? (
              <main className="mt-10 md:px-3 text-zinc-950/80 dark:text-zinc-50/80">
                <TimelineList>
                  {posts.map((child, i) => {
                    const date = new Date(child.date)

                    return (
                      <BottomToUpTransitionView
                        key={child.slug}
                        delay={700 + 50 * i}
                        as="li"
                        className="flex min-w-0 items-center justify-between leading-loose"
                      >
                        <Link
                          href={`/posts/${child.slug}`}
                          className="min-w-0 truncate"
                        >
                          {child.title}
                        </Link>
                        <span className="meta ml-2">
                          {(date.getMonth() + 1).toString().padStart(2, '0')}
                          /
                          {date.getDate().toString().padStart(2, '0')}
                          /
                          {date.getFullYear()}
                        </span>
                      </BottomToUpTransitionView>
                    )
                  })}
                </TimelineList>
              </main>
            )
          : <NonFound />
      }
    </>
  )
}

export default CategoriesContent
