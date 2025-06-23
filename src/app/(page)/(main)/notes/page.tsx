import type { Metadata, ResolvingMetadata } from 'next'
import type { Blog, WithContext } from 'schema-dts'

import { allNotes, allPosts } from 'content-collections'
import NoteCards from '~/components/shared/note-cards'
import PageTitle from '~/components/shared/page-title'
import { SITE_NAME, SITE_URL } from '~/config/constants'

const title = '手记'
const url = '/notes'
const description = '记录我的生活琐事，希望能帮助到你。'

export async function generateMetadata(_props: any, parent: ResolvingMetadata): Promise<Metadata> {
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...previousOpenGraph,
      url,
      title,
      description,
    },
    twitter: {
      ...previousTwitter,
      title,
      description,
    },
  }
}

async function Page() {
  const notes = allNotes.toSorted((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const jsonLd: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url,
    'name': title,
    description,
    url,
    'author': {
      '@type': 'Person',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
    'blogPost': allPosts.map(post => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'url': `${url}/${post.slug}`,
      'datePublished': post.date,
      'dateModified': post.modifiedTime,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle title={title} description={description} />
      {notes.length === 0 ? <div className="my-24 text-center text-xl">暂无结果</div> : null}
      <NoteCards notes={notes} />
    </>
  )
}

export default Page
