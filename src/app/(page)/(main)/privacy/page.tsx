import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import PageHeader from '~/components/layouts/page-header'
import Mdx from '~/components/modules/mdx'
import { getPageBySlug } from '~/lib/content'
import { createMetadata } from '~/lib/metadata'

const title = '隐私政策'
const description = '隐私政策和条款'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/privacy',
    title,
    description,
  })
}

async function Page() {
  const page = await getPageBySlug('privacy')

  if (!page) {
    return notFound()
  }

  const { content } = page
  const code = await content()

  return (
    <>
      <PageHeader title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
