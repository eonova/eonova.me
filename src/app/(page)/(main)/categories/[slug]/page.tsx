import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import CategoriesContent from '~/components/pages/categories/content'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { SITE_URL } from '~/config/constants'
import { CATEGORIES } from '~/config/posts'
import { createMetadata } from '~/lib/metadata'

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(
  props: Readonly<PageProps>,
): Promise<Metadata> {
  const { slug } = await props.params

  const category = CATEGORIES.find(i => i.label === slug)
  if (!category)
    notFound()

  const url = `/categories/${slug}`

  return createMetadata({
    pathname: url,
    title: `分类 - ${category.name}`,
    description: category.name,
  })
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return CATEGORIES.map(i => ({ slug: i.label }))
}

async function Page(props: Readonly<PageProps>) {
  const { slug } = await props.params

  const posts = allPosts
    .filter(p => p.categories?.includes(slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const url = `${SITE_URL}/categories/${slug}`

  if (!posts) {
    notFound()
  }

  const title = `分类 - ${CATEGORIES.find(i => i.label === slug)?.name}`

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'headline': slug,
    'name': slug,
    'description': title,
    url,
    'image': `${SITE_URL}/og/${slug}`,
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={title} />
      <CategoriesContent posts={posts} />
    </>
  )
}

export default Page
