import type { Metadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { allNotes } from 'content-collections'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '~/components/base/skeleton'
import CommentSection from '~/components/modules/comment-section/comment-section'
import NoteMdx from '~/components/modules/mdx/note-mdx'
import Footer from '~/components/pages/notes/note-footer'
import Header from '~/components/pages/notes/note-header'
import Providers from '~/components/pages/notes/providers'
import TableOfContents from '~/components/pages/notes/table-of-contents'
import MobileTableOfContents from '~/components/shared/mobile-table-of-contents'
import { SITE_NAME, SITE_URL } from '~/config/constants'
import { createMetadata } from '~/config/metadata'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const url = '/notes'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const note = allNotes.find(n => n.slug === params.slug)
  if (!note) {
    return {}
  }
  return createMetadata({
    pathname: `${url}/${note.slug}`,
    title: note.title,
    description: note.summary ?? '',
    openGraph: {
      type: 'article',
    },
  })
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return allNotes.map(n => ({ slug: n.slug }))
}

async function Page(props: Readonly<PageProps>) {
  const { slug } = await props.params

  const note = allNotes.find(p => p.slug === slug)
  const url = `${SITE_URL}/notes/${slug}`

  if (!note) {
    notFound()
  }

  const { title, summary, date, code, toc } = note

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'name': title,
    'description': summary,
    url,
    'datePublished': date,
    'dateModified': date,
    'image': `${SITE_URL}/og/${slug}`,
    'author': {
      '@type': 'Person',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
    'publisher': {
      '@type': 'Person',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Providers note={note}>
        <div className="relative my-16 mb-8 flex w-full flex-col justify-between gap-2 overflow-visible rounded-[0_6px_6px_0] border-solid border-zinc-200/70 bg-white p-10 md:col-start-1 lg:flex-row lg:border dark:border-neutral-800 dark:bg-zinc-900/50">
          <article className="w-full sm:px-4 pb-10">
            <Header />
            <NoteMdx code={code} />
          </article>
          <aside className="hidden w-[0] lg:ml-[-15vw] lg:block xl:ml-[-20vw]">
            <div className="sticky top-60 ml-15 lg:max-w-[200px] lg:min-w-[200px]">
              {toc.length > 0 && <TableOfContents toc={toc} />}
            </div>
          </aside>
        </div>
        {toc.length > 0 && <MobileTableOfContents toc={toc} />}
        <Footer />
      </Providers>

      <Suspense fallback={<div className="mt-8"><Skeleton className="h-24 w-full" /></div>}>
        <CommentSection slug={slug} contentType="notes" />
      </Suspense>
    </>
  )
}

export default Page
