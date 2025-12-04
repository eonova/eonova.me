import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import PageHeader from '~/components/layouts/page-header'
import Mdx from '~/components/modules/mdx'
import { createMetadata } from '~/config/metadata'
import { getPageBySlug } from '~/lib/content'

const title = '隐私政策'
const description = '隐私政策和条款'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title,
    description,
  })
}

function Page() {
  const page = getPageBySlug('privacy')

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
