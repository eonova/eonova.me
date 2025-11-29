import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import PageHeader from '~/components/layouts/page-header'
import Mdx from '~/components/modules/mdx'
import { createMetadata } from '~/config/metadata'
import { getPageBySlug } from '~/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const title = '条款'
  const description = '条款和条件'

  return createMetadata({
    pathname: '/terms',
    title,
    description,
  })
}

function Page() {
  const title = '条款'
  const description = '条款和条件'
  const page = getPageBySlug('terms')

  if (!page) {
    return notFound()
  }

  const { code } = page

  return (
    <>
      <PageHeader title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
