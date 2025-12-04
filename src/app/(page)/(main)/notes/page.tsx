import type { Metadata } from 'next'
import type { Blog, WithContext } from 'schema-dts'

import { allNotes } from 'content-collections'
import NoteCards from '~/components/pages/notes/note-cards'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { SITE_NAME, SITE_URL } from '~/config/constants'
import { createMetadata } from '~/config/metadata'

const title = '手记'
const url = '/notes'
const description = '记录我的生活琐事，希望能帮助到你。'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: url,
    title,
    description,
  })
}
export const dynamic = 'force-static'

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
    'blogPost': notes.map(note => ({
      '@type': 'BlogPosting',
      'headline': note.title,
      'url': `${url}/${note.slug}`,
      'datePublished': note.date,
      'dateModified': note.date,
    })),
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      {notes.length === 0 ? <div className="my-24 text-center text-xl">暂无结果</div> : null}
      <NoteCards notes={notes} />
    </>
  )
}

export default Page
