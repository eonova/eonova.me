import type { Metadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { allNotes } from 'content-collections'
import { notFound } from 'next/navigation'
import CommentSection from '~/components/modules/comment-section/comment-section'
import NoteMdx from '~/components/modules/mdx/note-mdx'
import Footer from '~/components/pages/notes/note-footer'
import Header from '~/components/pages/notes/note-header'
import Intro from '~/components/pages/notes/note-intro'
import Providers from '~/components/pages/notes/providers'
import TableOfContents from '~/components/pages/notes/table-of-contents'
import JsonLd from '~/components/shared/json-ld'
import MobileTableOfContents from '~/components/shared/mobile-table-of-contents'
import { MY_NAME } from '~/config/constants'
import { getNoteBySlug } from '~/lib/content'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils'

const url = '/notes'

export async function generateMetadata(props: PageProps<'/notes/[slug]'>): Promise<Metadata> {
  const { params } = props
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) {
    return {}
  }
  return createMetadata({
    pathname: `${url}/${note.slug}`,
    title: note.title,
    description: note.intro ?? '',
    openGraph: {
      type: 'article',
    },
  })
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return allNotes.map(n => ({ slug: n.slug }))
}

async function Page(props: PageProps<'/notes/[slug]'>) {
  const { slug } = await props.params

  const baseUrl = getBaseUrl()
  const note = getNoteBySlug(slug)
  const url = `${baseUrl}/notes/${slug}`

  if (!note) {
    notFound()
  }

  const { title, intro, date, code, toc } = note

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'name': title,
    'description': intro,
    url,
    'datePublished': date,
    'dateModified': date,
    'image': `${baseUrl}/og/${slug}`,
    'author': {
      '@type': 'Person',
      'name': MY_NAME,
      'url': baseUrl,
    },
    'publisher': {
      '@type': 'Person',
      'name': MY_NAME,
      'url': baseUrl,
    },
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <Providers note={note}>
        <div className="relative my-16 mb-8 flex w-full flex-col justify-between gap-2 overflow-visible rounded-[0_6px_6px_0] border-solid border-zinc-200/70 bg-white/50 p-8 md:col-start-1 lg:flex-row lg:border dark:border-neutral-800 dark:bg-zinc-900/50">
          <article className="w-full sm:px-4 pb-10">
            <Header className="my-4 mt-10" />
            {intro && <Intro intro={intro} />}
            <NoteMdx code={code} />
          </article>
          <aside className="hidden w-0 lg:ml-[-15vw] lg:block xl:ml-[-20vw]">
            <div className="sticky top-70 ml-15 lg:max-w-[200px] lg:min-w-[200px]">
              {toc.length > 0 && <TableOfContents toc={toc} />}
            </div>
          </aside>
        </div>
        <div className="flex w-full flex-col gap-4">
          <Footer />
          <CommentSection
            slug={slug}
            contentType="notes"
          />
        </div>
        <MobileTableOfContents toc={toc} />
      </Providers>
    </>
  )
}

export default Page
